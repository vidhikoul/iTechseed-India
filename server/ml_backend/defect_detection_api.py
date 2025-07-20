from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64
import os
import requests
from typing import Union, Optional
from PIL import Image
import io
import time
import tempfile
import uvicorn

# Import from our new modular structure
from config.settings import settings
from services.defect_detection_service import DefectDetectionService
from utils.helpers import create_response, create_error_response, validate_image_file, get_mime_type

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Initialize the defect detection service
defect_service = DefectDetectionService()

def upload_to_imgur(image_bytes: bytes) -> str:
    """Upload image to Imgur and return the direct image URL."""
    try:
        # Prepare the image data
        files = {'image': ('pallet.jpg', image_bytes, 'image/jpeg')}
        
        # Make the request to Imgur
        response = requests.post(settings.IMGUR_API_URL, files=files)
        response.raise_for_status()
        
        # Extract the direct link
        data = response.json()
        image_url = data['data']['link']
        
        # Convert to direct image URL if needed
        if "imgur.com" in image_url and not image_url.startswith("https://i.imgur.com"):
            image_id = image_url.split("/")[-1]
            image_url = f"https://i.imgur.com/{image_id}.jpg"
        
        return image_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image to Imgur: {str(e)}")

@app.post("/run-defect-detection")
async def run_defect_detection():
    """
    Run the defect detection script and return its output.
    
    Returns:
        JSON response with script output
    """
    try:
        # Run the defect detection script using the service
        script_output = defect_service.run_defect_detection_script()
        
        return create_response(
            success=True,
            data={"output": script_output},
            message="Defect detection script executed successfully"
        )
        
    except Exception as e:
        return create_error_response(
            message=f"Failed to run defect detection script: {str(e)}",
            error_code="SCRIPT_EXECUTION_ERROR"
        )

@app.post("/analyze-pallet")
async def analyze_pallet(file: UploadFile = File(...)):
    """
    Analyze a pallet image for defects.
    
    Args:
        file: The image file to analyze
        
    Returns:
        JSON response with analysis results
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            return create_error_response(
                message="File must be an image",
                error_code="INVALID_FILE_TYPE"
            )
        
        # Read the uploaded file
        image_bytes = await file.read()
        
        # Validate image
        if not validate_image_file(image_bytes):
            return create_error_response(
                message="Invalid image file",
                error_code="INVALID_IMAGE"
            )
        
        # Upload to Imgur to get a publicly accessible URL
        image_url = upload_to_imgur(image_bytes)
        
        # Analyze the image using the service
        analysis_result = defect_service.analyze_pallet_image(image_url)
        
        return create_response(
            success=True,
            data=analysis_result,
            message="Pallet analysis completed successfully"
        )
        
    except Exception as e:
        return create_error_response(
            message=f"Failed to analyze pallet: {str(e)}",
            error_code="ANALYSIS_ERROR"
        )

@app.post("/analyze-pallet-url")
async def analyze_pallet_url(image_url: str):
    """
    Analyze a pallet image from a URL.
    
    Args:
        image_url: The URL of the image to analyze
        
    Returns:
        JSON response with analysis results
    """
    try:
        # Analyze the image using the service
        analysis_result = defect_service.analyze_pallet_image(image_url)
        
        return create_response(
            success=True,
            data=analysis_result,
            message="Pallet analysis completed successfully"
        )
        
    except Exception as e:
        return create_error_response(
            message=f"Failed to analyze pallet: {str(e)}",
            error_code="ANALYSIS_ERROR"
        )

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        JSON response indicating service status
    """
    return create_response(
        success=True,
        data={
            "status": "healthy",
            "service": "Pallet Defect Detection API",
            "version": settings.API_VERSION
        },
        message="Service is running"
    )

if __name__ == "__main__":
    uvicorn.run(
        "defect_detection_api:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL
    ) 