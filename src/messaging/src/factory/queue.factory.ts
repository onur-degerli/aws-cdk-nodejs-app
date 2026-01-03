import { MessageQueueInterface } from '../interfaces/message-queue.interface';
import { QueueFactoryOptions } from './queue-factory.types';

import { SqsQueueManager } from '../managers/sqs-queue.manager';
import { LocalQueueManager } from '../managers/local-queue.manager';

import { SqsAdapter } from '../adapters/sqs.adapter';
import { LocalQueueAdapter } from '../adapters/local-queue.adapter';
import { RabbitMqAdapter } from '../adapters/rabbitmq.adapter';
import { RabbitMqManager } from '../managers/rabbitmq.manager';
import { SqsConnection } from '../managers/sqs-connection';

export class QueueFactory {
  static createQueue(options: QueueFactoryOptions): MessageQueueInterface {
    let manager;
    let connection;
    switch (options.provider) {
      case 'sqs':
        connection = SqsConnection.getConnection();
        manager = new SqsQueueManager(connection);
        return new SqsAdapter(manager, options.queueName, connection);
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
