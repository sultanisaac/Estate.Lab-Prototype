import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import { mockBookings, mockLeads } from '../../../data/mockAdminData';

export function OverviewTab() {
  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [leads, setLeads] = useState<any[]>(mockLeads);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, leadsRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/admin/leads')
        ]);
        
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (Array.isArray(bookingsData) && bookingsData.length > 0) {
            setBookings(bookingsData);
          }
        }
        
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          if (Array.isArray(leadsData) && leadsData.length > 0) {
            setLeads(leadsData);
          }
        }
      } catch (err) {
        console.log('Using mock data for local development.');
      }
    }
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Bookings', value: bookings.length.toString(), icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'New Leads', value: leads.length.toString(), icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'Conversion Rate', value: '4.8%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-[#0F4C5C]">Overview</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{booking.name}</span> booked a viewing for <span className="font-medium text-[#0F4C5C]">{booking.property}</span>
              </p>
              <span className="text-sm text-gray-400">{booking.createdAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
