import { newId, store } from '../store';
import { sign } from './sign';

export const EVENT_TYPES = ['payment.succeeded'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export async function deliver(type: EventType, data: unknown): Promise<void> {
  const body = JSON.stringify({ id: newId('evt'), type, createdAt: new Date().toISOString(), data });
  const endpoints = [...store.endpoints.values()].filter((e) => e.events.includes(type));

  // One attempt per endpoint; a failing endpoint never fails the payment.
  await Promise.allSettled(
    endpoints.map((e) =>
      fetch(e.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'fernhill-signature': sign(body, e.secret) },
        body,
        signal: AbortSignal.timeout(5000),
      }),
    ),
  );
}
