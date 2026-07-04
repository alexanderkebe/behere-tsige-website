/**
 * In-memory cache of preloaded assets (blob object URLs), filled by the
 * splash-screen preloader. Components ask for their asset's URL through
 * getCachedAsset() — if the preloader downloaded it, they get the local blob
 * (instant playback, no second download); otherwise the original URL.
 */

const cache = new Map();

export function setCachedAsset(src, objectUrl) {
  cache.set(src, objectUrl);
}

export function getCachedAsset(src) {
  if (!src) return src;
  return cache.get(src) || src;
}
