"""
Test script to verify the backend structure is working correctly
"""

import sys
import os

def test_imports():
    """Test that all modules can be imported correctly"""
    print("Testing imports...")
    
    try:
        from config.settings import settings
        print("✓ Config settings imported successfully")
        print(f"  - API Title: {settings.API_TITLE}")
        print(f"  - API Version: {settings.API_VERSION}")
        print(f"  - Host: {settings.HOST}")
        print(f"  - Port: {settings.PORT}")
    except Exception as e:
        print(f"✗ Failed to import config settings: {e}")
        return False
    
    try:
        from utils.helpers import create_response, create_error_response
        print("✓ Utility helpers imported successfully")
    except Exception as e:
        print(f"✗ Failed to import utility helpers: {e}")
        return False
    
    try:
        from services.defect_detection_service import DefectDetectionService
        print("✓ Defect detection service imported successfully")
    except Exception as e:
        print(f"✗ Failed to import defect detection service: {e}")
        return False
    
    return True

def test_service_initialization():
    """Test that the service can be initialized"""
    print("\nTesting service initialization...")
    
    try:
        from services.defect_detection_service import DefectDetectionService
        service = DefectDetectionService()
        print("✓ DefectDetectionService initialized successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize DefectDetectionService: {e}")
        return False

def test_helper_functions():
    """Test helper functions"""
    print("\nTesting helper functions...")
    
    try:
        from utils.helpers import create_response, create_error_response, format_timestamp
        
        # Test create_response
        response = create_response(True, {"test": "data"}, "Test message")
        assert response["success"] == True
        assert "test" in response["data"]
        print("✓ create_response function works")
        
        # Test create_error_response
        error_response = create_error_response("Test error", "TEST_ERROR")
        assert error_response["success"] == False
        assert error_response["data"]["error_code"] == "TEST_ERROR"
        print("✓ create_error_response function works")
        
        # Test format_timestamp
        timestamp = format_timestamp()
        assert len(timestamp) > 0
        print("✓ format_timestamp function works")
        
        return True
    except Exception as e:
        print(f"✗ Helper function test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("BACKEND STRUCTURE TEST")
    print("=" * 50)
    
    # Add current directory to Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    
    tests = [
        test_imports,
        test_service_initialization,
        test_helper_functions
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"TEST RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All tests passed! Backend structure is working correctly.")
        return True
    else:
        print("✗ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 