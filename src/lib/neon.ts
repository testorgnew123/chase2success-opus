import { createClient, type NeonClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

/**
 * Lazy-initialised Neon client.
 * `createClient()` triggers an anonymous auth handshake (get-session →
 * token/anonymous) that adds ~3.5 s to the critical path on slow 4G.
 * By deferring creation until the first actual call, public page visitors
 * skip this cost entirely on initial load.
 */
let _client: NeonClient | null = null;

function getClient(): NeonClient {
  if (!_client) {
    _client = createClient({
      auth: {
        url: import.meta.env.VITE_NEON_AUTH_URL,
        adapter: BetterAuthReactAdapter(),
        allowAnonymous: true,
      },
      dataApi: {
        url: import.meta.env.VITE_NEON_DATA_API_URL,
      },
    });
  }
  return _client;
}

// Proxy that lazily forwards all property accesses to the real client.
// Every consumer still uses `neon.from(...)`, `neon.auth`, etc. unchanged.
export const neon = new Proxy({} as NeonClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
