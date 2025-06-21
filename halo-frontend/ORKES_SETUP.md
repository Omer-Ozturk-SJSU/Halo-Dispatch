# Orkes Conductor Integration Setup

This guide explains how to set up and use the Orkes Conductor integration in your Next.js application.

## Prerequisites

- Orkes Conductor server access
- Orkes API credentials (Key ID and Key Secret)
- Node.js and pnpm installed

## Installation

The Orkes client has already been installed:

```bash
pnpm add @io-orkes/conductor-javascript
```

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Required Orkes Configuration
ORKES_SERVER_URL=https://your-orkes-server.com
ORKES_KEY_ID=your_key_id_here
ORKES_KEY_SECRET=your_key_secret_here

# Optional Configuration
ORKES_WORKFLOW_DEFINITION_NAME=your_workflow_name_here
ORKES_TASK_DOMAIN=your_task_domain_here
```

### Environment Variables Explained

- `ORKES_SERVER_URL`: The URL of your Orkes Conductor server
- `ORKES_KEY_ID`: Your Orkes API Key ID
- `ORKES_KEY_SECRET`: Your Orkes API Key Secret
- `ORKES_WORKFLOW_DEFINITION_NAME`: (Optional) Default workflow definition name
- `ORKES_TASK_DOMAIN`: (Optional) Default task domain

## Usage

### Basic Usage

```typescript
import { OrkesService, createOrkesService } from '@/lib/orkes-service';

// Method 1: Create service from environment variables
const orkesService = createOrkesService();

// Method 2: Create service with custom configuration
const orkesService = new OrkesService({
  serverUrl: 'https://your-orkes-server.com',
  keyId: 'your-key-id',
  keySecret: 'your-key-secret',
});
```

### Starting a Workflow

```typescript
async function startWorkflow() {
  try {
    const workflowId = await orkesService.startWorkflow(
      'my-workflow-name',
      { inputParam1: 'value1', inputParam2: 'value2' },
      'correlation-id-123'
    );
    console.log('Workflow started with ID:', workflowId);
    return workflowId;
  } catch (error) {
    console.error('Failed to start workflow:', error);
    throw error;
  }
}
```

### Getting Workflow Status

```typescript
async function getWorkflowStatus(workflowId: string) {
  try {
    const status = await orkesService.getWorkflowStatus(workflowId);
    console.log('Workflow status:', status);
    return status;
  } catch (error) {
    console.error('Failed to get workflow status:', error);
    throw error;
  }
}
```

### Searching Workflows

```typescript
async function searchWorkflows() {
  try {
    const searchResults = await orkesService.searchWorkflows({
      start: 0,
      size: 10,
      sort: 'startTime:DESC',
      freeText: 'my-workflow',
    });
    console.log('Search results:', searchResults);
    return searchResults;
  } catch (error) {
    console.error('Failed to search workflows:', error);
    throw error;
  }
}
```

### Getting Workflow Definitions

```typescript
async function getWorkflowDefinitions() {
  try {
    const definitions = await orkesService.getWorkflowDefinitions();
    console.log('Workflow definitions:', definitions);
    return definitions;
  } catch (error) {
    console.error('Failed to get workflow definitions:', error);
    throw error;
  }
}
```

### Getting Task Definitions

```typescript
async function getTaskDefinitions() {
  try {
    const taskDefs = await orkesService.getTaskDefinitions();
    console.log('Task definitions:', taskDefs);
    return taskDefs;
  } catch (error) {
    console.error('Failed to get task definitions:', error);
    throw error;
  }
}
```

### Pausing and Resuming Workflows

```typescript
async function pauseAndResumeWorkflow(workflowId: string) {
  try {
    // Pause the workflow
    await orkesService.pauseWorkflow(workflowId);
    console.log('Workflow paused');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Resume the workflow
    await orkesService.resumeWorkflow(workflowId);
    console.log('Workflow resumed');
  } catch (error) {
    console.error('Failed to pause/resume workflow:', error);
    throw error;
  }
}
```

### Terminating Workflows

```typescript
async function terminateWorkflow(workflowId: string) {
  try {
    await orkesService.terminateWorkflow(workflowId, 'Manual termination');
    console.log('Workflow terminated');
  } catch (error) {
    console.error('Failed to terminate workflow:', error);
    throw error;
  }
}
```

## Available Methods

The `OrkesService` class provides the following methods:

- `startWorkflow(workflowName, input, correlationId?)` - Start a new workflow execution
- `getWorkflowExecution(workflowId)` - Get workflow execution details
- `getWorkflowStatus(workflowId)` - Get workflow status summary
- `terminateWorkflow(workflowId, reason?)` - Terminate a workflow
- `pauseWorkflow(workflowId)` - Pause a workflow
- `resumeWorkflow(workflowId)` - Resume a paused workflow
- `getWorkflowDefinitions()` - Get all workflow definitions
- `getTaskDefinitions()` - Get all task definitions
- `searchWorkflows(filters)` - Search workflows with filters
- `getWorkflowHistory(workflowId)` - Get workflow execution history
- `getWorkflowVariables(workflowId)` - Get workflow variables

## Error Handling

All methods include proper error handling and will throw errors with descriptive messages. Make sure to wrap your calls in try-catch blocks:

```typescript
try {
  const result = await orkesService.startWorkflow('workflow-name', {});
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API credentials secure
- Use environment variables for all sensitive configuration
- Consider using a secrets management service for production deployments

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required environment variables are set
2. **Invalid Server URL**: Verify the Orkes server URL is correct and accessible
3. **Authentication Errors**: Check that your Key ID and Key Secret are correct
4. **Network Issues**: Ensure your application can reach the Orkes server

### Debug Mode

To enable debug logging, you can modify the OrkesService constructor to include logging:

```typescript
const orkesService = new OrkesService({
  serverUrl: 'https://your-orkes-server.com',
  keyId: 'your-key-id',
  keySecret: 'your-key-secret',
});
```

## Next Steps

1. Set up your environment variables
2. Test the connection with a simple workflow
3. Integrate the service into your application logic
4. Add proper error handling and logging
5. Consider implementing retry logic for production use

For more information, refer to the [Orkes Conductor documentation](https://orkes.io/docs). 