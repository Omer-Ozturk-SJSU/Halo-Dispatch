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
orkes_server_url = os.environ.get("ORKES_SERVER_URL", "https://play.orkes.io")

# Default values
DEFAULT_API_URL = f"{orkes_server_url}/workflow"
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

def trigger_workflow(workflow_name, call_id, transcript, backend_url=DEFAULT_BACKEND_URL, 
                    api_url=DEFAULT_API_URL, auth_token=None):
    """Trigger an Orkes workflow with the given parameters"""
    
    # Use auth token from environment variable if not provided
    if not auth_token:
        auth_token = os.environ.get("ORKES_AUTH_TOKEN")
        if not auth_token:
            print("Error: No auth token provided. Set ORKES_AUTH_TOKEN environment variable or use --token argument.")
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
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
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
    parser.add_argument("--token", default=None, 
                        help="Orkes auth token (if not provided, will use ORKES_AUTH_TOKEN environment variable)")
    
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
        api_url=args.api_url,
        auth_token=args.token
    )

if __name__ == "__main__":
    main()
