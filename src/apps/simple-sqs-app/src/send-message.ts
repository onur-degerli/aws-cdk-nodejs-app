import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs-client';

export async function sendMessage(queueUrl: string, message: Record<string, string>) {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    })
  );
}
