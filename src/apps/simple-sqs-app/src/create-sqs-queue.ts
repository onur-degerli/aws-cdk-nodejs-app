import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs-client';

export async function createQueue(queueName: string): Promise<string | null> {
  const command = new CreateQueueCommand({
    QueueName: queueName,
    Attributes: {
      VisibilityTimeout: '30',
      MessageRetentionPeriod: '86400',
    },
  });

  const response = await sqs.send(command);

  return response.QueueUrl ?? null;
}
