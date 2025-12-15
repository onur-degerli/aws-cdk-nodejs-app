export type QueueProvider = 'sqs' | 'rabbitmq' | 'local';

export interface BaseQueueOptions {
  queueName: string;
}

export interface SqsQueueOptions extends BaseQueueOptions {
  provider: 'sqs';
  localEndpoint?: string;
}

export interface RabbitMqQueueOptions extends BaseQueueOptions {
  provider: 'rabbitmq';
  // channel: any;
}

export interface LocalQueueOptions extends BaseQueueOptions {
  provider: 'local';
}

export type QueueFactoryOptions = SqsQueueOptions | RabbitMqQueueOptions | LocalQueueOptions;
