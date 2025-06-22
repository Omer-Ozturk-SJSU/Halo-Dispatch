import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

# Get auth key and secret from environment
auth_key = os.environ.get("ORKES_AUTH_TOKEN")
auth_key_id = None
auth_key_secret = None

# Check if we have a key in the format "key:secret"
if auth_key and ":" in auth_key:
    parts = auth_key.split(":", 1)
    auth_key_id = parts[0]
    auth_key_secret = parts[1]
    print(f"Found key ID and secret in ORKES_AUTH_TOKEN")
else:
    print(f"ORKES_AUTH_TOKEN does not contain key:secret format")
    # Try to get key ID and secret from separate environment variables
    auth_key_id = os.environ.get("ORKES_KEY_ID")
    auth_key_secret = os.environ.get("ORKES_KEY_SECRET")
    
    if auth_key_id and auth_key_secret:
        print(f"Found key ID and secret in separate environment variables")
    else:
        print("Could not find key ID and secret in environment variables")
        exit(1)

# API URL for token
token_url = "https://developer.orkescloud.com/api/token"

# Set up payload
payload = {
    "keyId": auth_key_id,
    "keySecret": auth_key_secret
}

print(f"Requesting JWT token with key ID: {auth_key_id[:5]}...")

# Make request
try:
    response = requests.post(token_url, json=payload)
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        jwt_token = response.json().get("token")
        if jwt_token:
            print(f"JWT token received: {jwt_token[:20]}...")
            
            # Now try to use the JWT token
            workflow_url = "https://developer.orkescloud.com/api/workflow"
            headers = {
                "X-Authorization": jwt_token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
            workflow_payload = {
                "name": "urgency_score_agent",
                "version": 1,
                "input": {
                    "call_id": "test-123",
                    "transcript": "Test transcript",
                    "backend_url": "http://localhost:8000"
                }
            }
            
            print(f"Making workflow request with JWT token...")
            workflow_response = requests.post(workflow_url, json=workflow_payload, headers=headers)
            print(f"Workflow status code: {workflow_response.status_code}")
            print(f"Workflow response: {workflow_response.text}")
        else:
            print("No token in response")
except Exception as e:
    print(f"Error: {e}") 