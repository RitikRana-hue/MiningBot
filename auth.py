"""
Production-grade authentication and authorization
JWT-based with proper password hashing
"""
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime, timedelta

jwt = JWTManager()


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns: (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, ""


def hash_password(password: str) -> str:
    """Hash password using werkzeug"""
    return generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)


def verify_password(password_hash: str, password: str) -> bool:
    """Verify password against hash"""
    return check_password_hash(password_hash, password)


def require_auth(f):
    """Decorator to require JWT authentication"""
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def optional_auth(f):
    """Decorator for optional JWT authentication"""
    @wraps(f)
    @jwt_required(optional=True)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def rate_limit_key():
    """Get rate limit key based on user or IP"""
    try:
        user_id = get_jwt_identity()
        return f"user:{user_id}"
    except:
        return f"ip:{request.remote_addr}"


# Token blacklist for logout
token_blacklist = set()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """Check if token has been revoked"""
    jti = jwt_payload['jti']
    return jti in token_blacklist


def revoke_token(jti: str):
    """Add token to blacklist"""
    token_blacklist.add(jti)


# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'error': 'token_expired',
        'message': 'The token has expired'
    }), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'error': 'invalid_token',
        'message': 'Signature verification failed'
    }), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'error': 'authorization_required',
        'message': 'Request does not contain an access token'
    }), 401


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'error': 'token_revoked',
        'message': 'The token has been revoked'
    }), 401
