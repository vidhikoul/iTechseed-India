"""
Defect Detection Service for Pallet Analysis
"""

import os
import sys
import subprocess
import time
import re
from typing import Dict, Any

from together import Together

# Add the parent directory to the path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from config.settings import settings
from utils.helpers import extract_decision, format_timestamp

class DefectDetectionService:
    """Service for analyzing pallet defects"""
    
    def __init__(self):
        """Initialize the defect detection service"""
        self.client = Together(api_key=settings.TOGETHER_API_KEY)
        self.system_prompt = """\
**Task:** Analyze the provided image of a manufacturing pallet for defects like cracks, dents, breakage, missing parts, or wear and tear. Also add some comments regarding the defect of the pallet, it's location, etc in 2-3 lines.

**Output Requirements:**
1. Detailed reasoning and observations
2. **Final Decision:** Must be either "[DEFECT]" or "[NO DEFECT]" in bold, enclosed in square brackets

**Response Format:**
**Analysis:**

**Final Decision:** [DECISION]"""

    def run_defect_detection_script(self) -> str:
        """
        Run the defect detection script and return its output.
        
        Returns:
            Script output as string
        """
        try:
            # Get the directory where this service file is located
            current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            script_path = os.path.join(current_dir, "defect_detection.py")
            
            # Check if the script exists
            if not os.path.exists(script_path):
                return "Error: defect_detection.py script not found"
            
            # Run the script using Python
            result = subprocess.run(
                [sys.executable, script_path],
                capture_output=True,
                text=True,
                cwd=current_dir,
                timeout=settings.SCRIPT_TIMEOUT
            )
            
            if result.returncode == 0:
                return result.stdout
            else:
                return f"Script execution failed: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            return f"Script execution timed out after {settings.SCRIPT_TIMEOUT} seconds"
        except Exception as e:
            return f"Error running script: {str(e)}"

    def generate_sample_defect_analysis(self) -> str:
        """
        Generate a sample defect detection analysis without requiring an image.
        
        Returns:
            A string containing the analysis results
        """
        try:
            # Create a sample analysis using the AI model with a text-only prompt
            content = [
                {
                    "type": "text",
                    "text": """Please provide a sample analysis of a manufacturing pallet for defect detection. 
                    Consider common defects like cracks, dents, breakage, missing parts, or wear and tear.
                    Provide a realistic analysis as if you were examining a pallet image."""
                }
            ]

            # Make the API request
            response = self.client.chat.completions.create(
                model=settings.TOGETHER_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": self.system_prompt
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ]
            )

            full_analysis = response.choices[0].message.content
            decision = extract_decision(full_analysis)
            
            # Format the output
            output = f"""
=== PALLET DEFECT DETECTION ANALYSIS ===
Timestamp: {format_timestamp()}

{full_analysis}

=== ANALYSIS COMPLETE ===
Decision: {decision}
Status: {'DEFECT DETECTED' if decision == 'DEFECT' else 'NO DEFECT FOUND'}
"""
            
            return output

        except Exception as e:
            return f"""
=== PALLET DEFECT DETECTION ANALYSIS ===
Timestamp: {format_timestamp()}

Error occurred during analysis: {str(e)}

=== ANALYSIS FAILED ===
Decision: UNDETERMINED
Status: ERROR
"""

    def analyze_pallet_image(self, image_url: str) -> Dict[str, Any]:
        """
        Analyze a pallet image using the Together AI model.
        
        Args:
            image_url: URL of the image to analyze
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Enhanced prompt to get more structured defect location info
            content = [
                {
                    "type": "text",
                    "text": """Please analyze this pallet image in detail and answer these questions:
1. Are there any defects in the pallet? If yes, what types of defects?
2. For each defect, specify its exact location using descriptive terms like 'top right', 'bottom left', 'center left', etc.
3. Rate the severity of each defect on a scale of 1-5.
4. Is the pallet acceptable for use or should it be rejected due to defects?

Please structure your response clearly with sections for each defect found, including TYPE, LOCATION, and SEVERITY for each."""
                },
                {
                    "type": "image_url",
                    "image_url": {"url": image_url}
                }
            ]

            # Make the API request
            response = self.client.chat.completions.create(
                model=settings.TOGETHER_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": self.system_prompt
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ]
            )

            full_analysis = response.choices[0].message.content
            decision = extract_decision(full_analysis)

            return {
                "decision": decision,
                "analysis": full_analysis,
                "image_url": image_url,
                "timestamp": format_timestamp()
            }

        except Exception as e:
            return {
                "error": f"Failed to analyze image: {str(e)}",
                "decision": "UNDETERMINED",
                "timestamp": format_timestamp()
            } 