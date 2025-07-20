"""
Main entry point for the Pallet Defect Detection Backend
"""

import uvicorn
from config.settings import settings

def main():
    """Start the FastAPI server"""
    print(f"Starting {settings.API_TITLE} v{settings.API_VERSION}")
    print(f"Server will be available at http://{settings.HOST}:{settings.PORT}")
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Debug mode: {settings.DEBUG}")
    
    uvicorn.run(
        "defect_detection_api:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL
    )

if __name__ == "__main__":
    main() 