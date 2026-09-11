import { randomBytes } from 'node:crypto';
import type { EventType } from './webhooks/deliver';

export type Payment = {
  id: string;
  amount: number;
  currency: 'usd';
  reference: string;
  email?: string;
  status: 'succeeded' | 'declined';
  refunded: number;
  createdAt: string;
};

export type Refund = {
  id: string;
  paymentId: string;
  amount: number;
  createdAt: string;
};

export type Endpoint = {
  id: string;
  url: string;
  events: EventType[];
  secret: string;
};

export const store = {
  payments: new Map<string, Payment>(),
  refunds: new Map<string, Refund>(),
  endpoints: new Map<string, Endpoint>(),
};

export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString('hex')}`;
}
