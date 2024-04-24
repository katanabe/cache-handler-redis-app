import { CacheHandler } from '@neshca/cache-handler';
import createLruHandler from '@neshca/cache-handler/local-lru';
import createRedisHandler from '@neshca/cache-handler/redis-stack';
import { createClient } from 'redis';

const REDIS_KEY_PREFIX = 'journey-web';

const REDIS_NAME_PREFIX = 'cache-handler';

/** @type {import("@neshca/cache-handler/redis-stack").CreateRedisStackHandlerOptions["timeoutMs"]} */
const REDIS_TIMEOUT_MS = 5000;

/** @type {import("@neshca/cache-handler").TTLParameters} */
const TTL = {
  defaultStaleAge: 31536000, // 1 year
  estimateExpireAge: (staleAge) => staleAge,
}

/** @type {import ("@neshca/cache-handler/local-lru").LruCacheOptions} */
const LRU_CACHE_OPTIONS = {
  maxItemsNumber: 1000,
  maxItemSizeBytes: 104857600, // 100 Mb,
}

CacheHandler.onCreation(async () => {
  let client;

  if (process.env.REDIS_URL) {
    try {
      // Create a Redis client.
      client = createClient({
        url: process.env.REDIS_URL,
        name: [REDIS_KEY_PREFIX, REDIS_NAME_PREFIX, process.env.PORT ?? process.pid].join(':'),
      });

      // Redis won't work without error handling.
      client.on('error', () => {
        console.error('Redis client error:', error);
      });
    } catch (error) {
      console.warn('Failed to create Redis client:', error);
    }

    if (client) {
      try {
        console.info('Connecting Redis client...');

        // Wait for the client to connect.
        // Caveat: This will block the server from starting until the client is connected.
        // And there is no timeout. Make your own timeout if needed.
        await client.connect();

        console.info('Redis client connected.');
      } catch (error) {
        console.warn('Failed to connect Redis client:', error);

        console.warn('Disconnecting the Redis client...');        
        // Try to disconnect the client to stop it from reconnecting.
        client
          .disconnect()
          .then(() => {
            console.info('Redis client disconnected.');
          })
          .catch(() => {
            console.warn('Failed to quit the Redis client after failing to connect.');
          });
      }
    }
  } else {
    console.warn('Make sure that REDIS_URL is added to the .env file and loaded properly.');
  }

  /** @type {import("@neshca/cache-handler").Handler | null} */
  let handler;

  if (client?.isReady) {
    // Create the `redis-stack` Handler if the client is available and connected.
    handler = await createRedisHandler({
      client,
      keyPrefix: [REDIS_KEY_PREFIX, process.env.GIT_HASH].filter(Boolean).join(':'),
      timeoutMs: REDIS_TIMEOUT_MS,
    });
  } else {
    // Fallback to LRU handler if Redis client is not available.
    // The application will still work, but the cache will be in-memory only and not shared.
    handler = createLruHandler(LRU_CACHE_OPTIONS);
    console.warn('Falling back to LRU handler because Redis client is not available.');
  }

  return {
    handlers: [handler],
    ttl: TTL,
  };
});

export default CacheHandler;