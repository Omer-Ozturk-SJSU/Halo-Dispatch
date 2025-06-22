import requests
import argparse
import json
import os
import sys
import time
from dotenv import load_dotenv

# Add parent directory to path to find .env file
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')

print(f"Looking for .env file at: {dotenv_path}")

# Load environment variables from .env file if it exists
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print("Loaded .env file successfully")
else:
    print(f"Warning: .env file not found at {dotenv_path}")

# Get Orkes server URL from environment variable or use default
orkes_server_url = os.environ.get("ORKES_SERVER_URL", "https://developer.orkescloud.com")
print(f"Using Orkes server URL: {orkes_server_url}")

def get_jwt_token():
    """Get a JWT token from the Orkes API using key ID and secret"""
    token_url = f"{orkes_server_url}/api/token"
    
    # Get key ID and secret from environment variables
    key_id = os.environ.get("ORKES_KEY_ID")
    key_secret = os.environ.get("ORKES_KEY_SECRET")
    
    if not key_id or not key_secret:
        print("Error: ORKES_KEY_ID and ORKES_KEY_SECRET environment variables are required")
        print("Please make sure these are set in your .env file")
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

def check_workflow_status(workflow_id):
    """Check the status of a workflow execution"""
    jwt_token = get_jwt_token()
    if not jwt_token:
        print("Failed to get JWT token")
        return None
    
    url = f"{orkes_server_url}/api/workflow/{workflow_id}"
    headers = {
        "X-Authorization": jwt_token,
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            print(f"Error checking workflow status: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error checking workflow status: {e}")
        return None

def wait_for_workflow_completion(workflow_id, max_wait_seconds=60, poll_interval=5):
    """Wait for a workflow to complete and return the result"""
    print(f"Waiting for workflow {workflow_id} to complete (max {max_wait_seconds} seconds)...")
    
    start_time = time.time()
    while time.time() - start_time < max_wait_seconds:
        result = check_workflow_status(workflow_id)
        if not result:
            print("Failed to check workflow status")
            return None
        
        status = result.get("status")
        print(f"Current status: {status}")
        
        if status in ["COMPLETED", "FAILED", "TERMINATED", "TIMED_OUT"]:
            print(f"Workflow finished with status: {status}")
            return result
        
        print(f"Workflow still running. Waiting {poll_interval} seconds...")
        time.sleep(poll_interval)
    
    print(f"Timed out waiting for workflow to complete after {max_wait_seconds} seconds")
    return None

def extract_workflow_output(workflow_result):
    """Extract the output from a workflow result"""
    if not workflow_result:
        return None
    
    try:
        output = workflow_result.get("output", {})
        return output
    except Exception as e:
        print(f"Error extracting workflow output: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Check Orkes workflow status and results")
    
    parser.add_argument("workflow_id", help="The ID of the workflow to check")
    parser.add_argument("--wait", "-w", action="store_true", help="Wait for workflow to complete")
    parser.add_argument("--max-wait", "-m", type=int, default=60, help="Maximum wait time in seconds")
    parser.add_argument("--poll-interval", "-p", type=int, default=5, help="Polling interval in seconds")
    
    args = parser.parse_args()
    
    if args.wait:
        result = wait_for_workflow_completion(
            args.workflow_id, 
            max_wait_seconds=args.max_wait, 
            poll_interval=args.poll_interval
        )
    else:
        result = check_workflow_status(args.workflow_id)
    
    if result:
        print("\nWorkflow details:")
        print(f"ID: {result.get('workflowId')}")
        print(f"Name: {result.get('workflowName')}")
        print(f"Status: {result.get('status')}")
        print(f"Start time: {result.get('startTime')}")
        print(f"End time: {result.get('endTime')}")
        
        output = extract_workflow_output(result)
        if output:
            print("\nWorkflow output:")
            print(json.dumps(output, indent=2))
        else:
            print("\nNo output available")

if __name__ == "__main__":
    main()
