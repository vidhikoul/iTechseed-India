"""
Utility functions for the Pallet Defect Detection Backend
"""

import re
import time
from typing import Dict, Any, Optional
from PIL import Image
import io
import base64
import os

def extract_decision(output: str) -> str:
    """
    Extract the decision from the model output.
    
    Args:
        output: The text output from the AI model
        
    Returns:
        The extracted decision (DEFECT, NO DEFECT, or UNDETERMINED)
    """
    decision_match = re.search(r'\[([A-Z_ ]+)\]', output)
    return decision_match.group(1) if decision_match else "UNDETERMINED"

def validate_image_file(image_bytes: bytes) -> bool:
    """
    Validate if the provided bytes represent a valid image.
    
    Args:
        image_bytes: The image data as bytes
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False

def get_file_extension(filename: str) -> str:
    """
    Get the file extension from a filename.
    
    Args:
        filename: The filename
        
    Returns:
        The file extension (lowercase)
    """
    return os.path.splitext(filename)[1].lower()

def get_mime_type(file_extension: str) -> str:
    """
    Get MIME type based on file extension.
    
    Args:
        file_extension: The file extension
        
    Returns:
        The MIME type
    """
    mime_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp'
    }
    return mime_types.get(file_extension.lower(), 'image/jpeg')

def format_timestamp() -> str:
    """
    Get a formatted timestamp string.
    
    Returns:
        Formatted timestamp string
    """
    return time.strftime('%Y-%m-%d %H:%M:%S')

def create_response(success: bool, data: Any = None, message: str = "", timestamp: Optional[float] = None) -> Dict[str, Any]:
    """
    Create a standardized API response.
    
    Args:
        success: Whether the operation was successful
        data: The response data
        message: Optional message
        timestamp: Optional timestamp
        
    Returns:
        Standardized response dictionary
    """
    response = {
        "success": success,
        "timestamp": timestamp or time.time()
    }
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    return response

def create_error_response(message: str, error_code: str = "UNKNOWN_ERROR") -> Dict[str, Any]:
    """
    Create a standardized error response.
    
    Args:
        message: Error message
        error_code: Error code
        
    Returns:
        Standardized error response
    """
    return create_response(
        success=False,
        message=message,
        data={"error_code": error_code}
    )

def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename for safe storage.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove or replace unsafe characters
    unsafe_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in unsafe_chars:
        filename = filename.replace(char, '_')
    
    # Limit length
    if len(filename) > 100:
        name, ext = os.path.splitext(filename)
        filename = name[:100-len(ext)] + ext
    
    return filename 