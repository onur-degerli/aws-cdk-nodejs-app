import { QueueFactory } from '@app/messaging/factory/queue.factory';
import { QueueProvider } from '@app/messaging/factory/queue-factory.types';
import 'dotenv/config';

async function main() {
  const queue = QueueFactory.createQueue({
    provider: (process.env.QUEUE_PROVIDER as QueueProvider) || 'sqs',
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
