import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class SecretManagerStack extends cdk.Stack {
  public readonly appSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.appSecret = new secretsmanager.Secret(this, 'AppSecrets', {
      secretName: 'app/secrets',
      description: 'General application secrets',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          slackWebhookUrl: '',
          dbHost: '',
          dbUser: '',
          dbPassword: '',
        }),
        generateStringKey: 'random',
      },
    });
  }
}
