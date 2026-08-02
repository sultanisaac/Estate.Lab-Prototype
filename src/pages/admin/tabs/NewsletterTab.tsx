import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { mockLeads } from "../../../data/mockAdminData";

export function NewsletterTab() {
  const [leads, setLeads] = useState<any[]>(mockLeads);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/admin/leads');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        // If data is empty or invalid, fallback to mock data for local dev
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data);
        }
      } catch (err) {
        console.log('Using mock leads data for local development.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Newsletter Subscribers</h2>
          <p className="text-gray-500">Manage and export your mailing list.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-gray-50 transition-colors">
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading subscribers...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium">Subscribed Date</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((sub, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.date}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.source}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-red-500 text-sm font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
