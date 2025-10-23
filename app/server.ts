import express, { Request, Response } from 'express';
import { getDbClient } from './db';
import { Client } from 'pg';

const app = express();
let dbClient: Client;

app.get('/', async (req: Request, res: Response) => {
  try {
    if (!dbClient) dbClient = await getDbClient();
    const result = await dbClient.query('SELECT NOW() as current_time');
    res.json({
      message: 'Hello from TypeScript App Runner!',
      time: result.rows[0].current_time,
    });
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
