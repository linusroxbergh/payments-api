export type ChargeResult = { ok: true } | { ok: false; reason: string };

// Test mode: a token's last four digits pick the outcome, like the card numbers in the storefront README.
export function charge(source: string): ChargeResult {
  if (!source.startsWith('tok_test_')) return { ok: false, reason: 'only test tokens are accepted' };
  if (source.endsWith('0002')) return { ok: false, reason: 'card_declined' };
  return { ok: true };
}
