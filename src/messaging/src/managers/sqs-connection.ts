import { SQSClient } from '@aws-sdk/client-sqs';
import 'dotenv/config';

export class SqsConnection {
  private static connection: SQSClient | null = null;

  static getConnection(): SQSClient {
    if (this.connection) {
      return this.connection;
    }

    this.connection = new SQSClient({
      region: 'us-east-1',
      endpoint: process.env.SQS_ENDPOINT,
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    return this.connection;
  }
}
