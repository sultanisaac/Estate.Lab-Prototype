import { kv } from '@vercel/kv';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { leads } = req.body;

  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ message: 'No valid leads provided for import.' });
  }

  try {
    // Get existing leads to prevent importing exact duplicate emails
    const existingLeads: any[] = (await kv.lrange('leads', 0, -1)) || [];
    const existingEmails = new Set(existingLeads.map(l => l.email));

    const newLeads = leads.filter(lead => lead.email && !existingEmails.has(lead.email));

    if (newLeads.length === 0) {
      return res.status(200).json({ 
        message: 'No new leads imported (all emails already existed in the database).' 
      });
    }

    // Push all new leads into the 'leads' list in Vercel KV
    // Reversing ensures the first item in the CSV ends up at the "top" of the list
    await kv.lpush('leads', ...newLeads.reverse());

    return res.status(200).json({ 
      message: `Successfully imported ${newLeads.length} new subscribers!` 
    });
  } catch (error: any) {
    console.error('Error importing leads:', error);
    return res.status(500).json({ 
      message: 'Failed to import leads', 
      error: error?.message || String(error) 
    });
  }
}
