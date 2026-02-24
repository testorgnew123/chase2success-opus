import { createClient, type NeonClient } from "@neondatabase/neon-js";

/**
 * Lightweight Neon client for public pages — no BetterAuthReactAdapter.
 * This keeps the auth adapter (~50 KiB) out of public page bundles.
 * For admin pages that need signIn/signOut, use the full client from neon.ts.
 */
let _client: NeonClient | null = null;

function getClient(): NeonClient {
  if (!_client) {
    _client = createClient({
      auth: {
        url: import.meta.env.VITE_NEON_AUTH_URL,
        allowAnonymous: true,
      },
      dataApi: {
        url: import.meta.env.VITE_NEON_DATA_API_URL,
      },
    });
  }
  return _client;
}

export const neon = new Proxy({} as NeonClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
