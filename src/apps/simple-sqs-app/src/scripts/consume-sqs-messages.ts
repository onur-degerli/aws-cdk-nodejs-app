import { getQueueURL } from '../get-sqs-queue-url';
import { consumeMessage } from '../consume-message';

async function main() {
  const queueName = 'test-queue';
  const queueUrl = await getQueueURL(queueName).catch(console.error);
  if (!queueUrl) {
    console.error(`Queue ${queueName} cannot be created.`);
    return;
  }

  let messageExist: boolean = true;
  do {
    const messageResponse = await consumeMessage(queueUrl);
    if (!messageResponse) {
      messageExist = false;
    } else {
      console.log('Message response: ', messageResponse);
    }
  } while (messageExist);
}

main();
