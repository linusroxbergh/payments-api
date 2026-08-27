import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { post } from './helpers';

const order = { amount: 5879, currency: 'usd', source: 'tok_test_4242', reference: 'FH-120394' };

describe('POST /payments', () => {
  it('charges a test card', async () => {
    const res = await post('/payments', order);
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ amount: 5879, status: 'succeeded', reference: 'FH-120394' });
  });

  it('declines the decline card', async () => {
    const res = await post('/payments', { ...order, source: 'tok_test_0002' });
    expect(res.status).toBe(402);
    expect(await res.json()).toMatchObject({ error: 'card_declined', payment: { status: 'declined' } });
  });

  it('rejects amounts that are not whole cents', async () => {
    const res = await post('/payments', { ...order, amount: 58.79 });
    expect(res.status).toBe(400);
  });
});

describe('GET /payments/:id', () => {
  it('returns a payment it made', async () => {
    const created = await (await post('/payments', order)).json();
    const res = await app.request(`/payments/${created.id}`);
    expect(await res.json()).toEqual(created);
  });

  it('404s for an unknown id', async () => {
    expect((await app.request('/payments/pay_nope')).status).toBe(404);
  });
});
