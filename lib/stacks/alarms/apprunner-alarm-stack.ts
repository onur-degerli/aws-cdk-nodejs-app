import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ServiceNamespace } from 'aws-cdk-lib/aws-applicationautoscaling';

interface AppRunnerAlarmStackProps extends cdk.StackProps {
  serviceName: string;
}

export class AppRunnerAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppRunnerAlarmStackProps) {
    super(scope, id, props);

    const alarmQueue = new sqs.Queue(this, 'AppRunnerAlarmQueue', {
      queueName: 'app-runner-alarms',
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    alarmQueue.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        principals: [new iam.ServicePrincipal('cloudwatch.amazonaws.com')],
        resources: [alarmQueue.queueArn],
      })
    );

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

    cpuAlarm.addAlarmAction({
      bind: () => ({ alarmActionArn: alarmQueue.queueArn }),
    });

    memoryAlarm.addAlarmAction({
      bind: () => ({ alarmActionArn: alarmQueue.queueArn }),
    });

    new cdk.CfnOutput(this, 'AlarmQueueUrl', {
      value: alarmQueue.queueUrl,
    });
  }
}
