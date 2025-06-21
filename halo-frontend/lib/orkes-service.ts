import { ConductorClient } from '@io-orkes/conductor-javascript';

export interface OrkesConfig {
  serverUrl: string;
  keyId: string;
  keySecret: string;
  workflowDefinitionName?: string;
  taskDomain?: string;
}

export class OrkesService {
  private client: ConductorClient;
  private config: OrkesConfig;

  constructor(config: OrkesConfig) {
    this.config = config;
    this.client = new ConductorClient({
      serverUrl: config.serverUrl,
      useEnvVars: false,
    });
  }

  /**
   * Start a workflow execution
   */
  async startWorkflow(
    workflowName: string,
    input: Record<string, any> = {},
    correlationId?: string
  ) {
    try {
      const response = await this.client.workflowResource.startWorkflow({
        name: workflowName,
        input,
        correlationId,
        version: 1, // You can make this configurable
      });
      return response;
    } catch (error) {
      console.error('Error starting workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow execution by ID
   */
  async getWorkflowExecution(workflowId: string) {
    try {
      const response = await this.client.workflowResource.getExecutionStatus(workflowId);
      return response;
    } catch (error) {
      console.error('Error getting workflow execution:', error);
      throw error;
    }
  }

  /**
   * Get workflow execution status
   */
  async getWorkflowStatus(workflowId: string) {
    try {
      const response = await this.client.workflowResource.getWorkflowStatusSummary(workflowId);
      return response;
    } catch (error) {
      console.error('Error getting workflow status:', error);
      throw error;
    }
  }

  /**
   * Terminate a workflow execution
   */
  async terminateWorkflow(workflowId: string, reason?: string) {
    try {
      const response = await this.client.workflowResource.terminate1(workflowId, reason);
      return response;
    } catch (error) {
      console.error('Error terminating workflow:', error);
      throw error;
    }
  }

  /**
   * Pause a workflow execution
   */
  async pauseWorkflow(workflowId: string) {
    try {
      const response = await this.client.workflowResource.pauseWorkflow(workflowId);
      return response;
    } catch (error) {
      console.error('Error pausing workflow:', error);
      throw error;
    }
  }

  /**
   * Resume a paused workflow execution
   */
  async resumeWorkflow(workflowId: string) {
    try {
      const response = await this.client.workflowResource.resumeWorkflow(workflowId);
      return response;
    } catch (error) {
      console.error('Error resuming workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow definitions
   */
  async getWorkflowDefinitions() {
    try {
      const response = await this.client.metadataResource.getAllWorkflows();
      return response;
    } catch (error) {
      console.error('Error getting workflow definitions:', error);
      throw error;
    }
  }

  /**
   * Get task definitions
   */
  async getTaskDefinitions() {
    try {
      const response = await this.client.metadataResource.getTaskDefs();
      return response;
    } catch (error) {
      console.error('Error getting task definitions:', error);
      throw error;
    }
  }

  /**
   * Search workflows with filters
   */
  async searchWorkflows(filters: {
    start?: number;
    size?: number;
    sort?: string;
    freeText?: string;
    query?: string;
  } = {}) {
    try {
      const response = await this.client.workflowResource.search1(
        undefined,
        filters.start,
        filters.size,
        filters.sort,
        filters.freeText,
        filters.query
      );
      return response;
    } catch (error) {
      console.error('Error searching workflows:', error);
      throw error;
    }
  }

  /**
   * Get workflow execution history
   */
  async getWorkflowHistory(workflowId: string) {
    try {
      // Note: The API doesn't have a direct getWorkflowHistory method
      // You might need to use getExecutionStatus with includeTasks=true
      const response = await this.client.workflowResource.getExecutionStatus(workflowId, true);
      return response;
    } catch (error) {
      console.error('Error getting workflow history:', error);
      throw error;
    }
  }

  /**
   * Update workflow variables
   */
  async updateWorkflowVariables(workflowId: string, variables: Record<string, any>) {
    try {
      // Note: The API doesn't have a direct updateWorkflowVariables method
      // You might need to use a different approach or check if this is available
      console.warn('updateWorkflowVariables method not directly available in the API');
      throw new Error('updateWorkflowVariables method not implemented in this version');
    } catch (error) {
      console.error('Error updating workflow variables:', error);
      throw error;
    }
  }

  /**
   * Get workflow variables
   */
  async getWorkflowVariables(workflowId: string) {
    try {
      // Note: The API doesn't have a direct getWorkflowVariables method
      // You might need to use getWorkflowStatusSummary with includeVariables=true
      const response = await this.client.workflowResource.getWorkflowStatusSummary(workflowId, true, true);
      return response;
    } catch (error) {
      console.error('Error getting workflow variables:', error);
      throw error;
    }
  }
}

// Helper function to create OrkesService instance from environment variables
export function createOrkesService(): OrkesService {
  const config: OrkesConfig = {
    serverUrl: process.env.ORKES_SERVER_URL!,
    keyId: process.env.ORKES_KEY_ID!,
    keySecret: process.env.ORKES_KEY_SECRET!,
    workflowDefinitionName: process.env.ORKES_WORKFLOW_DEFINITION_NAME,
    taskDomain: process.env.ORKES_TASK_DOMAIN,
  };

  // Validate required environment variables
  if (!config.serverUrl || !config.keyId || !config.keySecret) {
    throw new Error(
      'Missing required Orkes environment variables: ORKES_SERVER_URL, ORKES_KEY_ID, ORKES_KEY_SECRET'
    );
  }

  return new OrkesService(config);
} 