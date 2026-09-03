import { describe, expect, it } from 'vitest';
import { post } from './helpers';

async function paid(amount = 5879) {
  const res = await post('/payments', { amount, currency: 'usd', source: 'tok_test_4242', reference: 'FH-552013' });
  return (await res.json()) as { id: string };
}

describe('POST /refunds', () => {
  it('refunds the whole payment by default', async () => {
    const payment = await paid();
    const res = await post('/refunds', { paymentId: payment.id });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ paymentId: payment.id, amount: 5879 });
  });

  it('refunds part of a payment, then the rest', async () => {
    const payment = await paid();
    expect((await post('/refunds', { paymentId: payment.id, amount: 2400 })).status).toBe(201);
    expect(await (await post('/refunds', { paymentId: payment.id })).json()).toMatchObject({ amount: 3479 });
  });

  it('will not refund more than is left', async () => {
    const payment = await paid();
    await post('/refunds', { paymentId: payment.id, amount: 5000 });
    expect((await post('/refunds', { paymentId: payment.id, amount: 1000 })).status).toBe(400);
  });

  it('404s for a declined payment', async () => {
    const res = await post('/payments', { amount: 100, currency: 'usd', source: 'tok_test_0002', reference: 'FH-1' });
    const { payment } = (await res.json()) as { payment: { id: string } };
    expect((await post('/refunds', { paymentId: payment.id })).status).toBe(404);
  });
});
