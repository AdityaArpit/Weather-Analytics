const http = require('http');

http.get('http://localhost:5000/api/past/archive?limit=100', (res) => {
  let d = '';
  res.on('data', (c) => (d += c));
  res.on('end', () => {
    const j = JSON.parse(d);
    const items = j.items || [];
    const foreign = /(indonesia|java|flores|afghanistan|pakistan|bhutan|tibet|nepal)/i;
    let hits = 0;
    for (const i of items) {
      for (const t of i.timeline || []) {
        const text = t.event + ' ' + (t.description || '');
        if (foreign.test(text)) {
          hits++;
          console.log('FOREIGN in', i.eventName, '->', String(t.event).slice(0, 70));
        }
      }
    }
    console.log(hits === 0 ? 'CLEAN: no foreign-territory timeline entries' : hits + ' foreign entries');
    process.exit(0);
  });
}).on('error', (e) => { console.error(e.message); process.exit(1); });
