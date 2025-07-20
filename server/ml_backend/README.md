# Pallet Defect Detection Backend

A FastAPI-based backend service for analyzing manufacturing pallets for defects using AI.

## Features

- **Defect Detection Script Execution**: Run the Python defect detection script remotely
- **Image Analysis**: Analyze pallet images for defects using Together AI
- **RESTful API**: Clean, documented API endpoints
- **Modular Architecture**: Well-organized code structure
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing for web/mobile clients

## Project Structure

```
backend/
├── config/
│   ├── __init__.py
│   └── settings.py          # Configuration settings
├── services/
│   ├── __init__.py
│   └── defect_detection_service.py  # Core defect detection logic
├── utils/
│   ├── __init__.py
│   └── helpers.py           # Utility functions
├── __init__.py
├── main.py                  # Main entry point
├── defect_detection_api.py  # FastAPI application
├── defect_detection.py      # Original defect detection script
├── start_server.py          # Server startup script
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables** (optional):
   ```bash
   export ENVIRONMENT=production
   export SECRET_KEY=your-secret-key-here
   ```

## Configuration

The backend uses a centralized configuration system in `config/settings.py`. Key settings include:

- **API Configuration**: Title, version, description
- **Server Settings**: Host, port, reload settings
- **CORS Configuration**: Allowed origins, methods, headers
- **Together AI**: API key and model selection
- **Environment**: Development/production mode

## Usage

### Starting the Server

**Option 1: Using the main entry point**
```bash
python main.py
```

**Option 2: Using the start script**
```bash
python start_server.py
```

**Option 3: Direct uvicorn**
```bash
uvicorn defect_detection_api:app --host 0.0.0.0 --port 8000 --reload
```

### API Endpoints

#### 1. Health Check
```http
GET /health
```
Returns service status and version information.

#### 2. Run Defect Detection Script
```http
POST /run-defect-detection
```
Executes the defect detection script and returns its output.

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "Script output here..."
  },
  "message": "Defect detection script executed successfully",
  "timestamp": 1234567890.123
}
```

#### 3. Analyze Pallet Image (File Upload)
```http
POST /analyze-pallet
Content-Type: multipart/form-data

file: [image file]
```
Analyzes an uploaded pallet image for defects.

#### 4. Analyze Pallet Image (URL)
```http
POST /analyze-pallet-url
Content-Type: application/json

{
  "image_url": "https://example.com/pallet.jpg"
}
```
Analyzes a pallet image from a URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "decision": "DEFECT",
    "analysis": "Detailed analysis text...",
    "image_url": "https://example.com/pallet.jpg",
    "timestamp": "2024-01-01 12:00:00"
  },
  "message": "Pallet analysis completed successfully",
  "timestamp": 1234567890.123
}
```

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": {
    "error_code": "ERROR_TYPE"
  },
  "timestamp": 1234567890.123
}
```

Common error codes:
- `INVALID_FILE_TYPE`: Uploaded file is not an image
- `INVALID_IMAGE`: Image file is corrupted or invalid
- `SCRIPT_EXECUTION_ERROR`: Defect detection script failed
- `ANALYSIS_ERROR`: Image analysis failed
- `UNKNOWN_ERROR`: Unexpected error occurred

## Development

### Adding New Endpoints

1. Add the endpoint to `defect_detection_api.py`
2. Use the helper functions from `utils.helpers.py` for consistent responses
3. Update this README with endpoint documentation

### Adding New Services

1. Create a new service file in `services/`
2. Import and use it in the API file
3. Add any new dependencies to `requirements.txt`

### Configuration Changes

1. Update `config/settings.py` with new settings
2. Use environment variables for sensitive data
3. Update this README if configuration changes affect usage

## Testing

### Manual Testing

1. Start the server
2. Use the interactive docs at http://localhost:8000/docs
3. Test each endpoint with various inputs

### Health Check
```bash
curl http://localhost:8000/health
```

### Run Defect Detection
```bash
curl -X POST http://localhost:8000/run-defect-detection
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure you're running from the backend directory
2. **Port Already in Use**: Change the port in `config/settings.py`
3. **API Key Issues**: Verify your Together AI API key is valid
4. **CORS Errors**: Check CORS settings in `config/settings.py`

### Logs

The server logs are displayed in the console. Look for:
- Server startup messages
- Request/response logs
- Error messages with stack traces

## Production Deployment

For production deployment:

1. Set `ENVIRONMENT=production` in environment variables
2. Use a proper WSGI server like Gunicorn
3. Set up reverse proxy (nginx/Apache)
4. Configure proper CORS origins
5. Use environment variables for sensitive data
6. Set up monitoring and logging

### Example Production Command
```bash
gunicorn defect_detection_api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

This project is part of the ManuScan application.

## Support

For issues and questions, please refer to the main project documentation or create an issue in the repository. 