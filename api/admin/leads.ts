import { kv } from '@vercel/kv';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      // Fetch all leads from the 'leads' list in KV
      const leads = await kv.lrange('leads', 0, -1);
      
      return res.status(200).json(leads || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ message: 'Error fetching leads', error: error?.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
