import { getQueueURL } from '../src/get-sqs-queue-url';
import { consumeMessage } from '../src/consume-message';

async function main() {
  const queueName = 'test-queue';
  const queueUrl = await getQueueURL(queueName).catch(console.error);
  if (!queueUrl) {
    console.error(`Queue ${queueName} cannot be created.`);
  } else {
    await consumeMessage(queueUrl);

    console.log('Message consumed!');
  }
}

main();
