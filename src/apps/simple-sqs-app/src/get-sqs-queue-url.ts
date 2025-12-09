import { GetQueueUrlCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs-client';

export async function getQueueURL(queueName: string): Promise<string | null> {
  const command = new GetQueueUrlCommand({
    QueueName: queueName,
  });

  const response = await sqs.send(command);

  return response.QueueUrl ?? null;
}
