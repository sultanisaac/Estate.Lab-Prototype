import { kv } from '@vercel/kv';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      // Fetch all bookings from the 'bookings' list in KV
      const bookings = await kv.lrange('bookings', 0, -1);
      
      // kv.lrange returns an array. If there are no bookings, return an empty array.
      return res.status(200).json(bookings || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: 'Error fetching bookings', error: error?.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
