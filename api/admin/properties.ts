import { kv } from '@vercel/kv';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const properties = await kv.lrange('properties', 0, -1);
      return res.status(200).json(properties || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({ message: 'Error fetching properties', error: error?.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newProperty = req.body;
      await kv.lpush('properties', newProperty);
      return res.status(200).json({ message: 'Property added', property: newProperty });
    } catch (error: any) {
      console.error('Error saving property:', error);
      return res.status(500).json({ message: 'Error saving property', error: error?.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Expecting { ids: ['id1', 'id2'] } in the body
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No property IDs provided for deletion.' });
      }

      // Fetch all, filter, and rewrite the list
      const properties = await kv.lrange('properties', 0, -1);
      const filteredProperties = properties.filter((p: any) => !ids.includes(p.id));
      
      await kv.del('properties');
      
      if (filteredProperties.length > 0) {
        await kv.rpush('properties', ...filteredProperties);
      }
      
      return res.status(200).json({ message: 'Properties deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return res.status(500).json({ message: 'Error deleting property', error: error?.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedProperty = req.body;
      if (!updatedProperty.id) {
        return res.status(400).json({ message: 'Property ID is required for update.' });
      }

      // Fetch all, update the specific one, and rewrite the list
      const properties = await kv.lrange('properties', 0, -1);
      const updatedProperties = properties.map((p: any) => 
        p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p
      );
      
      await kv.del('properties');
      
      if (updatedProperties.length > 0) {
        await kv.rpush('properties', ...updatedProperties);
      }
      
      return res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error: any) {
      console.error('Error updating property:', error);
      return res.status(500).json({ message: 'Error updating property', error: error?.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
