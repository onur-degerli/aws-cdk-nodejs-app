import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { Client } from 'pg';
import dns from 'dns';
import { log } from './common/logger';

dns.setDefaultResultOrder('ipv4first');

const region = process.env.AWS_REGION || 'eu-central-1';
const secretArn = process.env.DB_SECRET_ARN;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME || 'appdb';
const dbPort = Number(process.env.DB_PORT) || 5432;
const nodeEnv = process.env.NODE_ENV || 'production';

if (!dbHost) {
  log.error('Missing required dbHost environment variable for database connection.');
  process.exit(1);
}

const smClient = new SecretsManagerClient({
  region,
  endpoint: `https://secretsmanager.${region}.amazonaws.com`,
});

export async function getDbClient(): Promise<Client> {
  if (nodeEnv === 'development') {
    log.info('🔧 Connecting to local Postgres...');
    const client = new Client({
      host: dbHost,
      port: dbPort,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: dbName,
    });
    await client.connect();
    log.info('✅ Connected to local PostgreSQL');
    return client;
  }

  if (!secretArn) {
    log.error('Missing required secret arn for database connection.');
    process.exit(1);
  }

  log.info('🔐 Fetching credentials from AWS Secrets Manager...');
  const secretData = await smClient.send(new GetSecretValueCommand({ SecretId: secretArn }));
  log.info('🔐 Using secret ARN:', JSON.stringify(secretArn));

  const secret = JSON.parse(secretData.SecretString || '{}');
  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: secret.username,
    password: secret.password,
    database: dbName,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  log.info('✅ Connected to PostgreSQL database');
  return client;
}
