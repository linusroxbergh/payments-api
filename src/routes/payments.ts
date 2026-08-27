import { Hono } from 'hono';
import { charge } from '../processor';
import { newId, store, type Payment } from '../store';

type NewPayment = {
  amount: number;
  currency: string;
  source: string;
  reference: string;
  email?: string;
};

export const payments = new Hono();

payments.post('/', async (c) => {
  const body = await c.req.json<NewPayment>();
  if (!Number.isInteger(body.amount) || body.amount <= 0) {
    return c.json({ error: 'amount must be a positive whole number of cents' }, 400);
  }
  if (body.currency !== 'usd') return c.json({ error: 'only usd is supported' }, 400);
  if (!body.reference) return c.json({ error: 'reference is required' }, 400);

  const result = charge(body.source);
  const payment: Payment = {
    id: newId('pay'),
    amount: body.amount,
    currency: 'usd',
    reference: body.reference,
    email: body.email,
    status: result.ok ? 'succeeded' : 'declined',
    refunded: 0,
    createdAt: new Date().toISOString(),
  };
  store.payments.set(payment.id, payment);

  if (!result.ok) return c.json({ error: result.reason, payment }, 402);
  return c.json(payment, 201);
});

payments.get('/:id', (c) => {
  const payment = store.payments.get(c.req.param('id'));
  return payment ? c.json(payment) : c.json({ error: 'not found' }, 404);
});
