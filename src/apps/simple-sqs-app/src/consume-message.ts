import { ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs-client';

export async function consumeMessage(queueUrl: string) {
  const response = await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
    })
  );

  console.log('Consumed: ', response.Messages);
}
