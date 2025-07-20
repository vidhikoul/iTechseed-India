#!/usr/bin/env python3
"""
Server startup script for the Pallet Defect Detection Backend
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import main

if __name__ == "__main__":
    main() 