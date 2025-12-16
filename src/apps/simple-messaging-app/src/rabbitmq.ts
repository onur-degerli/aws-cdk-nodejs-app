import amqplib from 'amqplib';
import { QueueFactory } from '@app/messaging/factory/queue.factory';
import 'dotenv/config';

async function main() {
  const connection = await amqplib.connect(process.env.RABBITMQ_ENDPOINT);
  const channel = await connection.createChannel();

  const queue = QueueFactory.createQueue({
    provider: 'rabbitmq',
    queueName: 'test',
    channel,
  });

  await queue.sendMessage({ id: 123 });
  await queue.consume(async (msg) => {
    console.log('received:', msg);
  });
}

main();
