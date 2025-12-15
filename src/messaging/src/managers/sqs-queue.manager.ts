import { CreateQueueCommand, GetQueueUrlCommand, SQSClient } from '@aws-sdk/client-sqs';
import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class SqsQueueManager implements QueueManagerInterface {
  private client: SQSClient;
  private cache = new Map<string, string>();

  constructor(opts: { localEndpoint?: string }) {
    this.client = new SQSClient({
      region: 'us-east-1',
      endpoint: opts.localEndpoint,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  async getOrCreateQueue(queueName: string): Promise<string | null> {
    if (this.cache.has(queueName)) {
      return this.cache.get(queueName)!;
    }

    try {
      const existingQueue = await this.client.send(
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

    const createdQueue = await this.client.send(
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
