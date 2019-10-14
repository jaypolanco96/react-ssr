import express, { Request, Response } from '@react-ssr/express';

const app = express();

app.get('/', (_req: Request, res: Response) => {
  const user = { name: 'World' };
  res.render('index', { user });
});

app.listen(4000, () => {
  console.log('> Ready on http://localhost:4000');
});