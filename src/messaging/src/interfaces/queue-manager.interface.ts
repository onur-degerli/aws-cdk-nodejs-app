export interface QueueManagerInterface {
  getOrCreateQueue(queueName: string): Promise<string | null>;
}
