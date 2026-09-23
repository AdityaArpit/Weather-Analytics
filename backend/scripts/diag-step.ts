import 'dotenv/config';

const t0 = Date.now();
const step = (label: string) => console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${label}`);

step('loading googleNews module');
const { searchGoogleNews } = await import('../server/googleNews');
step('googleNews module loaded');

const articles = await Promise.race([
  searchGoogleNews('Wayanad landslide', { isCurrentNews: false, maxResults: 6 }),
  new Promise<never>((_, rej) => setTimeout(() => rej(new Error('GNEWS_HANG_25s')), 25_000)),
]);
step(`searchGoogleNews done, items=${articles.length}`);

setTimeout(() => {
  step('event loop drained, exiting');
  process.exit(0);
}, 500);
