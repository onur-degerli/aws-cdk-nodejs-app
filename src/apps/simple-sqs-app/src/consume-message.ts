import { ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs-client';
import { SqsMessageResponseInterface } from './interfaces/index';

export async function consumeMessage(
  queueUrl: string
): Promise<SqsMessageResponseInterface | undefined> {
  const response = await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
    })
  );

  return response.Messages
    ? (response.Messages as unknown as SqsMessageResponseInterface)
    : undefined;
}
