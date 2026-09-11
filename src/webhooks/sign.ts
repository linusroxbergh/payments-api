import { createHmac, timingSafeEqual } from 'node:crypto';

const now = () => Math.floor(Date.now() / 1000);

// Header format: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<body>">
export function sign(body: string, secret: string, at = now()): string {
  const mac = createHmac('sha256', secret).update(`${at}.${body}`).digest('hex');
  return `t=${at},v1=${mac}`;
}

export function verify(body: string, header: string, secret: string, toleranceSec = 300, at = now()): boolean {
  const parts = new Map(header.split(',').map((p) => p.split('=', 2) as [string, string]));
  const signedAt = Number(parts.get('t'));
  const given = parts.get('v1');
  if (!given || !Number.isInteger(signedAt) || Math.abs(at - signedAt) > toleranceSec) return false;

  const expected = Buffer.from(sign(body, secret, signedAt).split('v1=')[1]!, 'hex');
  const actual = Buffer.from(given, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
