import { randomBytes } from 'node:crypto';

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

export const store = {
  payments: new Map<string, Payment>(),
  refunds: new Map<string, Refund>(),
};

export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString('hex')}`;
}
