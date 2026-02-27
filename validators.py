"""
Input validation and sanitization
Prevents injection attacks and malformed data
"""
import re
from typing import Optional, Tuple
import bleach
from flask import request


def sanitize_html(text: str) -> str:
    """Remove all HTML tags and scripts"""
    return bleach.clean(text, tags=[], strip=True)


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove path separators and special characters
    filename = re.sub(r'[^\w\s.-]', '_', filename)
    # Remove leading dots and slashes
    filename = filename.lstrip('./\\')
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        filename = name[:250] + ('.' + ext if ext else '')
    return filename


def validate_question(question: str, max_length: int = 1000) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Validate and sanitize user question
    Returns: (is_valid, sanitized_question, error_message)
    """
    if not question or not question.strip():
        return False, None, "Question cannot be empty"
    
    question = question.strip()
    
    # Check length
    if len(question) > max_length:
        return False, None, f"Question too long (max {max_length} characters)"
    
    # Sanitize HTML
    question = sanitize_html(question)
    
    # Remove control characters
    question = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', question)
    
    # Check for prompt injection patterns
    injection_patterns = [
        r'ignore\s+(previous|all|above)\s+instructions',
        r'disregard.*above',
        r'new\s+instructions?\s*:',
        r'system\s*:',
        r'<\|im_start\|>',
        r'<\|im_end\|>',
        r'###\s*instruction',
        r'you\s+are\s+now',
        r'forget\s+(everything|all)',
        r'act\s+as\s+if',
    ]
    
    for pattern in injection_patterns:
        if re.search(pattern, question, re.IGNORECASE):
            return False, None, "Invalid input detected"
    
    # Check minimum length
    if len(question) < 3:
        return False, None, "Question too short"
    
    return True, question, None


def validate_file_upload(file, allowed_types: list, max_size_mb: int) -> Tuple[bool, Optional[str]]:
    """
    Validate uploaded file
    Returns: (is_valid, error_message)
    """
    if not file:
        return False, "No file provided"
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning
    
    max_size_bytes = max_size_mb * 1024 * 1024
    if size > max_size_bytes:
        return False, f"File too large (max {max_size_mb}MB)"
    
    if size == 0:
        return False, "File is empty"
    
    # Check file type
    content_type = file.content_type
    if content_type not in allowed_types:
        return False, f"Invalid file type. Allowed: {', '.join(allowed_types)}"
    
    # Validate filename
    filename = file.filename
    if not filename:
        return False, "No filename provided"
    
    if '..' in filename or filename.startswith('/'):
        return False, "Invalid filename"
    
    # Check for double extensions (e.g., file.pdf.exe)
    if filename.count('.') > 1:
        return False, "Invalid filename (multiple extensions)"
    
    return True, None


def get_client_ip() -> str:
    """Get client IP address (handles proxies)"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr or 'unknown'


def validate_pagination(page: int, per_page: int) -> Tuple[bool, Optional[str]]:
    """Validate pagination parameters"""
    if page < 1:
        return False, "Page must be >= 1"
    
    if per_page < 1 or per_page > 100:
        return False, "Per page must be between 1 and 100"
    
    return True, None
