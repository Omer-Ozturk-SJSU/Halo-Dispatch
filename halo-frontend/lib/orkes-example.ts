import { OrkesService, createOrkesService } from './orkes-service';

// Example usage of OrkesService

// Method 1: Create service with custom configuration
const orkesService = new OrkesService({
  serverUrl: 'https://your-orkes-server.com',
  keyId: 'your-key-id',
  keySecret: 'your-key-secret',
});

// Method 2: Create service from environment variables
const orkesServiceFromEnv = createOrkesService();

// Example: Start a workflow
async function startWorkflowExample() {
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

// Example: Get workflow status
async function getWorkflowStatusExample(workflowId: string) {
  try {
    const status = await orkesService.getWorkflowStatus(workflowId);
    console.log('Workflow status:', status);
    return status;
  } catch (error) {
    console.error('Failed to get workflow status:', error);
    throw error;
  }
}

// Example: Search workflows
async function searchWorkflowsExample() {
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

// Example: Get workflow definitions
async function getWorkflowDefinitionsExample() {
  try {
    const definitions = await orkesService.getWorkflowDefinitions();
    console.log('Workflow definitions:', definitions);
    return definitions;
  } catch (error) {
    console.error('Failed to get workflow definitions:', error);
    throw error;
  }
}

// Example: Get task definitions
async function getTaskDefinitionsExample() {
  try {
    const taskDefs = await orkesService.getTaskDefinitions();
    console.log('Task definitions:', taskDefs);
    return taskDefs;
  } catch (error) {
    console.error('Failed to get task definitions:', error);
    throw error;
  }
}

// Example: Pause and resume workflow
async function pauseAndResumeWorkflowExample(workflowId: string) {
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

// Example: Terminate workflow
async function terminateWorkflowExample(workflowId: string) {
  try {
    await orkesService.terminateWorkflow(workflowId, 'Manual termination');
    console.log('Workflow terminated');
  } catch (error) {
    console.error('Failed to terminate workflow:', error);
    throw error;
  }
}

// Export examples for use in other files
export {
  startWorkflowExample,
  getWorkflowStatusExample,
  searchWorkflowsExample,
  getWorkflowDefinitionsExample,
  getTaskDefinitionsExample,
  pauseAndResumeWorkflowExample,
  terminateWorkflowExample,
}; 