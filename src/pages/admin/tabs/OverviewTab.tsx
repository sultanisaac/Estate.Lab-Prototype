import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, X, Mail, Phone, Home, Info } from 'lucide-react';
import { mockBookings, mockLeads } from '../../../data/mockAdminData';

export function OverviewTab() {
  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [leads, setLeads] = useState<any[]>(mockLeads);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

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
        <div className="space-y-2">
          {bookings.slice(0, 3).map((booking) => (
            <div 
              key={booking.id} 
              className="flex justify-between items-center p-3 border border-transparent border-b-gray-50 last:border-b-transparent hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{booking.name}</span> booked a viewing for <span className="font-medium text-[#0F4C5C]">{booking.property}</span>
              </p>
              <span className="text-sm text-gray-400">{booking.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-serif text-[#0F4C5C]">Client Information</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center text-[#0F4C5C] text-2xl font-serif font-bold">
                  {selectedBooking.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{selectedBooking.name}</h4>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedBooking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedBooking.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Info</h5>
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={`mailto:${selectedBooking.email}`} className="hover:text-[#0F4C5C] hover:underline">{selectedBooking.email}</a>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={`tel:${selectedBooking.phone}`} className="hover:text-[#0F4C5C] hover:underline">{selectedBooking.phone}</a>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inquiry Details</h5>
                  <div className="flex items-center text-sm text-gray-700">
                    <Home className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="font-medium">{selectedBooking.property}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{selectedBooking.date} at {selectedBooking.time}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F4C5C]/5 p-4 rounded-xl border border-[#0F4C5C]/10 flex items-start">
                <Info className="w-5 h-5 text-[#0F4C5C] mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  Request submitted <span className="font-medium">{selectedBooking.createdAt}</span>. 
                  Reach out to the client via email or phone to confirm their consultation.
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <a 
                href={`mailto:${selectedBooking.email}?subject=Consultation Regarding ${selectedBooking.property}`}
                className="px-4 py-2 bg-[#0F4C5C] text-white rounded-xl hover:bg-[#0F4C5C]/90 transition-colors flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
