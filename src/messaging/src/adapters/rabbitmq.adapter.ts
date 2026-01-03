import { MessageQueueInterface } from '../interfaces/message-queue.interface';
import { RabbitMqManager } from '../managers/rabbitmq.manager';

export class RabbitMqAdapter implements MessageQueueInterface {
  private manager: RabbitMqManager;
  private queueName: string;

  constructor(manager: RabbitMqManager, queueName: string) {
    this.manager = manager;
    this.queueName = queueName;
  }

  async sendMessage<T>(message: T): Promise<void> {
    const queue = await this.manager.getOrCreateQueue(this.queueName);
    if (!queue) {
      return;
    }

    const channel = this.manager.getChannel();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(handler: (msg: unknown) => Promise<void>): Promise<void> {
    const queue = await this.manager.getOrCreateQueue(this.queueName);
    if (!queue) {
      return;
    }

    const channel = this.manager.getChannel();

    await channel.consume(queue, async (raw) => {
      if (!raw) {
        return;
      }

      const content = JSON.parse(raw.content.toString());

      await handler(content);

      channel.ack(raw);
    });
  }
}
