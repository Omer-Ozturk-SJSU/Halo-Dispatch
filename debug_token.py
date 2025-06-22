import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

# Get auth token from environment
auth_token = os.environ.get("ORKES_AUTH_TOKEN")
if auth_token:
    print(f"Auth token from env: {auth_token[:10]}...{auth_token[-10:]}")
    
    # API URL
    api_url = "https://developer.orkescloud.com/api/workflow"
    
    # Set up headers - using X-Authorization instead of Authorization
    headers = {
        "X-Authorization": f"{auth_token}",  # No "Bearer" prefix
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    print(f"Full X-Authorization header: {headers['X-Authorization']}")
    
    # Simple payload
    payload = {
        "name": "urgency_score_agent",
        "version": 1,
        "input": {
            "call_id": "test-123",
            "transcript": "Test transcript",
            "backend_url": "http://localhost:8000"
        }
    }
    
    # Make request
    try:
        print(f"Making request to: {api_url}")
        response = requests.post(api_url, json=payload, headers=headers)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No auth token found in environment variables") 