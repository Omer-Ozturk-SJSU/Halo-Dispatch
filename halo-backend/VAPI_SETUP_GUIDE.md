# VAPI Setup Guide for Call Forwarding + Transcription

## Current Issue
Your VAPI is configured as a conversational AI that talks to callers. For a dispatch system, you need call forwarding with silent transcription.

## What You Need to Change in VAPI Dashboard

### 1. Create a New Assistant (or Update Existing)

Go to your VAPI dashboard and create/update your assistant with these settings:

**Assistant Configuration:**
```json
{
  "name": "Emergency Dispatch Forwarder",
  "model": {
    "provider": "openai", 
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are an emergency call forwarder. Your job is to immediately transfer calls to dispatchers and provide live transcription. Do not engage in lengthy conversation - just acknowledge and transfer."
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "rachel"
  },
  "firstMessage": "Emergency services, transferring you to a dispatcher now...",
  "functions": [
    {
      "name": "transferCall",
      "description": "Transfer the call to the dispatcher",
      "parameters": {
        "type": "object",
        "properties": {
          "reason": {
            "type": "string",
            "description": "Reason for transfer"
          }
        }
      }
    }
  ]
}
```

### 2. Configure Phone Number

**Phone Number Settings:**
- Set your VAPI phone number to use the assistant above
- Enable call forwarding
- Set forwarding number to your dispatcher's actual phone number

### 3. Webhook Configuration

**Webhook URL:** `https://your-domain.com/webhook/vapi`

**Events to Subscribe to:**
- `call-start`
- `call-end` 
- `transcript`
- `function-call`

### 4. Environment Variables

Create a `.env` file in your `halo-backend` folder with:

```env
VAPI_WEBHOOK_SECRET=your_webhook_secret_from_vapi_dashboard
DISPATCHER_PHONE_NUMBER=+1234567890  # Your actual dispatcher number
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_DB=halo_dispatch
```

## How It Will Work After Setup

1. **Call Comes In** → VAPI number receives call
2. **Brief AI Response** → "Emergency services, transferring you now..."
3. **Call Transfer** → Call forwards to your dispatcher's number
4. **Live Transcription** → AI transcribes the conversation between caller and dispatcher
5. **Real-time Processing** → Transcripts saved to database, AI analysis triggered

## Alternative: Pure Call Forwarding (Recommended)

For emergency services, you might want **immediate forwarding** without any AI interaction:

**Simpler Assistant Config:**
```json
{
  "name": "Silent Emergency Forwarder",
  "model": {
    "provider": "openai",
    "model": "gpt-3.5-turbo", 
    "messages": [
      {
        "role": "system",
        "content": "Immediately transfer all calls to the dispatcher. Do not speak except to say you're transferring."
      }
    ]
  },
  "firstMessage": "Connecting you to emergency services...",
  "endCallAfterSilenceSeconds": 2,
  "functions": [
    {
      "name": "transferCall",
      "description": "Immediately transfer to dispatcher",
      "parameters": {
        "type": "object", 
        "properties": {}
      }
    }
  ]
}
```

## Testing

1. **Deploy your updated backend**
2. **Update VAPI assistant configuration**
3. **Test call from another phone**
4. **Check your backend logs for transcript data**

## Next Steps After Basic Setup

1. **Add WebSocket support** for real-time dashboard updates
2. **Integrate Orkes workflows** for AI analysis 
3. **Add caller identification** 
4. **Location services integration** 