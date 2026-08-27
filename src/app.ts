import { Hono } from 'hono';
import { payments } from './routes/payments';

export const app = new Hono();

app.get('/health', (c) => c.json({ ok: true }));
app.route('/payments', payments);
