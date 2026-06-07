const fs = require('node:fs/promises');
const path = require('node:path');

const cachePath = path.join(__dirname, '..', 'data', 'offers-cache.json');
const ttlMs = Number(process.env.CACHE_TTL_MINUTES || 30) * 60 * 1000;

async function readCache() {
  try {
    return JSON.parse(await fs.readFile(cachePath, 'utf8'));
  } catch {
    return { updatedAt: null, offers: [] };
  }
}

async function writeCache(offers) {
  const payload = { updatedAt: new Date().toISOString(), offers };
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(payload, null, 2));
  return payload;
}

function isFresh(cache) {
  return Boolean(cache.updatedAt) && Date.now() - new Date(cache.updatedAt).getTime() < ttlMs;
}

module.exports = { readCache, writeCache, isFresh };
