import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, X, Image as ImageIcon, Search, Filter, Trash2, Edit3, Star 
} from 'lucide-react';
import { properties as frontendProperties } from '../../../data/properties';
import { styles } from '../../../data/styles';

export function PropertiesTab() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<any[]>(
    frontendProperties.map(p => ({ ...p, status: 'Available', isCurated: p.isCurated ?? true }))
  );
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, ids: string[] }>({ isOpen: false, ids: [] });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [curatedFilter, setCuratedFilter] = useState<string>('all'); // 'all' | 'curated' | 'non-curated'
  const [minBeds, setMinBeds] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/admin/properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProperties(data);
            localStorage.setItem('dev_properties', JSON.stringify(data));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('API not found locally. Using localStorage / mock properties for local development.');
      } 
      
      const localData = localStorage.getItem('dev_properties');
      if (localData) {
        setProperties(JSON.parse(localData));
      } else {
        const initialProps = frontendProperties.map(p => ({ 
          ...p, 
          status: 'Available',
          isCurated: p.isCurated ?? true
        }));
        setProperties(initialProps);
        localStorage.setItem('dev_properties', JSON.stringify(initialProps));
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const handleSeedDemoProperties = async () => {
    setLoading(true);
    try {
      const demoProps = frontendProperties.map((p, idx) => ({ 
        ...p, 
        status: 'Available',
        isCurated: idx < 4 ? true : (p.isCurated ?? false)
      }));

      for (const prop of demoProps) {
        await fetch('/api/admin/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `p-${Date.now()}-${Math.random()}`,
            name: prop.name || (prop as any).title,
            title: prop.name || (prop as any).title,
            collection: prop.collection || 'Starter',
            status: 'Available',
            style: prop.style || 'minimalis',
            isCurated: prop.isCurated,
            description: prop.description || '',
            location: prop.location || 'Prime Location',
            buildTime: prop.buildTime || '4-6 Months',
            customization: prop.customization || 'Available',
            specs: prop.specs || { area: '', beds: 1, baths: 1 },
            keyFeatures: prop.keyFeatures || [],
            images: {
              exterior: prop.images?.exterior || (prop as any).image || '',
              livingRoom: prop.images?.livingRoom || prop.images?.gallery?.[0] || '',
              kitchen: prop.images?.kitchen || prop.images?.gallery?.[1] || '',
              masterBed: prop.images?.masterBed || prop.images?.gallery?.[2] || '',
              bath: prop.images?.bath || prop.images?.gallery?.[3] || '',
              outdoor: prop.images?.outdoor || prop.images?.gallery?.[4] || '',
              gallery: []
            }
          })
        });
      }

      // Re-fetch or sync
      const res = await fetch('/api/admin/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
        localStorage.setItem('dev_properties', JSON.stringify(data));
      } else {
        setProperties(demoProps);
        localStorage.setItem('dev_properties', JSON.stringify(demoProps));
      }
    } catch (err) {
      alert("Failed to import demo properties.");
    } finally {
      setLoading(false);
    }
  };

  // Quick toggle for "The Curated Collections" spotlight directly from card
  const handleToggleCurated = async (property: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...property,
      isCurated: !property.isCurated
    };

    const updatedList = properties.map(p => p.id === property.id ? updated : p);
    setProperties(updatedList);
    localStorage.setItem('dev_properties', JSON.stringify(updatedList));

    try {
      await fetch('/api/admin/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.log('API sync skipped, cached locally.');
    }
  };

  const confirmDelete = (ids: string[]) => {
    setDeleteConfirmation({ isOpen: true, ids });
  };

  const executeDelete = async () => {
    const ids = deleteConfirmation.ids;
    if (ids.length === 0) return;

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) throw new Error('API failed');
      
      const newProps = properties.filter(p => !ids.includes(p.id));
      setProperties(newProps);
      localStorage.setItem('dev_properties', JSON.stringify(newProps));
      setSelectedProperties([]);
    } catch (error) {
      console.log('API call failed, removing from localStorage for dev.');
      const newProps = properties.filter(p => !ids.includes(p.id));
      setProperties(newProps);
      localStorage.setItem('dev_properties', JSON.stringify(newProps));
      setSelectedProperties([]);
    }
    setDeleteConfirmation({ isOpen: false, ids: [] });
  };

  const toggleSelection = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(pid => pid !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  const filteredProperties = properties.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatches = (p.name || p.title || '').toLowerCase().includes(searchLower);
    const styleMatches = (p.style || '').toLowerCase().includes(searchLower);
    const matchesSearch = nameMatches || styleMatches;

    const matchesStyle = selectedStyle === 'all' || p.style === selectedStyle;
    const matchesCurated = curatedFilter === 'all' 
      ? true 
      : curatedFilter === 'curated' 
        ? Boolean(p.isCurated) 
        : !p.isCurated;

    const matchesBeds = minBeds === 0 || ((p.specs?.beds || 0) >= minBeds);

    return matchesSearch && matchesStyle && matchesCurated && matchesBeds;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F4C5C]">Property Catalog</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your real estate listings, 16:9 media galleries, and Curated Collections.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedProperties.length > 0 && (
            <button 
              onClick={() => confirmDelete(selectedProperties)}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedProperties.length})</span>
            </button>
          )}
          <button 
            onClick={() => navigate('/admin/properties/new')}
            className="bg-[#0F4C5C] text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-[#0F4C5C]/90 transition-all shadow-md text-sm font-medium"
          >
            <Plus size={18} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search properties by name or architectural style..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 text-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 bg-gray-100 px-4 py-3 rounded-xl text-gray-700 text-sm"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Filter Dropdowns */}
        {(isFilterOpen || window.innerWidth >= 768) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            {/* The Curated Collections Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Home Page Showcase
              </label>
              <select
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl font-medium"
                value={curatedFilter}
                onChange={(e) => setCuratedFilter(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="curated">★ Curated Collections Only</option>
                <option value="non-curated">Catalog Only (Not on Home)</option>
              </select>
            </div>

            {/* Architectural Style */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Architectural Style
              </label>
              <select
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl font-medium"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                <option value="all">All Architectural Styles</option>
                {styles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>

            {/* Beds Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Bedrooms
              </label>
              <select
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl font-medium"
                value={minBeds}
                onChange={(e) => setMinBeds(Number(e.target.value))}
              >
                <option value={0}>Any Bedrooms</option>
                <option value={1}>1+ Beds</option>
                <option value={2}>2+ Beds</option>
                <option value={3}>3+ Beds</option>
                <option value={4}>4+ Beds</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
          <span className="text-gray-500 font-medium">Loading property catalog...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-full flex items-center justify-center mb-2">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-900">Your Property Catalog is Empty</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Start adding properties with 16:9 imagery and spotlight them in The Curated Collections.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSeedDemoProperties}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Import Demo Properties
            </button>
            <button 
              onClick={() => navigate('/admin/properties/new')}
              className="bg-[#0F4C5C] text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 hover:bg-[#0F4C5C]/90 transition-colors text-sm shadow-md"
            >
              <Plus size={18} />
              <span>Add Property</span>
            </button>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-500">No properties matched your search and filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStyle('all');
              setCuratedFilter('all');
              setMinBeds(0);
            }}
            className="mt-3 text-sm text-[#0F4C5C] font-semibold underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => {
            const exteriorImg = property.images?.exterior || property.image || '';
            const isCurated = Boolean(property.isCurated);

            return (
              <div 
                key={property.id} 
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${
                  selectedProperties.includes(property.id) 
                    ? 'border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20' 
                    : 'border-gray-100'
                }`}
              >
                {/* 16:9 Image Thumbnail Container */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {/* Select Checkbox */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <input 
                      type="checkbox" 
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => toggleSelection(property.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0F4C5C] focus:ring-[#0F4C5C] cursor-pointer shadow-md"
                    />
                  </div>

                  {exteriorImg ? (
                    <img 
                      src={exteriorImg} 
                      alt={property.name || property.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} className="opacity-40" />
                    </div>
                  )}

                  {/* Badges on Top Right */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm ${
                      property.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-800 text-white'
                    }`}>
                      {property.status || 'Available'}
                    </span>

                    {/* Quick Curated Toggle Badge */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleCurated(property, e)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1 transition-all ${
                        isCurated 
                          ? 'bg-[#D4B483] text-[#0F4C5C] hover:bg-[#cbb075]' 
                          : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white'
                      }`}
                      title={isCurated ? 'Featured in The Curated Collections (Click to toggle)' : 'Click to feature in The Curated Collections'}
                    >
                      <Star size={11} className={isCurated ? 'fill-[#0F4C5C] text-[#0F4C5C]' : 'text-gray-400'} />
                      <span>{isCurated ? 'Curated' : 'Not Curated'}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-xs text-[#0F4C5C] font-semibold uppercase tracking-wider mb-1">
                    <span>{property.style || 'Modern'}</span>
                    <span>{property.specs?.area || ''}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">
                    {property.name || property.title}
                  </h3>

                  <div className="text-xs text-gray-500 mb-3">
                    {property.specs?.beds || 0} Beds • {property.specs?.baths || 0} Baths • {property.location || 'Prime'}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button 
                      onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C5C] hover:text-[#0F4C5C]/80 transition-colors"
                    >
                      <Edit3 size={14} />
                      <span>Edit Details</span>
                    </button>
                    
                    <button 
                      onClick={() => confirmDelete([property.id])} 
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmation({ isOpen: false, ids: [] })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 md:p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setDeleteConfirmation({ isOpen: false, ids: [] })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              
              <h3 className="text-xl font-serif font-bold text-center text-gray-900 mb-2">Delete Property?</h3>
              <p className="text-center text-gray-500 mb-8 text-sm leading-relaxed">
                Are you sure you want to delete {deleteConfirmation.ids.length > 1 ? `these ${deleteConfirmation.ids.length} properties` : 'this property'}? This action is permanent and cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmation({ isOpen: false, ids: [] })}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
