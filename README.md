# Halo Dispatch

Halo Dispatch is a 911 call analysis system that uses AI to extract key safety concerns and urgency scores from emergency call transcripts.

## Project Structure

- **halo-backend**: FastAPI backend server with AI processing endpoints
- **halo-frontend**: Next.js frontend application
- **orkes**: Orkes Conductor workflow agents and testing tools

## Orkes Conductor Integration

This project uses [Orkes Conductor](https://orkes.io/) to orchestrate AI workflows:

- **urgency_score_agent**: Rates the urgency of 911 call transcripts on a scale of 1-10
- **key_concerns_agent**: Extracts key safety concerns from transcripts (e.g., Bleeding, Domestic Violence)

### Setting Up Orkes

1. Create an account on [Orkes Conductor](https://orkes.io/)
2. Register the workflow definitions from `orkes/workflows/`
3. Configure your API token in `orkes/.env`
4. See `orkes/README.md` for detailed instructions

### Testing Orkes Workflows

```bash
# Navigate to the orkes directory
cd orkes

# Run the trigger script
python trigger_agents.py --workflow urgency_score_agent
python trigger_agents.py --workflow key_concerns_agent

# Test with custom transcript
python trigger_agents.py --transcript "I need help. Someone is breaking into my house."

# Test with sample transcripts
python trigger_agents.py --test-file tests/test_transcripts.json
```

## Backend Setup

The backend uses FastAPI with OpenAI integration for AI analysis.

```bash
# Navigate to the backend directory
cd halo-backend

# Install dependencies
pip install -r requirements.txt

# Set OpenAI API key
export OPENAI_API_KEY="your-api-key"

# Run the server
uvicorn main:app --reload
```

### API Endpoints

- `GET /`: Health check endpoint
- `POST /api/ai/urgency-score`: Get urgency score for transcript
- `POST /api/ai/key-concerns`: Extract key concerns from transcript

## Frontend Setup

The frontend is built with Next.js and includes an Orkes client integration.

```bash
# Navigate to the frontend directory
cd halo-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Orkes credentials

# Run the development server
pnpm dev
```

## Development Workflow

1. Start the backend server
2. Start the frontend development server
3. Test Orkes workflows using the trigger script
4. Use the test API script to verify backend endpoints

## Testing

```bash
# Test backend API endpoints
cd orkes
python tests/test_backend_api.py

# Test with specific transcript
python tests/test_backend_api.py --transcript-id test-emergency-1

# Test only urgency endpoint
python tests/test_backend_api.py --endpoint urgency
```