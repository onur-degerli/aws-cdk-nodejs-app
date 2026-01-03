import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { MessageQueueInterface } from '../interfaces/message-queue.interface';
import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class SqsAdapter implements MessageQueueInterface {
  private connection: SQSClient;

  constructor(
    private queueManager: QueueManagerInterface,
    private queueName: string,
    connection: SQSClient
  ) {
    this.connection = connection;
  }

  async sendMessage<T>(message: T): Promise<void> {
    const queueUrl = await this.queueManager.getOrCreateQueue(this.queueName);
    if (!queueUrl) {
      return;
    }

    await this.connection.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
      })
    );
  }

  async consume(handler: (message: unknown) => Promise<void>): Promise<void> {
    const queueUrl = await this.queueManager.getOrCreateQueue(this.queueName);
    if (!queueUrl) {
      return;
    }

    const response = await this.connection.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      })
    );

    if (!response.Messages) {
      return;
    }

    for (const raw of response.Messages) {
      const body = JSON.parse(raw.Body ?? '{}');

      await handler(body);

      await this.connection.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: raw.ReceiptHandle,
        })
      );
    }
  }
}
