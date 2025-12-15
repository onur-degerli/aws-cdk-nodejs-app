export interface MessageQueueInterface {
  sendMessage<T>(message: T): Promise<void>;

  consume(handler: (msg: unknown) => Promise<void>): Promise<void>;
}
