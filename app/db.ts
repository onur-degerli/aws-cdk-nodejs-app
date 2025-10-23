import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { Client } from 'pg';

const region = process.env.AWS_REGION || 'eu-central-1';
const secretArn = process.env.DB_SECRET_ARN;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME || 'appdb';
const dbPort = Number(process.env.DB_PORT) || 5432;

if (!secretArn || !dbHost) {
  console.error('Missing required environment variables for database connection.');
  process.exit(1);
}

const smClient = new SecretsManagerClient({ region });

export async function getDbClient(): Promise<Client> {
  const secretData = await smClient.send(new GetSecretValueCommand({ SecretId: secretArn }));
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
  console.log('✅ Connected to PostgreSQL database');
  return client;
}
