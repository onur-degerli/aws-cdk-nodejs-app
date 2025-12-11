import { createQueue } from '../create-sqs-queue';
import { sendMessage } from '../send-message';

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
