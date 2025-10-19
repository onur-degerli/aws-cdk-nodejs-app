import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from App Runner via API Gateway!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
