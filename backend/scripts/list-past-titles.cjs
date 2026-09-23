const http = require('http');

http.get('http://localhost:5000/api/past/archive?limit=100', (res) => {
  let d = '';
  res.on('data', (c) => (d += c));
  res.on('end', () => {
    const j = JSON.parse(d);
    const items = j.items || [];
    console.log('API past count:', items.length);
    for (const i of items) console.log(' -', i.eventName || i.title);
    process.exit(0);
  });
}).on('error', (e) => { console.error(e.message); process.exit(1); });
