import 'dotenv/config';

const t0 = Date.now();
const step = (label: string) => console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${label}`);

step('loading orchestrator');
const { researchHistoricalDisaster } = await import('../server/lib/researchOrchestrator');
step('orchestrator loaded');

const result = await Promise.race([
  researchHistoricalDisaster('2024 Wayanad landslide', { historical: true, forceResearch: true, maxResultsPerSource: 5 }),
  new Promise<never>((_, rej) => setTimeout(() => rej(new Error('RESEARCH_HANG_100s')), 100_000)),
]);
step(`research done: source=${result.source} evidence=${result.retrieval.evidenceCount}`);
console.log('succeeded:', result.retrieval.sourcesSucceeded.join(','));
console.log('failed:', JSON.stringify(result.retrieval.sourcesFailed));
console.log('persistence:', JSON.stringify(result.persistence, null, 2).slice(0, 800));

setTimeout(() => { step('exiting'); process.exit(0); }, 500);
