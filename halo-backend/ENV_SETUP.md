# Environment Setup Guide

To properly configure the Orkes integration, you need to set up your `.env` file in the `halo-backend` directory.

## Create the .env file

Create a file named `.env` in the `halo-backend` directory with the following content:

```
# Orkes Configuration
ORKES_SERVER_URL=https://developer.orkescloud.com
ORKES_KEY_ID=your-key-id-here
ORKES_KEY_SECRET=your-key-secret-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Database Configuration
DATABASE_URL=sqlite:///./halo.db
```

## Getting Orkes Credentials

To get your Orkes credentials:

1. Log in to your Orkes Conductor dashboard at https://developer.orkescloud.com
2. Navigate to **Access Control** > **Applications**
3. Select your application or create a new one
4. In the **Access Keys** section, select **+ Create access key**
5. This will generate a unique Key ID and Key Secret
6. Copy these values to your `.env` file

## Testing the Orkes Integration

After setting up your `.env` file, you can test the Orkes integration by running:

```bash
cd halo-backend/orkes
python trigger_agents.py
```

This will attempt to trigger a workflow in Orkes using your credentials. 