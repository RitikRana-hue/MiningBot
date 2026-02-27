"""
Production-Grade MiningAI Backend
- JWT Authentication
- Rate Limiting
- Input Validation
- Structured Logging
- Error Handling
- Database Integration
- Security Headers
"""
import os
import time
import logging
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

# Import our modules
from config import get_config
from auth import (
    jwt, require_auth, optional_auth, validate_email, validate_password,
    hash_password, verify_password, create_access_token, create_refresh_token,
    get_jwt_identity, revoke_token, get_jwt
)
from database import init_db, get_db, User, ChatHistory, APIUsage, AuditLog
from validators import validate_question, validate_file_upload, get_client_ip, sanitize_filename
from pdf_processor import PDFRAGSystem

# Configure structured logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Initialize Flask app
app = Flask(__name__)

# Load configuration
config = get_config()
app.config.from_object(config)

# Initialize Sentry for error tracking
if config.SENTRY_DSN:
    sentry_sdk.init(
        dsn=config.SENTRY_DSN,
        integrations=[FlaskIntegration()],
        traces_sample_rate=0.1,
        environment=config.ENV
    )

# Initialize JWT
jwt.init_app(app)

# Initialize database
init_db(config.DATABASE_URL)

# Configure CORS with strict origins
CORS(app, resources={
    r"/api/*": {
        "origins": config.ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Configure rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[config.RATELIMIT_DEFAULT],
    storage_uri=config.RATE_LIMIT_STORAGE_URL
)

# Security headers
if config.ENV == 'production':
    Talisman(app,
        force_https=True,
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        content_security_policy={
            'default-src': "'self'",
            'script-src': ["'self'"],
            'style-src': ["'self'", "'unsafe-inline'"],
            'img-src': ["'self'", 'data:', 'https:'],
        },
        content_security_policy_nonce_in=['script-src']
    )

@app.after_request
def set_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response


# Initialize AI components
try:
    from main import GeminiAI, QuestionAnalyzer
    gemini_ai = GeminiAI()
    question_analyzer = QuestionAnalyzer()
    logger.info("AI components initialized", extra={"gemini_available": gemini_ai.is_available()})
except Exception as e:
    logger.error("Failed to initialize AI components", extra={"error": str(e)}, exc_info=True)
    gemini_ai = None
    question_analyzer = None

# Initialize PDF RAG
try:
    pdf_rag = PDFRAGSystem()
    logger.info("PDF RAG initialized", extra={"chunks": len(pdf_rag.chunks) if pdf_rag.chunks else 0})
except Exception as e:
    logger.error("Failed to initialize PDF RAG", extra={"error": str(e)}, exc_info=True)
    pdf_rag = None


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    """Register new user"""
    start_time = time.time()
    
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        
        # Validate inputs
        if not email or not password or not name:
            return jsonify({"error": "Email, password, and name are required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        if len(name) < 2 or len(name) > 100:
            return jsonify({"error": "Name must be between 2 and 100 characters"}), 400
        
        # Check if user exists
        db = next(get_db())
        existing_user = db.query(User).filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Create user
        user = User(
            email=email,
            password_hash=hash_password(password),
            name=name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        # Log audit
        audit = AuditLog(
            user_id=user.id,
            action='user_registered',
            ip_address=get_client_ip(),
            user_agent=request.headers.get('User-Agent', '')[:500],
            success=True
        )
        db.add(audit)
        db.commit()
        
        logger.info("User registered", extra={
            "user_id": user.id,
            "email": email,
            "response_time_ms": (time.time() - start_time) * 1000
        })
        
        return jsonify({
            "success": True,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        logger.error("Registration error", extra={"error": str(e)}, exc_info=True)
        return jsonify({"error": "Registration failed"}), 500


@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    """Login user"""
    start_time = time.time()
    
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user
        db = next(get_db())
        user = db.query(User).filter_by(email=email).first()
        
        if not user or not verify_password(user.password_hash, password):
            # Log failed attempt
            audit = AuditLog(
                user_id=user.id if user else None,
                action='login_failed',
                ip_address=get_client_ip(),
                user_agent=request.headers.get('User-Agent', '')[:500],
                success=False,
                details={"email": email}
            )
            db.add(audit)
            db.commit()
            
            return jsonify({"error": "Invalid email or password"}), 401
        
        if not user.is_active:
            return jsonify({"error": "Account is disabled"}), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        # Log successful login
        audit = AuditLog(
            user_id=user.id,
            action='login_success',
            ip_address=get_client_ip(),
            user_agent=request.headers.get('User-Agent', '')[:500],
            success=True
        )
        db.add(audit)
        db.commit()
        
        logger.info("User logged in", extra={
            "user_id": user.id,
            "email": email,
            "response_time_ms": (time.time() - start_time) * 1000
        })
        
        return jsonify({
            "success": True,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error("Login error", extra={"error": str(e)}, exc_info=True)
        return jsonify({"error": "Login failed"}), 500


@app.route('/api/auth/logout', methods=['POST'])
@require_auth
def logout():
    """Logout user (revoke token)"""
    try:
        jti = get_jwt()['jti']
        revoke_token(jti)
        
        user_id = get_jwt_identity()
        
        # Log logout
        db = next(get_db())
        audit = AuditLog(
            user_id=user_id,
            action='logout',
            ip_address=get_client_ip(),
            success=True
        )
        db.add(audit)
        db.commit()
        
        logger.info("User logged out", extra={"user_id": user_id})
        
        return jsonify({"success": True, "message": "Logged out successfully"}), 200
        
    except Exception as e:
        logger.error("Logout error", extra={"error": str(e)}, exc_info=True)
        return jsonify({"error": "Logout failed"}), 500


@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        access_token = create_access_token(identity=user_id)
        
        return jsonify({"access_token": access_token}), 200
        
    except Exception as e:
        logger.error("Token refresh error", extra={"error": str(e)}, exc_info=True)
        return jsonify({"error": "Token refresh failed"}), 500


# ============================================================================
# CHAT ENDPOINTS
# ============================================================================

@app.route('/api/chat', methods=['POST'])
@require_auth
@limiter.limit(config.RATELIMIT_CHAT)
def chat():
    """Process chat message with authentication and validation"""
    start_time = time.time()
    user_id = get_jwt_identity()
    
    try:
        data = request.json
        question = data.get('question', '')
        
        # Validate question
        is_valid, sanitized_question, error_msg = validate_question(
            question,
            max_length=config.MAX_QUESTION_LENGTH
        )
        
        if not is_valid:
            return jsonify({"error": error_msg, "success": False}), 400
        
        logger.info("Chat request received", extra={
            "user_id": user_id,
            "question_length": len(sanitized_question)
        })
        
        # Process with AI (import from original main.py)
        # This is a simplified version - integrate your actual SmartMiningChatbot logic
        if not pdf_rag or not gemini_ai:
            return jsonify({
                "error": "AI services not available",
                "success": False
            }), 503
        
        # Search PDFs
        pdf_results = pdf_rag.search(sanitized_question, top_k=5)
        
        if not pdf_results:
            response_text = "I couldn't find relevant information in the provided documents."
            confidence = 0.0
            source = "no_results"
            pdf_sources = []
        else:
            # Get context and generate response
            pdf_context = "\n\n".join([r['text'] for r in pdf_results])
            pdf_sources = list(set([r['metadata']['source'] for r in pdf_results]))
            confidence = pdf_results[0]['similarity_score']
            
            gemini_response = gemini_ai.get_response(sanitized_question, pdf_context)
            
            if gemini_response:
                response_text = gemini_response
                source = "pdf_rag_gemini"
            else:
                response_text = f"Based on the documents: {pdf_results[0]['text'][:800]}"
                source = "pdf_raw"
        
        # Save to database
        db = next(get_db())
        chat_history = ChatHistory(
            user_id=user_id,
            question=sanitized_question,
            response=response_text,
            source=source,
            confidence=confidence,
            pdf_sources=pdf_sources
        )
        db.add(chat_history)
        
        # Track API usage
        response_time_ms = (time.time() - start_time) * 1000
        api_usage = APIUsage(
            user_id=user_id,
            endpoint='/api/chat',
            method='POST',
            status_code=200,
            response_time_ms=response_time_ms,
            gemini_tokens_used=len(response_text) // 4  # Rough estimate
        )
        db.add(api_usage)
        db.commit()
        
        logger.info("Chat response generated", extra={
            "user_id": user_id,
            "source": source,
            "confidence": confidence,
            "response_time_ms": response_time_ms
        })
        
        return jsonify({
            "response": response_text,
            "confidence": confidence,
            "source": source,
            "pdf_sources": pdf_sources,
            "success": True
        }), 200
        
    except Exception as e:
        logger.error("Chat error", extra={
            "user_id": user_id,
            "error": str(e)
        }, exc_info=True)
        
        # Track error
        db = next(get_db())
        api_usage = APIUsage(
            user_id=user_id,
            endpoint='/api/chat',
            method='POST',
            status_code=500,
            response_time_ms=(time.time() - start_time) * 1000,
            error_message=str(e)[:500]
        )
        db.add(api_usage)
        db.commit()
        
        return jsonify({
            "error": "An error occurred processing your request",
            "success": False
        }), 500


@app.route('/api/chat/history', methods=['GET'])
@require_auth
@limiter.limit("60 per minute")
def get_chat_history():
    """Get user's chat history"""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        if per_page > 100:
            per_page = 100
        
        db = next(get_db())
        query = db.query(ChatHistory).filter_by(user_id=user_id).order_by(ChatHistory.created_at.desc())
        
        total = query.count()
        history = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return jsonify({
            "history": [h.to_dict() for h in history],
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        logger.error("Get history error", extra={"error": str(e)}, exc_info=True)
        return jsonify({"error": "Failed to retrieve history"}), 500


# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Comprehensive health check"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Check Gemini AI
    try:
        if gemini_ai and gemini_ai.is_available():
            health_status["checks"]["gemini"] = "healthy"
        else:
            health_status["checks"]["gemini"] = "unavailable"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["gemini"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check PDF RAG
    try:
        if pdf_rag and pdf_rag.index:
            health_status["checks"]["pdf_rag"] = "healthy"
            health_status["checks"]["pdf_chunks"] = len(pdf_rag.chunks)
        else:
            health_status["checks"]["pdf_rag"] = "unavailable"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["pdf_rag"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check database
    try:
        db = next(get_db())
        db.execute("SELECT 1")
        health_status["checks"]["database"] = "healthy"
    except Exception as e:
        health_status["checks"]["database"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check disk space
    import shutil
    try:
        disk = shutil.disk_usage("/")
        free_percent = (disk.free / disk.total) * 100
        if free_percent < 10:
            health_status["checks"]["disk"] = f"low_space ({free_percent:.1f}% free)"
            health_status["status"] = "degraded"
        else:
            health_status["checks"]["disk"] = f"healthy ({free_percent:.1f}% free)"
    except Exception as e:
        health_status["checks"]["disk"] = f"error: {str(e)}"
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return jsonify(health_status), status_code


@app.route('/api/status', methods=['GET'])
@optional_auth
def status():
    """Get system status"""
    user_id = get_jwt_identity()
    
    status_info = {
        "mode": "pdf_rag_gemini",
        "gemini_available": gemini_ai.is_available() if gemini_ai else False,
        "pdf_rag_available": pdf_rag is not None and pdf_rag.index is not None,
        "authenticated": user_id is not None
    }
    
    if pdf_rag:
        status_info["pdf_chunks"] = len(pdf_rag.chunks) if pdf_rag.chunks else 0
        status_info["pdfs_processed"] = len(set([m['source'] for m in pdf_rag.metadata])) if pdf_rag.metadata else 0
    
    return jsonify(status_info), 200


@app.route('/', methods=['GET'])
def home():
    """API information"""
    return jsonify({
        "name": "MiningAI API",
        "version": "2.0.0",
        "environment": config.ENV,
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login", "/api/auth/logout"],
            "chat": ["/api/chat", "/api/chat/history"],
            "health": ["/api/health", "/api/status"]
        }
    }), 200


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(error):
    logger.error("Internal server error", exc_info=True)
    return jsonify({"error": "Internal server error"}), 500


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded", "message": str(e.description)}), 429


# ============================================================================
# STARTUP
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    
    logger.info("Starting MiningAI API", extra={
        "environment": config.ENV,
        "port": port,
        "gemini_available": gemini_ai.is_available() if gemini_ai else False,
        "pdf_rag_available": pdf_rag is not None
    })
    
    app.run(
        debug=config.DEBUG,
        host='0.0.0.0',
        port=port,
        use_reloader=False
    )
