import { useState, useEffect } from "react";
import { mockBookings } from "../../../data/mockAdminData";

export function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/admin/bookings');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        // If data is empty or invalid, fallback to mock data for local dev
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        }
      } catch (err) {
        console.log('Using mock bookings data for local development.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Bookings & Inquiries</h2>
          <p className="text-gray-500">Manage client viewing requests and consultations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{booking.email}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.property}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#0F4C5C] hover:underline text-sm font-medium mr-3">Edit</button>
                    <button className="text-gray-400 hover:text-red-500 text-sm font-medium">Delete</button>
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
