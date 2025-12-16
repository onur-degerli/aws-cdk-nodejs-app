import { QueueFactory } from '@app/messaging/factory/queue.factory';
import 'dotenv/config';

async function main() {
  const queue = QueueFactory.createQueue({
    provider: 'sqs',
    queueName: 'test',
    localEndpoint: process.env.QUEUE_ENDPOINT,
  });

  await queue.sendMessage({ id: '123', name: 'Test1' });
  await queue.sendMessage({ id: '456', name: 'Test2' });

  await queue.consume(async (msg) => {
    console.log('Test consumer:', msg);
  });
}

main();
