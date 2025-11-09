import express, { Request, Response } from 'express';
import { log } from '@app/common/logger';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  res.json({
    message: 'Hello from Movie Recommendation App!',
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});
