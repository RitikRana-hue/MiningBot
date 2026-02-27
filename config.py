"""
Production-grade configuration management
Separates dev/staging/production environments
"""
import os
from datetime import timedelta

class Config:
    """Base configuration"""
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # API Keys
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///miningai.db')
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    
    # Rate Limiting
    RATE_LIMIT_STORAGE_URL = os.getenv('RATE_LIMIT_STORAGE_URL', 'memory://')
    RATELIMIT_DEFAULT = "200 per day, 50 per hour"
    RATELIMIT_CHAT = "10 per minute"
    
    # File Upload
    MAX_FILE_SIZE_MB = int(os.getenv('MAX_FILE_SIZE_MB', '10'))
    ALLOWED_FILE_TYPES = os.getenv('ALLOWED_FILE_TYPES', 
        'application/pdf,text/csv,application/json,image/jpeg,image/png').split(',')
    
    # API Configuration
    API_TIMEOUT_SECONDS = int(os.getenv('API_TIMEOUT_SECONDS', '30'))
    MAX_QUESTION_LENGTH = int(os.getenv('MAX_QUESTION_LENGTH', '1000'))
    
    # Monitoring
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    
    # Validate required settings
    @classmethod
    def validate(cls):
        required = ['SECRET_KEY', 'JWT_SECRET_KEY', 'GEMINI_API_KEY']
        missing = [key for key in required if not getattr(cls, key)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    ENV = 'development'
    
    # Relaxed rate limits for dev
    RATELIMIT_DEFAULT = "1000 per day, 200 per hour"
    RATELIMIT_CHAT = "100 per minute"


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    ENV = 'production'
    
    # Strict security in production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    ENV = 'testing'
    
    DATABASE_URL = 'sqlite:///:memory:'
    REDIS_URL = 'redis://localhost:6379/15'  # Separate Redis DB for tests


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on FLASK_ENV"""
    env = os.getenv('FLASK_ENV', 'production')
    config_class = config.get(env, config['default'])
    config_class.validate()
    return config_class
