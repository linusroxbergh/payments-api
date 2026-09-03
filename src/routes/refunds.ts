import { Hono } from 'hono';
import { newId, store, type Refund } from '../store';

export const refunds = new Hono();

refunds.post('/', async (c) => {
  const { paymentId, amount } = await c.req.json<{ paymentId: string; amount?: number }>();
  const payment = store.payments.get(paymentId);
  if (!payment || payment.status !== 'succeeded') return c.json({ error: `no refundable payment ${paymentId}` }, 404);

  const left = payment.amount - payment.refunded;
  const value = amount ?? left;
  if (!Number.isInteger(value) || value <= 0 || value > left) {
    return c.json({ error: `can refund between 1 and ${left} cents` }, 400);
  }

  payment.refunded += value;
  const refund: Refund = { id: newId('re'), paymentId, amount: value, createdAt: new Date().toISOString() };
  store.refunds.set(refund.id, refund);
  return c.json(refund, 201);
});
