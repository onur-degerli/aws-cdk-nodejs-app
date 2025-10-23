import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecrassets from 'aws-cdk-lib/aws-ecr-assets';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface AppRunnerStackProps extends cdk.StackProps {
  dbHost: string;
  dbName: string;
  dbSecret: secretsmanager.ISecret;
}

export class ApprunnerStack extends cdk.Stack {
  public readonly appRunnerServiceName: string = 'app-runner-service';

  constructor(scope: Construct, id: string, props: AppRunnerStackProps) {
    super(scope, id, props);

    const imageAsset = new ecrassets.DockerImageAsset(this, 'AppImage', {
      directory: './app',
      platform: ecrassets.Platform.LINUX_AMD64,
    });

    const apprunnerAccessRole = new iam.Role(this, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppRunnerServicePolicyForECRAccess'
        ),
      ],
    });

    const apprunnerInstanceRole = new iam.Role(this, 'AppRunnerInstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    });
    props.dbSecret.grantRead(apprunnerInstanceRole);
    apprunnerInstanceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue', 'ssm:GetParameters', 'ssm:GetParameter'],
        resources: ['*'],
      })
    );

    const appRunnerService = new apprunner.CfnService(this, 'AppRunnerService', {
      serviceName: this.appRunnerServiceName,
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: apprunnerAccessRole.roleArn,
        },
        imageRepository: {
          imageIdentifier: imageAsset.imageUri,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '3000',
            runtimeEnvironmentVariables: [
              { name: 'DB_HOST', value: props.dbHost },
              { name: 'DB_NAME', value: props.dbName },
              { name: 'DB_PORT', value: '5432' },
              { name: 'AWS_REGION', value: cdk.Stack.of(this).region },
            ],
            runtimeEnvironmentSecrets: [{ name: 'DB_SECRET_ARN', value: props.dbSecret.secretArn }],
          },
        },
        autoDeploymentsEnabled: true,
      },
      healthCheckConfiguration: {
        path: '/',
        protocol: 'HTTP',
        interval: 10,
        timeout: 5,
        healthyThreshold: 1,
        unhealthyThreshold: 5,
      },
      instanceConfiguration: {
        cpu: '1024',
        memory: '2048',
        instanceRoleArn: apprunnerInstanceRole.roleArn,
      },
    });

    const api = new apigateway.RestApi(this, 'AppApiGateway', {
      restApiName: 'AppRunnerProxy',
      description: 'Proxy to AppRunner Service',
      deployOptions: {
        stageName: 'prod',
      },
    });

    api.root.addMethod(
      'GET',
      new apigateway.HttpIntegration(`https://${appRunnerService.attrServiceUrl}/`, { proxy: true })
    );

    new cdk.CfnOutput(this, 'AppRunnerServiceUrl', {
      value: appRunnerService.attrServiceUrl,
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
    });
  }
}
