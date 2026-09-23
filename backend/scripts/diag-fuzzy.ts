import 'dotenv/config';
import { findFuzzyDuplicate } from '../server/lib/researchOrchestrator';

(async () => {
  const fuzzy = await findFuzzyDuplicate({
    eventKey: 'landslide-kerala-2024-2024-wayanad-landslides',
    title: '2024 Wayanad Landslides',
    disasterType: 'Landslide',
    state: 'Kerala',
    year: 2024,
  });
  console.log('fuzzy result for Wayanad seed:', fuzzy);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
