import { config } from 'dotenv';
config({ path: '.env.local' });

import handler from './api/subscribe.ts';

const req = {
  method: 'POST',
  body: { email: 'sultan.work26@gmail.com' }
};

const res = {
  status: (code) => {
    console.log('Status:', code);
    return res;
  },
  json: (data) => {
    console.log('Response:', data);
  }
};

handler(req, res).catch(console.error);
