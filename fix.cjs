const fs = require('fs');

['api/subscribe.ts', 'api/booking.ts'].forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(/\\`/g, '`');
  txt = txt.replace(/\\\$/g, '$');
  fs.writeFileSync(f, txt);
  console.log('Fixed', f);
});
