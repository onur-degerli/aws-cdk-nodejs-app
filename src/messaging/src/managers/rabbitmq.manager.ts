import { Channel } from 'amqplib';
import { QueueManagerInterface } from '../interfaces/queue-manager.interface';

export class RabbitMqManager implements QueueManagerInterface {
  private cache = new Map<string, string>();

  constructor(private channel: Channel) {}

  async getOrCreateQueue(queueName: string): Promise<string> {
    if (!this.cache.has(queueName)) {
      await this.channel.assertQueue(queueName, { durable: true });
      this.cache.set(queueName, queueName);
    }

    return queueName;
  }

  getChannel(): Channel {
    return this.channel;
  }
}
