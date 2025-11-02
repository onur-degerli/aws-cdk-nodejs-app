import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

interface AppRunnerAlarmStackProps extends cdk.StackProps {
  serviceName: string;
  appSecret: secretsmanager.ISecret;
}

export class AppRunnerAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppRunnerAlarmStackProps) {
    super(scope, id, props);

    const alarmTopic = new sns.Topic(this, 'AppRunnerAlarmTopic', {
      displayName: 'App Runner Alarms',
    });

    const alarmLambda = new NodejsFunction(this, 'alarmLambda', {
      entry: join(__dirname, '..', '..', 'lambda', 'alarm', 'index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        APP_SECRET_ARN: props.appSecret.secretArn,
      },
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
        target: 'es2020',
        sourceMap: true,
      },
    });

    alarmTopic.addSubscription(new subs.LambdaSubscription(alarmLambda));
    props.appSecret.grantRead(alarmLambda);

    const cpuAlarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AppRunner',
        metricName: 'CPUUtilization',
        dimensionsMap: {
          ServiceName: props.serviceName,
        },
        statistic: 'Average',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Triggered when CPU exceeds 80%',
    });

    const memoryAlarm = new cloudwatch.Alarm(this, 'HighMemoryAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AppRunner',
        metricName: 'MemoryUtilization',
        dimensionsMap: {
          ServiceName: props.serviceName,
        },
        statistic: 'Average',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Triggered when Memory exceeds 80%',
    });

    [cpuAlarm, memoryAlarm].forEach((alarm) => {
      alarm.addAlarmAction({
        bind: () => ({ alarmActionArn: alarmTopic.topicArn }),
      });
    });

    alarmTopic.grantPublish(new iam.ServicePrincipal('cloudwatch.amazonaws.com'));
  }
}
