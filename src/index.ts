import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { app } from './app';

const port = Number(process.env.PORT ?? 8787);
const server = new Hono().use(logger()).route('/', app);

serve({ fetch: server.fetch, port }, () => console.log(`payments-api listening on :${port}`));
