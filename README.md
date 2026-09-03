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
| `GET` | `/health` | Liveness |

A token ending in `0002` is declined with `402 card_declined`.
