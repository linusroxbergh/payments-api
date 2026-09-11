import { randomBytes } from 'node:crypto';
import { Hono } from 'hono';
import { newId, store, type Endpoint } from '../store';
import { EVENT_TYPES, type EventType } from '../webhooks/deliver';

export const webhookEndpoints = new Hono();

webhookEndpoints.post('/', async (c) => {
  const { url, events } = await c.req.json<{ url: string; events: string[] }>();
  if (!URL.canParse(url)) return c.json({ error: 'url must be an absolute URL' }, 400);
  const unknown = events.filter((e) => !EVENT_TYPES.includes(e as EventType));
  if (events.length === 0 || unknown.length > 0) {
    return c.json({ error: `events must be some of: ${EVENT_TYPES.join(', ')}` }, 400);
  }

  const endpoint: Endpoint = {
    id: newId('we'),
    url,
    events: events as EventType[],
    secret: `whsec_${randomBytes(24).toString('hex')}`,
  };
  store.endpoints.set(endpoint.id, endpoint);
  return c.json(endpoint, 201);
});

webhookEndpoints.delete('/:id', (c) => {
  return store.endpoints.delete(c.req.param('id')) ? c.body(null, 204) : c.json({ error: 'not found' }, 404);
});
