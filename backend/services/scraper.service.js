const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('node:crypto');

const client = axios.create({
  timeout: Number(process.env.SCRAPER_TIMEOUT_MS || 8000),
  headers: { 'User-Agent': process.env.SCRAPER_USER_AGENT || 'CyberDropsAcademicMVP/1.0' },
  maxRedirects: 3
});

const fallbackImages = {
  Steam: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
  Epic: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=900&q=80',
  Kabum: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80',
  Amazon: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=900&q=80',
  AliExpress: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80'
};

function numberFrom(text = '') {
  const normalized = text.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
  return Number.parseFloat(normalized) || 0;
}

function idFor(store, title) {
  return Number.parseInt(crypto.createHash('sha1').update(`${store}:${title}`).digest('hex').slice(0, 8), 16);
}

function normalize({ store, title, description, category = 'Games', oldPrice, currentPrice, discount, image, url, coupon }) {
  const price = Number(currentPrice) || 0;
  const old = Number(oldPrice) || price;
  const calculatedDiscount = old > price && old > 0 ? Math.round((1 - price / old) * 100) : 0;
  return {
    id: idFor(store, title), title: title.trim(), description: description?.trim() || `Oferta pública encontrada na ${store}.`,
    store, category, oldPrice: old, currentPrice: price, discount: Number(discount) || calculatedDiscount,
    image: image || fallbackImages[store], url, coupon: coupon || null, createdAt: new Date().toISOString()
  };
}

async function scrapeSteam() {
  const { data } = await client.get('https://store.steampowered.com/search/?specials=1&supportedlang=portuguese');
  const $ = cheerio.load(data);
  return $('#search_resultsRows a.search_result_row').slice(0, 8).map((_, element) => {
    const row = $(element);
    const title = row.find('.title').text().trim();
    const prices = row.find('.discount_prices');
    return normalize({
      store: 'Steam', title, description: 'Oferta em destaque na Steam.', category: 'Games',
      oldPrice: numberFrom(prices.find('.discount_original_price').text()),
      currentPrice: numberFrom(prices.find('.discount_final_price').text()),
      discount: Math.abs(numberFrom(row.find('.discount_pct').text())),
      image: row.find('img').attr('src'), url: row.attr('href')
    });
  }).get().filter(offer => offer.title && offer.url);
}

async function scrapeKabum() {
  const { data } = await client.get('https://www.kabum.com.br/busca/gamer');
  const $ = cheerio.load(data);
  return $('article, [data-testid="product-card"]').slice(0, 6).map((_, element) => {
    const card = $(element);
    const link = card.find('a').first();
    const title = card.find('h2,h3,[class*="name"]').first().text().trim();
    const priceTexts = card.find('[class*="price"]').map((__, price) => $(price).text()).get();
    return normalize({
      store: 'Kabum', title, description: 'Hardware gamer em promoção na Kabum.', category: 'Hardware',
      oldPrice: numberFrom(priceTexts[1] || priceTexts[0]), currentPrice: numberFrom(priceTexts[0]),
      image: card.find('img').first().attr('src'), url: new URL(link.attr('href') || '/', 'https://www.kabum.com.br').href
    });
  }).get().filter(offer => offer.title && offer.currentPrice);
}

async function scrapeEpic() {
  const { data } = await client.get('https://store.epicgames.com/pt-BR/free-games');
  const $ = cheerio.load(data);
  return $('a[href*="/p/"]').slice(0, 5).map((_, element) => {
    const link = $(element); const title = link.find('h3,h4').first().text().trim() || link.attr('aria-label') || '';
    return normalize({ store: 'Epic', title, description: 'Jogo em destaque na Epic Games.', category: 'Games', currentPrice: 0, discount: 100, image: link.find('img').attr('src'), url: new URL(link.attr('href'), 'https://store.epicgames.com').href });
  }).get().filter(offer => offer.title);
}

async function scrapeAmazon() {
  const { data } = await client.get('https://www.amazon.com.br/s?k=games+promo%C3%A7%C3%A3o');
  const $ = cheerio.load(data);
  return $('[data-component-type="s-search-result"]').slice(0, 5).map((_, element) => {
    const card = $(element); const title = card.find('h2').text().trim(); const link = card.find('h2 a').attr('href');
    return normalize({ store: 'Amazon', title, description: 'Oferta gamer pública na Amazon.', category: 'Hardware', currentPrice: numberFrom(card.find('.a-price .a-offscreen').first().text()), image: card.find('img.s-image').attr('src'), url: new URL(link || '/', 'https://www.amazon.com.br').href });
  }).get().filter(offer => offer.title && offer.currentPrice);
}

async function scrapeAliExpress() {
  const { data } = await client.get('https://pt.aliexpress.com/w/wholesale-gamer.html');
  const $ = cheerio.load(data);
  return $('a[href*="/item/"]').slice(0, 5).map((_, element) => {
    const link = $(element); const title = link.attr('title') || link.find('h3').text().trim();
    return normalize({ store: 'AliExpress', title, description: 'Acessório gamer em promoção no AliExpress.', category: 'Hardware', currentPrice: numberFrom(link.text()), image: link.find('img').attr('src'), url: new URL(link.attr('href'), 'https://pt.aliexpress.com').href });
  }).get().filter(offer => offer.title && offer.currentPrice);
}

async function scrapeOffers() {
  const results = await Promise.allSettled([scrapeSteam(), scrapeEpic(), scrapeKabum(), scrapeAmazon(), scrapeAliExpress()]);
  const offers = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
  const errors = results.filter(result => result.status === 'rejected').map(result => result.reason?.message || 'Fonte indisponível');
  return { offers, errors };
}

module.exports = { scrapeOffers };
