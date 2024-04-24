// https://nextjs.org/docs/app/building-your-application/deploying#configuring-caching
// cacheMaxMemorySizeを0 にすると in-memory cache が無効になる
const DISABLED_IN_MEMORY_CACHE_SIZE = 0; 

const DEFAULT_FILE_CACHE_SIZE = 52428800; // default 50 MB

const useRedisCache = !!process.env.REDIS_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheMaxMemorySize: useRedisCache ?
    DISABLED_IN_MEMORY_CACHE_SIZE :
    DEFAULT_FILE_CACHE_SIZE,
  cacheHandler: useRedisCache ?
    require.resolve("./cache-handler.mjs") :
    undefined
};

module.exports = nextConfig;
