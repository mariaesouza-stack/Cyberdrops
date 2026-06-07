const express = require('express');
const { readCache, writeCache, isFresh } = require('../services/cache.service');
const { scrapeOffers } = require('../services/scraper.service');
const mockOffers = require('../data/mock-offers.json');

const router = express.Router();
let refreshInFlight = null;

async function availableOffers() {
  const cache = await readCache();
  if (isFresh(cache)) return cache.offers;
  if (!refreshInFlight) {
    refreshInFlight = scrapeOffers()
      .then(async result => result.offers.length ? (await writeCache(result.offers)).offers : cache.offers.length ? cache.offers : mockOffers)
      .finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

router.get('/', async (_req, res) => {
  const cache = await readCache();
  const offers = await availableOffers();
  const latest = await readCache();
  res.json({ offers, source: latest.offers.length ? 'cache' : cache.offers.length ? 'cache' : 'mock', updatedAt: latest.updatedAt });
});
router.get('/search', async (req, res) => {
  const query = String(req.query.q || '').toLowerCase();
  const offers = (await availableOffers()).filter(offer => `${offer.title} ${offer.store} ${offer.category} ${offer.description}`.toLowerCase().includes(query));
  res.json({ offers });
});
router.get('/store/:store', async (req, res) => {
  const store = req.params.store.toLowerCase();
  res.json({ offers: (await availableOffers()).filter(offer => offer.store.toLowerCase() === store) });
});
router.get('/category/:category', async (req, res) => {
  const category = req.params.category.toLowerCase();
  res.json({ offers: (await availableOffers()).filter(offer => offer.category.toLowerCase() === category) });
});
router.post('/refresh', async (_req, res) => {
  const cache = await readCache();
  if (isFresh(cache)) return res.json({ ...cache, source: 'cache', message: 'Cache ainda válido.' });
  const result = await scrapeOffers();
  if (!result.offers.length) return res.json({ offers: cache.offers.length ? cache.offers : mockOffers, source: cache.offers.length ? 'cache' : 'mock', warnings: result.errors });
  const saved = await writeCache(result.offers);
  res.json({ ...saved, source: 'scraping', warnings: result.errors });
});
router.get('/:id', async (req, res) => {
  const offer = (await availableOffers()).find(item => String(item.id) === req.params.id);
  if (!offer) return res.status(404).json({ message: 'Oferta não encontrada.' });
  res.json({ offer });
});

module.exports = router;
