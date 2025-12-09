import { createQueue } from '../src/create-sqs-queue';
import { sendMessage } from '../src/send-message';

async function main() {
  const queueName = 'test-queue';
  const queueUrl = await createQueue(queueName).catch(console.error);
  if (!queueUrl) {
    console.error(`Queue ${queueName} cannot be created.`);
  } else {
    await sendMessage(queueUrl, {
      hello: 'world',
    });

    console.log('Message sent!');
  }
}

main();
