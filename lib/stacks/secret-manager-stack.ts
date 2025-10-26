import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class SecretManagerStack extends cdk.Stack {
  public readonly appSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secretName = 'app/secrets';

    // Try to import an existing secret by name
    let existingSecret: secretsmanager.ISecret | undefined;
    try {
      existingSecret = secretsmanager.Secret.fromSecretNameV2(
        this,
        'ExistingAppSecret',
        secretName
      );
    } catch {
      // Ignore if not found — CDK will create it below
    }

    this.appSecret =
      existingSecret ??
      new secretsmanager.Secret(this, 'AppSecrets', {
        secretName,
        description: 'General application secrets',
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            slackWebhookUrl: '',
          }),
          generateStringKey: 'random',
        },
      });
  }
}
