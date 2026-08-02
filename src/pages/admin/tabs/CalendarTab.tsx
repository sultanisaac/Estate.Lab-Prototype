import { useState, useEffect, useRef } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, endOfWeek, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Phone, MapPin, X, Mail, Home, Info, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { mockBookings } from "../../../data/mockAdminData";

export function CalendarTab() {
  const [bookings, setBookings] = useState<any[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date("2026-10-24")); // Reference date matching mock data
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterMode, setFilterMode] = useState<"all" | "Pending" | "Contacted" | "Closed">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/admin/bookings');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        }
      } catch (err) {
        console.log('Using mock bookings data for local development.');
      }
    }
    fetchBookings();
  }, []);

  // Set initial view mode based on screen size and listen for resizes
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setViewMode("daily");
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (filterMode === "all") return true;
    return b.status === filterMode;
  });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const timeSlots = Array.from({ length: 11 }).map((_, i) => `${i + 9}:00`); // 9 AM to 7 PM

  const getBookingsForDateTime = (date: Date, timeStr: string) => {
    return filteredBookings.filter(b => {
      const bDate = parseISO(b.date);
      const hour = timeStr.split(":")[0];
      return isSameDay(bDate, date) && b.time.startsWith(hour);
    });
  };

  const handleNextWeek = () => setCurrentDate(viewMode === "weekly" ? addDays(currentDate, 7) : addMonths(currentDate, 1));
  const handlePrevWeek = () => setCurrentDate(viewMode === "weekly" ? addDays(currentDate, -7) : addMonths(currentDate, -1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const monthStartDate = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 });
  const monthEndDate = endOfWeek(endOfCurrentMonth, { weekStartsOn: 1 });
  
  const monthDays = [];
  let d = monthStartDate;
  while (d <= monthEndDate) {
    monthDays.push(d);
    d = addDays(d, 1);
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Calendar</h2>
          <p className="text-gray-500">Visual overview of property viewings.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <select 
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
                className="font-serif text-xl md:text-2xl font-bold text-[#0F4C5C] bg-transparent border-none cursor-pointer focus:outline-none hover:bg-gray-50 rounded-md px-1"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {format(new Date(2026, i, 1), "MMMM")}
                  </option>
                ))}
              </select>
              <select 
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                className="font-serif text-xl md:text-2xl font-bold text-[#0F4C5C] bg-transparent border-none cursor-pointer focus:outline-none hover:bg-gray-50 rounded-md px-1"
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const yearOption = new Date().getFullYear() - 2 + i; // from 2 years ago to 7 years ahead
                  return <option key={yearOption} value={yearOption}>{yearOption}</option>;
                })}
              </select>
            </div>
            
            {filterMode !== "all" && (
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0",
                filterMode === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                filterMode === "Contacted" ? "bg-blue-100 text-blue-700" : 
                "bg-green-100 text-green-700"
              )}>
                {filterMode} Only
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200 shrink-0">
              <button 
                onClick={() => setViewMode("daily")}
                className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "daily" ? "bg-white shadow-sm text-[#0F4C5C]" : "text-gray-500 hover:text-gray-900")}
              >Daily</button>
              <button 
                onClick={() => setViewMode("weekly")}
                className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "weekly" ? "bg-white shadow-sm text-[#0F4C5C]" : "text-gray-500 hover:text-gray-900")}
              >Weekly</button>
              <button 
                onClick={() => setViewMode("monthly")}
                className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "monthly" ? "bg-white shadow-sm text-[#0F4C5C]" : "text-gray-500 hover:text-gray-900")}
              >Monthly</button>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handlePrevWeek} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextWeek} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={cn("p-2 border rounded-md transition-colors", filterMode !== "all" ? "bg-[#0F4C5C]/10 border-[#0F4C5C] text-[#0F4C5C]" : "border-gray-200 text-gray-700 hover:bg-gray-50")}
                title="Toggle Filters"
              >
                <Filter className="w-5 h-5" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Filter By Status</p>
                    {(["all", "Pending", "Contacted", "Closed"] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterMode(status);
                          setShowFilterDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 capitalize",
                          filterMode === status ? "bg-[#0F4C5C]/10 text-[#0F4C5C]" : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        {status === "all" ? "All Bookings" : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          {viewMode === "daily" ? (
            <div className="min-w-full flex flex-col h-full p-3 md:p-6 bg-gray-50/50">
              {/* Mobile Calendar Grid */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 shrink-0">
                <div className="grid grid-cols-7 mb-3">
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center">
                      <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">{format(day, "EEE")}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                  {monthDays.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isSelected = isSameDay(day, currentDate);
                    const hasBookings = filteredBookings.some(b => isSameDay(parseISO(b.date), day));
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentDate(day)}
                        className="flex flex-col items-center justify-center relative py-1.5"
                      >
                        <span className={cn(
                          "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-sm md:text-base font-semibold transition-all",
                          isSelected ? "bg-[#0F4C5C] text-white shadow-md scale-110" : 
                          !isCurrentMonth ? "text-gray-300" : "text-gray-700 hover:bg-gray-100",
                        )}>
                          {format(day, "d")}
                        </span>
                        {hasBookings && !isSelected && (
                          <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#0F4C5C] shadow-sm"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Agenda */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-[#0F4C5C]">
                    {isSameDay(currentDate, new Date()) ? "Today's Schedule" : format(currentDate, "MMMM d, yyyy")}
                  </h3>
                  <span className="text-xs font-semibold text-gray-600 bg-white shadow-sm border border-gray-100 px-2.5 py-1 rounded-md">
                    {filteredBookings.filter(b => isSameDay(parseISO(b.date), currentDate)).length} Bookings
                  </span>
                </div>
                
                <div className="space-y-3 pb-8">
                  {timeSlots.map(time => {
                    const cellBookings = getBookingsForDateTime(currentDate, time);
                    if (cellBookings.length === 0) return null;
                    
                    return cellBookings.map(booking => (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className={cn(
                          "w-full text-left p-4 md:p-5 rounded-2xl transition-all shadow-sm flex items-start gap-4 md:gap-5 border cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
                          booking.status === "Pending" ? "bg-yellow-50/50 border-yellow-200" :
                          booking.status === "Contacted" ? "bg-blue-50/50 border-blue-200" :
                          "bg-green-50/50 border-green-200"
                        )}
                      >
                        <div className={cn(
                          "font-bold text-sm md:text-base min-w-[65px] pt-1",
                          booking.status === "Pending" ? "text-yellow-800" :
                          booking.status === "Contacted" ? "text-blue-800" :
                          "text-green-800"
                        )}>
                          {booking.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                            <p className={cn(
                              "font-bold text-base md:text-lg",
                              booking.status === "Pending" ? "text-yellow-900" :
                              booking.status === "Contacted" ? "text-blue-900" :
                              "text-green-900"
                            )}>
                              {booking.name}
                            </p>
                            <span className={cn(
                              "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0",
                              booking.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                              booking.status === "Contacted" ? "bg-blue-100 text-blue-700" :
                              "bg-green-100 text-green-700"
                            )}>
                              {booking.status}
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm font-medium mb-2 flex items-center gap-1.5",
                            booking.status === "Pending" ? "text-yellow-700/80" :
                            booking.status === "Contacted" ? "text-blue-700/80" :
                            "text-green-700/80"
                          )}>
                            <MapPin className="w-3.5 h-3.5" />
                            {booking.property}
                          </p>
                          {booking.phone && (
                            <p className="text-xs text-gray-600 flex items-center gap-1.5 bg-white/50 w-fit px-2 py-1 rounded-md border border-black/5">
                              <Phone className="w-3 h-3 opacity-70" /> {booking.phone}
                            </p>
                          )}
                        </div>
                      </button>
                    ));
                  })}
                  
                  {filteredBookings.filter(b => isSameDay(parseISO(b.date), currentDate)).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <CalendarIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No bookings for this date</p>
                      <p className="text-gray-400 text-xs mt-1">Select another day to view schedule</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : viewMode === "weekly" ? (
            <div className="min-w-[800px] h-full flex flex-col">
              <div className="grid grid-cols-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="py-4 px-2 text-center border-r border-gray-100 flex flex-col justify-center bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</span>
                </div>
                {weekDays.map((day, i) => (
                  <div key={i} className="py-4 px-2 text-center border-r border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{format(day, "EEE")}</p>
                    <p className={cn(
                      "text-lg font-medium mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors",
                      isSameDay(day, currentDate) ? "bg-[#0F4C5C] text-white shadow-md shadow-[#0F4C5C]/20" : "text-gray-900"
                    )}>
                      {format(day, "d")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex-1">
                {timeSlots.map((time, i) => (
                  <div key={i} className="grid grid-cols-8 border-b border-gray-100 group">
                    <div className="py-4 px-2 text-center border-r border-gray-100 text-xs font-medium text-gray-500">
                      {time}
                    </div>
                    
                    {weekDays.map((day, j) => {
                      const cellBookings = getBookingsForDateTime(day, time);
                      
                      return (
                        <div key={j} className="border-r border-gray-100 relative min-h-[80px] p-1.5 transition-colors group-hover:bg-gray-50/50">
                          {cellBookings.map((booking) => (
                            <button
                              key={booking.id}
                              onClick={() => setSelectedBooking(booking)}
                              className={cn(
                                "w-full text-left p-2.5 rounded-md mb-1.5 transition-all hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
                                booking.status === "Pending" ? "bg-yellow-50 border border-yellow-200" :
                                booking.status === "Contacted" ? "bg-blue-50 border border-blue-200" :
                                "bg-green-50 border border-green-200"
                              )}
                            >
                              <p className={cn(
                                "text-xs font-semibold truncate",
                                booking.status === "Pending" ? "text-yellow-800" :
                                booking.status === "Contacted" ? "text-blue-800" :
                                "text-green-800"
                              )}>
                                {booking.time} - {booking.name}
                              </p>
                              <p className="text-[10px] text-gray-600 truncate mt-0.5">{booking.property}</p>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-w-[800px] h-full flex flex-col">
              <div className="grid grid-cols-7 border-b border-gray-100 sticky top-0 bg-white z-10">
                {weekDays.map((day, i) => (
                  <div key={i} className="py-3 px-2 text-center border-r border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{format(day, "EEEE")}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex-1 grid grid-cols-7 grid-rows-5">
                {monthDays.map((day, i) => {
                  const dayBookings = filteredBookings.filter(b => isSameDay(parseISO(b.date), day));
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div key={i} className={cn(
                      "border-r border-b border-gray-100 p-2 min-h-[120px] transition-colors hover:bg-gray-50",
                      !isCurrentMonth && "bg-gray-50/50 opacity-60"
                    )}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                          isSameDay(day, currentDate) ? "bg-[#0F4C5C] text-white shadow-md shadow-[#0F4C5C]/20" : 
                          "text-gray-900"
                        )}>
                          {format(day, "d")}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-[10px] font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-1.5 py-0.5 rounded-md">
                            {dayBookings.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                        {dayBookings.map(booking => (
                          <button
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={cn(
                              "w-full text-left px-2 py-1 rounded text-[10px] font-medium truncate transition-all hover:scale-[1.02] cursor-pointer",
                              booking.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                              booking.status === "Contacted" ? "bg-blue-100 text-blue-800" :
                              "bg-green-100 text-green-800"
                            )}
                          >
                            {booking.time} {booking.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                    <CalendarIcon className="w-4 h-4 mr-3 text-gray-400" />
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
