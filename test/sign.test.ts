import { describe, expect, it } from 'vitest';
import { sign, verify } from '../src/webhooks/sign';

const body = '{"type":"payment.succeeded"}';
const secret = 'whsec_test';
const at = 1_790_000_000;

describe('verify', () => {
  it('accepts its own signature', () => {
    expect(verify(body, sign(body, secret, at), secret, 300, at)).toBe(true);
  });

  it('rejects a changed body', () => {
    expect(verify(`${body} `, sign(body, secret, at), secret, 300, at)).toBe(false);
  });

  it('rejects the wrong secret', () => {
    expect(verify(body, sign(body, 'whsec_other', at), secret, 300, at)).toBe(false);
  });

  it('rejects a signature older than the tolerance', () => {
    expect(verify(body, sign(body, secret, at), secret, 300, at + 301)).toBe(false);
  });
});
