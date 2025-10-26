import express, { Request, Response } from 'express';
import { getDbClient } from './db';
import { Client } from 'pg';
import { log } from './common/logger';

const app = express();
let dbClient: Client;

app.get('/', async (req: Request, res: Response) => {
  try {
    if (!dbClient) {
      dbClient = await getDbClient();
    }

    const result = await dbClient.query('SELECT NOW() as current_time');
    res.json({
      message: 'Hello from TypeScript App Runner!',
      time: result.rows[0].current_time,
    });
  } catch (err) {
    log.error(err);
    res.status(500).json({ error: 'Database connection failed!' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});
