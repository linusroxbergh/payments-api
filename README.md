# payments-api

Charges and refunds for the Fernhill [storefront](https://github.com/linusroxbergh/storefront). Hono on Node 24.

Test mode only: tokens start with `tok_test_`, and everything is kept in memory, so a restart forgets every payment.

```sh
pnpm install
pnpm dev        # http://localhost:8787
pnpm test
```

## Endpoints

| Method | Path | |
| --- | --- | --- |
| `POST` | `/payments` | Charge `amount` cents in `usd` from a `source` token, tagged with the shop's order `reference` |
| `GET` | `/payments/:id` | One payment |
| `POST` | `/refunds` | Refund a payment, in full or `amount` cents of it |
| `POST` | `/webhook-endpoints` | Subscribe a `url` to `events`; the response holds its signing `secret` |
| `DELETE` | `/webhook-endpoints/:id` | Unsubscribe |
| `GET` | `/health` | Liveness |

A token ending in `0002` is declined with `402 card_declined`.

## Webhooks

Events go out as a `POST` with a `fernhill-signature: t=<unix seconds>,v1=<hex>` header, where `v1` is the HMAC-SHA256 of `<t>.<raw body>` keyed with the endpoint's secret. `verify()` in `src/webhooks/sign.ts` checks one, with five minutes of tolerance.

| Event | When |
| --- | --- |
| `payment.succeeded` | A charge went through |
| `refund.succeeded` | A refund went through; carries the payment's order `reference` |
