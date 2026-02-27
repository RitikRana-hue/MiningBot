"""
Production-grade database models using SQLAlchemy
Replaces pickle files and localStorage
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from datetime import datetime
import os

Base = declarative_base()


class User(Base):
    """User model with secure password storage"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    
    def to_dict(self):
        """Convert to dictionary (exclude password)"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


class DocumentChunk(Base):
    """Document chunks with embeddings for RAG"""
    __tablename__ = 'document_chunks'
    
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    embedding = Column(JSON)  # Store as JSON for now, use pgvector in production
    source = Column(String(255), nullable=False, index=True)
    chunk_id = Column(Integer, nullable=False)
    total_chunks = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'source': self.source,
            'chunk_id': self.chunk_id,
            'total_chunks': self.total_chunks
        }


class ChatHistory(Base):
    """Chat history per user"""
    __tablename__ = 'chat_history'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    question = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    source = Column(String(50))
    confidence = Column(Float)
    pdf_sources = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'response': self.response,
            'source': self.source,
            'confidence': self.confidence,
            'pdf_sources': self.pdf_sources,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class APIUsage(Base):
    """Track API usage for billing and monitoring"""
    __tablename__ = 'api_usage'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    status_code = Column(Integer)
    response_time_ms = Column(Float)
    gemini_tokens_used = Column(Integer)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class AuditLog(Base):
    """Security audit log"""
    __tablename__ = 'audit_logs'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(255))
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    success = Column(Boolean, default=True)
    details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


# Database session management
engine = None
SessionLocal = None


def init_db(database_url: str):
    """Initialize database connection"""
    global engine, SessionLocal
    
    engine = create_engine(
        database_url,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )
    
    SessionLocal = scoped_session(sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    ))
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    return engine


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def close_db():
    """Close database connection"""
    if SessionLocal:
        SessionLocal.remove()
    if engine:
        engine.dispose()
