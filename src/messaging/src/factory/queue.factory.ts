import { MessageQueueInterface } from '../interfaces/message-queue.interface';
import { QueueFactoryOptions } from './queue-factory.types';

import { SqsQueueManager } from '../managers/sqs-queue.manager';
import { LocalQueueManager } from '../managers/local-queue.manager';

import { SqsAdapter } from '../adapters/sqs.adapter';
import { LocalQueueAdapter } from '../adapters/local-queue.adapter';
import { RabbitMqAdapter } from '../adapters/rabbitmq.adapter';
import { RabbitMqManager } from '../managers/rabbitmq.manager';

export class QueueFactory {
  static createQueue(options: QueueFactoryOptions): MessageQueueInterface {
    let manager;
    switch (options.provider) {
      case 'sqs':
        manager = new SqsQueueManager({
          localEndpoint: options?.localEndpoint,
        });

        return new SqsAdapter(manager, options.queueName, {
          localEndpoint: options?.localEndpoint,
        });
      case 'rabbitmq':
        manager = new RabbitMqManager(options.channel);
        return new RabbitMqAdapter(manager, options.queueName);

      case 'local':
        manager = new LocalQueueManager();
        return new LocalQueueAdapter(manager, 'test');

      default:
        throw new Error('Unknown messaging provider');
    }
  }
}
