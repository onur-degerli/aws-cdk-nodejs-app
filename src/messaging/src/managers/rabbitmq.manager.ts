import { Channel } from 'amqplib';
import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class RabbitMqManager implements QueueManagerInterface {
  private cache = new Map<string, string>();

  constructor(private channel: Channel) {}

  async getOrCreateQueue(queueName: string): Promise<string | null> {
    if (this.cache.has(queueName)) {
      return this.cache.get(queueName)!;
    }

    await this.channel.assertQueue(queueName, { durable: true });

    this.cache.set(queueName, queueName);
    return queueName;
  }
}
