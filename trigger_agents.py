import requests
import argparse
import json
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path to find .env file
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')

# Load environment variables from .env file if it exists
load_dotenv(dotenv_path)

# Get Orkes server URL from environment variable or use default
orkes_server_url = os.environ.get("ORKES_SERVER_URL", "https://developer.orkescloud.com")

# Default values
DEFAULT_API_URL = f"{orkes_server_url}/api/workflow"
DEFAULT_WORKFLOW = "urgency_score_agent"
DEFAULT_CALL_ID = "test-123"
DEFAULT_TRANSCRIPT = "He's bleeding badly. I'm locked in the bathroom."
DEFAULT_BACKEND_URL = "http://localhost:8000"

def load_test_transcript(file_path=None):
    """Load a test transcript from a JSON file if provided"""
    if not file_path:
        return DEFAULT_TRANSCRIPT
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            # Assuming the file has a 'transcript' field
            return data.get('transcript', DEFAULT_TRANSCRIPT)
    except Exception as e:
        print(f"Error loading transcript file: {e}")
        return DEFAULT_TRANSCRIPT

def get_jwt_token():
    """Get a JWT token from the Orkes API using key ID and secret"""
    token_url = f"{orkes_server_url}/api/token"
    
    # Get key ID and secret from environment variables
    key_id = os.environ.get("ORKES_KEY_ID")
    key_secret = os.environ.get("ORKES_KEY_SECRET")
    
    if not key_id or not key_secret:
        print("Error: ORKES_KEY_ID and ORKES_KEY_SECRET environment variables are required")
        return None
    
    print(f"Using key ID: {key_id[:5]}...")
    
    payload = {
        "keyId": key_id,
        "keySecret": key_secret
    }
    
    try:
        response = requests.post(token_url, json=payload)
        if response.status_code == 200:
            jwt_token = response.json().get("token")
            print(f"Successfully obtained JWT token")
            return jwt_token
        else:
            print(f"Error getting JWT token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error getting JWT token: {e}")
        return None

def trigger_workflow(workflow_name, call_id, transcript, backend_url=DEFAULT_BACKEND_URL, 
                    api_url=DEFAULT_API_URL):
    """Trigger an Orkes workflow with the given parameters"""
    
    # Get JWT token
    jwt_token = get_jwt_token()
    if not jwt_token:
        print("Failed to get JWT token")
        return False
    
    payload = {
        "name": workflow_name,
        "version": 1,
        "input": {
            "call_id": call_id,
            "transcript": transcript,
            "backend_url": backend_url
        }
    }
    
    headers = {
        "X-Authorization": jwt_token,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    try:
        print(f"Triggering {workflow_name} workflow...")
        print(f"Using backend URL: {backend_url}")
        print(f"Using API URL: {api_url}")
        response = requests.post(api_url, json=payload, headers=headers)
        print("Status Code:", response.status_code)
        
        if response.status_code == 200:
            result = response.json()
            print("Workflow triggered successfully!")
            print(f"Workflow ID: {result.get('workflowId')}")
            return True
        else:
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"Error triggering workflow: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Trigger Orkes workflow agents")
    
    parser.add_argument("--workflow", "-w", choices=["urgency_score_agent", "key_concerns_agent"], 
                        default=DEFAULT_WORKFLOW, help="Workflow to trigger")
    parser.add_argument("--call-id", "-c", default=DEFAULT_CALL_ID, 
                        help="Call ID to use for the workflow")
    parser.add_argument("--transcript", "-t", default=None, 
                        help="Transcript text to use (if not provided, default or test file will be used)")
    parser.add_argument("--test-file", "-f", default=None, 
                        help="Path to a JSON file containing test transcript")
    parser.add_argument("--api-url", "-u", default=DEFAULT_API_URL, 
                        help="Orkes API URL")
    parser.add_argument("--backend-url", "-b", default=DEFAULT_BACKEND_URL,
                        help="Backend API URL")
    
    args = parser.parse_args()
    
    # Determine which transcript to use
    transcript = args.transcript
    if not transcript:
        transcript = load_test_transcript(args.test_file)
    
    # Trigger the workflow
    trigger_workflow(
        workflow_name=args.workflow,
        call_id=args.call_id,
        transcript=transcript,
        backend_url=args.backend_url,
        api_url=args.api_url
    )

if __name__ == "__main__":
    main() 