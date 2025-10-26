import express, { Request, Response } from 'express';
import { log } from './common/logger';
import prisma from './lib/prisma';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      message: 'Hello from TypeScript App Runner!',
      users: users,
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
