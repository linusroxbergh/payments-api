import { createServer, type IncomingHttpHeaders } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { verify } from '../src/webhooks/sign';
import { post } from './helpers';

type Received = { headers: IncomingHttpHeaders; body: string };
const received: Received[] = [];

const receiver = createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    received.push({ headers: req.headers, body });
    res.end();
  });
});

let url = '';
beforeAll(async () => {
  await new Promise<void>((resolve) => receiver.listen(0, resolve));
  url = `http://localhost:${(receiver.address() as AddressInfo).port}/hook`;
});
afterAll(() => {
  receiver.close();
});

describe('webhooks', () => {
  it('rejects unknown event types', async () => {
    const res = await post('/webhook-endpoints', { url, events: ['payment.exploded'] });
    expect(res.status).toBe(400);
  });

  it('sends a signed payment.succeeded', async () => {
    const endpoint = (await (await post('/webhook-endpoints', { url, events: ['payment.succeeded'] })).json()) as {
      secret: string;
    };
    await post('/payments', { amount: 2400, currency: 'usd', source: 'tok_test_4242', reference: 'FH-778120' });

    const hit = received.at(-1)!;
    expect(JSON.parse(hit.body)).toMatchObject({ type: 'payment.succeeded', data: { amount: 2400 } });
    expect(verify(hit.body, String(hit.headers['fernhill-signature']), endpoint.secret)).toBe(true);
  });
});
