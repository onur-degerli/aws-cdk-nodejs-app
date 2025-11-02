import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

interface ISecrets {
  slackWebhookUrl: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
}

export async function initializeSecrets(secretArn: string): Promise<ISecrets> {
  const secretsClient = new SecretsManagerClient();
  const secretResponse = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretArn })
  );

  return JSON.parse(secretResponse.SecretString ?? '{}');
}
