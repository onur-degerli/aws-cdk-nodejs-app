import https from 'https';
import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent): Promise<{ statusCode: number }> => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Missing SLACK_WEBHOOK_URL environment variable.');
    return { statusCode: 500 };
  }

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const message = JSON.parse(body.Message);

      const text = `🚨 *CloudWatch Alarm:* ${message.AlarmName}
State: ${message.NewStateValue}
Reason: ${message.NewStateReason}`;

      const payload = JSON.stringify({ text });

      await sendToSlack(webhookUrl, payload);
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
