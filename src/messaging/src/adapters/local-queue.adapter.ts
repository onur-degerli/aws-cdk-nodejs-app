import { MessageQueueInterface } from '../interfaces/message-queue.interface';
import { LocalQueueManager } from '../managers/local-queue.manager';

export class LocalQueueAdapter implements MessageQueueInterface {
  private messages: unknown[] = [];

  constructor(
    private manager: LocalQueueManager,
    private queueName: string
  ) {}

  async sendMessage<T>(message: T): Promise<void> {
    await this.manager.getOrCreateQueue(this.queueName);
    this.manager.pushMessage(this.queueName, message);
  }

  async consume(handler: (msg: unknown) => Promise<void>): Promise<void> {
    await this.manager.getOrCreateQueue(this.queueName);
    let msg = this.manager.pullMessage(this.queueName);
    while (msg !== undefined) {
      await handler(msg);
      msg = this.manager.pullMessage(this.queueName);
    }
  }
}
