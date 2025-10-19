import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecrassets from 'aws-cdk-lib/aws-ecr-assets';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ApprunnerApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    const appRunnerService = new apprunner.CfnService(this, 'AppRunnerService', {
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: apprunnerAccessRole.roleArn,
        },
        imageRepository: {
          imageIdentifier: imageAsset.imageUri,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '3000',
          },
        },
        autoDeploymentsEnabled: true,
      },
      instanceConfiguration: {
        cpu: '1024',
        memory: '2048',
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
