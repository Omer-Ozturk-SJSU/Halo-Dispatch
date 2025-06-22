import requests
import json
import argparse
import sys
import os
import time

# Add parent directory to path to import from parent modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DEFAULT_BACKEND_URL = "http://localhost:8000"
TEST_FILE = os.path.join(os.path.dirname(__file__), "test_transcripts.json")

def load_test_transcripts():
    """Load test transcripts from the JSON file"""
    try:
        with open(TEST_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading test transcripts: {e}")
        return []

def test_urgency_api(backend_url, transcript_id=None):
    """Test the urgency score API endpoint"""
    transcripts = load_test_transcripts()
    
    if not transcripts:
        print("No test transcripts found.")
        return
    
    # If transcript_id is provided, filter to just that one
    if transcript_id:
        transcripts = [t for t in transcripts if t.get("id") == transcript_id]
        if not transcripts:
            print(f"No transcript found with ID: {transcript_id}")
            return
    
    endpoint = f"{backend_url}/api/ai/urgency-score"
    print(f"Testing urgency score API at: {endpoint}")
    
    for transcript_data in transcripts:
        transcript_id = transcript_data.get("id")
        transcript_text = transcript_data.get("transcript")
        
        print(f"\nTesting transcript: {transcript_id}")
        print(f"Transcript: {transcript_text[:50]}...")
        
        payload = {
            "call_id": transcript_id,
            "transcript": transcript_text
        }
        
        try:
            start_time = time.time()
            response = requests.post(endpoint, json=payload)
            elapsed_time = time.time() - start_time
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Time: {elapsed_time:.2f} seconds")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Urgency Score: {result.get('score')}/10")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Error calling API: {e}")

def test_concerns_api(backend_url, transcript_id=None):
    """Test the key concerns API endpoint"""
    transcripts = load_test_transcripts()
    
    if not transcripts:
        print("No test transcripts found.")
        return
    
    # If transcript_id is provided, filter to just that one
    if transcript_id:
        transcripts = [t for t in transcripts if t.get("id") == transcript_id]
        if not transcripts:
            print(f"No transcript found with ID: {transcript_id}")
            return
    
    endpoint = f"{backend_url}/api/ai/key-concerns"
    print(f"Testing key concerns API at: {endpoint}")
    
    for transcript_data in transcripts:
        transcript_id = transcript_data.get("id")
        transcript_text = transcript_data.get("transcript")
        
        print(f"\nTesting transcript: {transcript_id}")
        print(f"Transcript: {transcript_text[:50]}...")
        
        payload = {
            "call_id": transcript_id,
            "transcript": transcript_text
        }
        
        try:
            start_time = time.time()
            response = requests.post(endpoint, json=payload)
            elapsed_time = time.time() - start_time
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Time: {elapsed_time:.2f} seconds")
            
            if response.status_code == 200:
                result = response.json()
                concerns = result.get('concerns', [])
                if concerns:
                    print(f"Concerns: {', '.join(concerns)}")
                else:
                    print("No concerns identified")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Error calling API: {e}")

def main():
    parser = argparse.ArgumentParser(description="Test Halo Dispatch backend API endpoints")
    
    parser.add_argument("--endpoint", "-e", choices=["urgency", "concerns", "both"], 
                        default="both", help="Which API endpoint to test")
    parser.add_argument("--backend-url", "-b", default=DEFAULT_BACKEND_URL,
                        help="Backend API URL")
    parser.add_argument("--transcript-id", "-t", default=None,
                        help="Test only a specific transcript ID")
    
    args = parser.parse_args()
    
    if args.endpoint in ["urgency", "both"]:
        test_urgency_api(args.backend_url, args.transcript_id)
    
    if args.endpoint in ["concerns", "both"]:
        test_concerns_api(args.backend_url, args.transcript_id)

if __name__ == "__main__":
    main() 