import { useState } from 'react';
import { LayoutDashboard, CalendarDays, Home, Users, LogOut, Menu, X, ClipboardList, Globe } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { OverviewTab } from './tabs/OverviewTab';
import { BookingsTab } from './tabs/BookingsTab';
import { CalendarTab } from './tabs/CalendarTab';
import { PropertiesTab } from './tabs/PropertiesTab';
import { NewsletterTab } from './tabs/NewsletterTab';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'overview', path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', path: '/admin/bookings', label: 'Bookings List', icon: ClipboardList },
    { id: 'calendar', path: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'properties', path: '/admin/properties', label: 'Properties', icon: Home },
    { id: 'newsletter', path: '/admin/newsletter', label: 'Newsletter', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0F4C5C] text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <h1 className="text-xl font-serif font-bold text-[#D4B483]">Estate.Lab</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0F4C5C] text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-serif font-bold text-[#D4B483]">Estate.Lab</h1>
          <p className="text-sm text-white/60 mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if the current route matches the tab's path
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' || location.pathname === '/admin/'
              : location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-[#D4B483] text-[#0F4C5C] font-medium' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <Globe size={20} />
            <span>View Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-red-300 hover:text-red-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto bg-gray-50 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route index element={<OverviewTab />} />
            <Route path="bookings" element={<BookingsTab />} />
            <Route path="calendar" element={<CalendarTab />} />
            <Route path="properties" element={<PropertiesTab />} />
            <Route path="newsletter" element={<NewsletterTab />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
