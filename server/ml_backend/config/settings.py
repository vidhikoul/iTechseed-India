"""
Configuration settings for the Pallet Defect Detection Backend
"""

import os
from typing import Optional

class Settings:
    """Application settings"""
    
    # API Configuration
    API_TITLE: str = "Pallet Defect Detection API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Backend API for pallet defect detection system"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    LOG_LEVEL: str = "info"
    
    # CORS Configuration
    CORS_ORIGINS: list = ["*"]  # In production, specify your Flutter app's domain
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: list = ["*"]
    CORS_HEADERS: list = ["*"]
    
    # Together AI Configuration
    TOGETHER_API_KEY: str = "c43783c564904b7881729f0770df4c0e368f0a9923de7de5cec1879d2b938659"
    TOGETHER_MODEL: str = "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
    
    # Script Configuration
    SCRIPT_TIMEOUT: int = 60  # seconds
    
    # Imgur Configuration (for image uploads)
    IMGUR_API_URL: str = "https://api.imgur.com/3/image"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    @classmethod
    def get_database_url(cls) -> Optional[str]:
        """Get database URL from environment"""
        return os.getenv("DATABASE_URL")
    
    @classmethod
    def get_secret_key(cls) -> str:
        """Get secret key from environment or use default"""
        return os.getenv("SECRET_KEY", "your-secret-key-here")

# Create settings instance
settings = Settings() 