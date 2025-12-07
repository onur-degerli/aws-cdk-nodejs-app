import express, { Request, Response } from 'express';
import { getDbClient, DbClient } from '@app/common/db';
import { log } from '@app/common/logger';

const app = express();
let dbClient: DbClient;

app.get('/', async (req: Request, res: Response) => {
  try {
    if (!dbClient) {
      dbClient = await getDbClient();
    }

    const userCount = await dbClient.user.count();
    res.json({
      message: 'Hello from TypeScript App Runner!',
      userCount: userCount,
    });
  } catch (err) {
    log.error(err);
    res.status(500).json({ error: 'Database error!' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});
