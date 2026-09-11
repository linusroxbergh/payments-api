import { Hono } from 'hono';
import { payments } from './routes/payments';
import { refunds } from './routes/refunds';
import { webhookEndpoints } from './routes/webhook-endpoints';

export const app = new Hono();

app.get('/health', (c) => c.json({ ok: true }));
app.route('/payments', payments);
app.route('/refunds', refunds);
app.route('/webhook-endpoints', webhookEndpoints);
