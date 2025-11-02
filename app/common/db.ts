import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { PrismaClient } from '../db/orm/generated/prisma/client';
import dns from 'dns';
import { log } from './logger';

dns.setDefaultResultOrder('ipv4first');

const region = process.env.AWS_REGION || 'eu-central-1';
const secretArn = process.env.DB_SECRET_ARN;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME || 'appdb';
const dbPort = Number(process.env.DB_PORT) || 5432;
const nodeEnv = process.env.NODE_ENV || 'production';

export type DbClient = PrismaClient;

if (!dbHost) {
  log.error('Missing required dbHost environment variable for database connection.');
  process.exit(1);
}

const smClient = new SecretsManagerClient({
  region,
  endpoint: `https://secretsmanager.${region}.amazonaws.com`,
});

let globalClient: DbClient | null = null;

export async function getDbClient(): Promise<DbClient> {
  if (globalClient) {
    return globalClient;
  }

  if (nodeEnv === 'development') {
    log.info('🔧 Connecting to local Postgres...');
    const client = new PrismaClient();
    globalClient = client;

    return client;
  }

  if (nodeEnv === 'production') {
    if (!secretArn) {
      log.error('Missing required secret arn for database connection.');
      process.exit(1);
    }

    log.info('🔐 Fetching credentials from AWS Secrets Manager...');
    const secretData = await smClient.send(new GetSecretValueCommand({ SecretId: secretArn }));
    log.info('🔐 Using secret ARN:', JSON.stringify(secretArn));

    const secret = JSON.parse(secretData.SecretString || '{}');

    const databaseUrl = `postgresql://${secret.username}:${secret.password}@${dbHost}:${dbPort}/${dbName}?schema=public`;
    process.env.DATABASE_URL = databaseUrl;

    globalClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    try {
      await globalClient.$connect();
      log.info(`✅ Connected to PostgreSQL (${nodeEnv})`);
    } catch (err) {
      log.error(err, '❌ Failed to connect to database');
      process.exit(1);
    }

    return globalClient;
  }

  log.error('Missing application environment.');
  process.exit(1);
}
