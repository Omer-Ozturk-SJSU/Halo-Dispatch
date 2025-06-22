# Halo Dispatch Orkes Agents

This directory contains the configuration and code for Orkes Conductor workflow agents used in the Halo Dispatch system.

## Overview

The Orkes agents are used to:
1. Score the urgency of 911 call transcripts on a scale of 1-10
2. Extract key safety concerns from 911 call transcripts

## Directory Structure

- `workflows/` - JSON definitions of Orkes workflow agents
- `prompts/` - AI prompts used by the backend services
- `tests/` - Test data for the agents
- `trigger_agents.py` - Script to trigger workflow executions

## Setup

### Prerequisites

1. An Orkes Conductor account (sign up at [orkes.io](https://orkes.io))
2. Python 3.8+ with pip
3. Halo backend server running

### Installation

1. Install required Python packages:

```bash
pip install requests python-dotenv
```

2. Create a `.env` file in the `orkes/` directory with your Orkes API token:

```
ORKES_AUTH_TOKEN=your_token_here
```

### Registering Workflows in Orkes

1. Log in to your Orkes Conductor dashboard
2. Navigate to Definitions > Workflows > Create Workflow
3. Upload the JSON files from the `workflows/` directory:
   - `urgency_score_agent.json`
   - `key_concerns_agent.json`

## Usage

### Triggering Workflows

You can trigger workflows using the `trigger_agents.py` script:

```bash
# Basic usage with default values
python trigger_agents.py

# Specify which workflow to trigger
python trigger_agents.py --workflow urgency_score_agent
python trigger_agents.py --workflow key_concerns_agent

# Provide a custom transcript
python trigger_agents.py --transcript "I need help. Someone is breaking into my house."

# Use a test file
python trigger_agents.py --test-file tests/test_transcripts.json

# Provide a custom call ID
python trigger_agents.py --call-id "call-12345"

# Provide the backend URL
python trigger_agents.py --backend-url "http://localhost:8000"
```

### Command Line Options

- `--workflow`, `-w`: Workflow to trigger (urgency_score_agent or key_concerns_agent)
- `--call-id`, `-c`: Call ID to use for the workflow
- `--transcript`, `-t`: Transcript text to use
- `--test-file`, `-f`: Path to a JSON file containing test transcript
- `--api-url`, `-u`: Orkes API URL
- `--token`: Orkes auth token (if not provided, will use ORKES_AUTH_TOKEN environment variable)

## Workflow Definitions

### Urgency Score Agent

The `urgency_score_agent` workflow:
- Takes a call transcript as input
- Calls the backend API to analyze the urgency
- Returns a score from 1-10

### Key Concerns Agent

The `key_concerns_agent` workflow:
- Takes a call transcript as input
- Calls the backend API to extract safety concerns
- Returns a list of concerns from predefined categories

## Backend Integration

The workflows call endpoints in the Halo backend:
- `/api/ai/urgency-score` - For urgency scoring
- `/api/ai/key-concerns` - For concern extraction

Make sure your backend is running and accessible to Orkes. 