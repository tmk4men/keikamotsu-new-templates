import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = true;
const hostname = '0.0.0.0';
const port = 3002;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
