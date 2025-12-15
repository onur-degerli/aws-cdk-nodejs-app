import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class LocalQueueManager implements QueueManagerInterface {
  private queues = new Map<string, unknown[]>();

  async getOrCreateQueue(queueName: string): Promise<string | null> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    return queueName;
  }

  pushMessage(queueName: string, message: unknown) {
    const queue = this.queues.get(queueName);
    if (queue) {
      queue.push(message);
    } else {
      throw new Error(`Queue not found: ${queueName}`);
    }
  }

  pullMessage(queueName: string): unknown | undefined {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }
    return queue.shift();
  }
}
