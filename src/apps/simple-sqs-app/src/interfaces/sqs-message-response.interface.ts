export interface SqsMessageResponseInterface {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: Record<string, string>;
}
