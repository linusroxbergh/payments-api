# payments-api

Test-mode payments, refunds and webhooks for the Fernhill storefront. Hono on Node 24, state in memory (`src/store.ts`).

## Commands

- `pnpm dev`: http://localhost:8787, reloads on save
- `pnpm test`: Vitest; route tests go through `app.request`, no server needed
- `pnpm typecheck`

## Conventions

- Amounts are integer cents; reject anything else with a 400.
- A new event type goes in `EVENT_TYPES`, the README's event table, and a delivery test with a real signature check.
- Webhook delivery never fails the request that caused it.
