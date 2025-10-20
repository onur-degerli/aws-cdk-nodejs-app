import https from 'https';
import { SNSEvent } from 'aws-lambda';
import { initializeSecrets } from '../../config';

export const handler = async (event: SNSEvent): Promise<{ statusCode: number }> => {
  const webhookUrl = (await initializeSecrets(process.env.APP_SECRET_ARN!)).slackWebhookUrl;
  if (!webhookUrl) {
    console.error('Missing SLACK_WEBHOOK_URL.');
    return { statusCode: 500 };
  }

  for (const record of event.Records) {
    try {
      const snsMessage = record.Sns.Message;
      const message = JSON.parse(snsMessage);

      const text = `🚨 *CloudWatch Alarm:* ${message.AlarmName}
State: ${message.NewStateValue}
Reason: ${message.NewStateReason}`;

      await sendToSlack(webhookUrl, JSON.stringify({ text }));
    } catch (err) {
      console.error('Error processing record:', err);
    }
  }

  return { statusCode: 200 };
};

async function sendToSlack(webhookUrl: string, payload: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      webhookUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', resolve);
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}
