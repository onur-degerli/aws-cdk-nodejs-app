import { CreateQueueCommand, GetQueueUrlCommand, SQSClient } from '@aws-sdk/client-sqs';
import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class SqsQueueManager implements QueueManagerInterface {
  private connection: SQSClient;
  private cache = new Map<string, string>();

  constructor(connection: SQSClient) {
    this.connection = connection;
  }

  async getOrCreateQueue(queueName: string): Promise<string | null> {
    if (this.cache.has(queueName)) {
      return this.cache.get(queueName)!;
    }

    try {
      const existingQueue = await this.connection.send(
        new GetQueueUrlCommand({ QueueName: queueName })
      );

      if (!existingQueue || !existingQueue.QueueUrl) {
        return null;
      }

      this.cache.set(queueName, existingQueue.QueueUrl);
      return existingQueue.QueueUrl;
    } catch (e) {
      console.log(e);
    }

    const createdQueue = await this.connection.send(
      new CreateQueueCommand({
        QueueName: queueName,
      })
    );

    if (!createdQueue || !createdQueue.QueueUrl) {
      return null;
    }

    this.cache.set(queueName, createdQueue.QueueUrl);
    return createdQueue.QueueUrl;
  }
}
