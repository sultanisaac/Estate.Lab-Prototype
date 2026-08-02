import { useState, useEffect } from "react";
import { X, Mail, Phone, Calendar, Home, Info, Search, ArrowUpDown } from "lucide-react";
import { mockBookings } from "../../../data/mockAdminData";

export function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedBookings = [...bookings]
    .filter(booking => {
       const searchLower = searchQuery.toLowerCase();
       const matchesSearch = booking.name.toLowerCase().includes(searchLower) ||
                             booking.email.toLowerCase().includes(searchLower) ||
                             booking.property.toLowerCase().includes(searchLower);
       const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
       return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
       if (!sortConfig) return 0;
       
       const { key, direction } = sortConfig;
       let valA = a[key];
       let valB = b[key];
       
       if (key === 'date') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
       }
       
       if (valA < valB) return direction === 'asc' ? -1 : 1;
       if (valA > valB) return direction === 'asc' ? 1 : -1;
       return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Bookings & Inquiries</h2>
          <p className="text-gray-500">Manage client viewing requests and consultations.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or property..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 shadow-sm transition-all text-sm"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Name <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
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
                    <button 
                      className="text-gray-400 hover:text-red-500 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete logic here
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAndSortedBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No bookings match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
