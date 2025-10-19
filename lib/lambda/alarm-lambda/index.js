import https from 'https';

export const handler = async (event) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const message = JSON.parse(body.Message);
      const text = `🚨 *CloudWatch Alarm:* ${message.AlarmName}
State: ${message.NewStateValue}
Reason: ${message.NewStateReason}`;

      const payload = JSON.stringify({ text });

      await new Promise((resolve, reject) => {
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
    } catch (err) {
      console.error('Error processing record:', err);
    }
  }

  return { statusCode: 200 };
};
