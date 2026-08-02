import { useState, useEffect } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Search, Filter } from 'lucide-react';
import { properties as frontendProperties } from '../../../data/properties';
import { styles } from '../../../data/styles';

export function PropertiesTab() {
  const [properties, setProperties] = useState<any[]>(
    // Initialize with real frontend properties, appending a default status so the UI works
    frontendProperties.map(p => ({ ...p, status: 'Available' }))
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<'exterior' | 'gallery' | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [minBeds, setMinBeds] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const initialPropertyState = { 
    name: '', 
    collection: 'Starter', 
    status: 'Available', 
    style: 'minimalis',
    description: '',
    location: 'Prime Location',
    buildTime: '4-6 Months',
    customization: 'Available',
    specs: { area: '', beds: 1, baths: 1, features: '' },
    images: { exterior: '', gallery: '' } 
  };
  const [newProperty, setNewProperty] = useState(initialPropertyState);

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
        const initialProps = frontendProperties.map(p => ({ ...p, status: 'Available' }));
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
      const demoProps = frontendProperties.map(p => ({ ...p, status: 'Available' }));
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
            description: prop.description || '',
            location: prop.location || 'Prime Location',
            buildTime: prop.buildTime || '4-6 Months',
            customization: prop.customization || 'Available',
            specs: prop.specs || { area: '', beds: 1, baths: 1 },
            keyFeatures: prop.keyFeatures || [],
            images: {
              exterior: prop.images?.exterior || (prop as any).image || '',
              gallery: []
            }
          })
        });
      }
      // Re-fetch from DB
      const res = await fetch('/api/admin/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
        localStorage.setItem('dev_properties', JSON.stringify(data));
      }
    } catch (err) {
      alert("Failed to import demo properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'exterior' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(type);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setNewProperty({ 
          ...newProperty, 
          images: { ...newProperty.images, [type]: data.data.url } 
        });
      } else {
        alert('Upload failed: ' + data.error.message);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please ensure your VITE_IMGBB_API_KEY is correct in .env.local');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform state back into nested object for saving
    const propertyData = {
      id: editingId || `p-${Date.now()}`,
      name: newProperty.name,
      title: newProperty.name,
      collection: newProperty.collection,
      status: newProperty.status,
      style: newProperty.style,
      description: newProperty.description,
      location: newProperty.location,
      buildTime: newProperty.buildTime,
      customization: newProperty.customization,
      specs: {
        area: newProperty.specs.area,
        beds: parseInt(newProperty.specs.beds as any) || 0,
        baths: parseInt(newProperty.specs.baths as any) || 0
      },
      keyFeatures: newProperty.specs.features.split(',').map(f => f.trim()).filter(Boolean),
      images: {
        exterior: newProperty.images.exterior,
        gallery: newProperty.images.gallery ? [newProperty.images.gallery] : []
      }
    };

    try {
      const res = await fetch('/api/admin/properties', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      if (!res.ok) throw new Error('API failed');
      
      let newProps = [];
      if (editingId) {
        newProps = properties.map(p => p.id === editingId ? propertyData : p);
      } else {
        newProps = [propertyData, ...properties];
      }
      setProperties(newProps);
      localStorage.setItem('dev_properties', JSON.stringify(newProps));
    } catch (error) {
      console.log('API call failed, saving to localStorage for dev.');
      let newProps = [];
      if (editingId) {
        newProps = properties.map(p => p.id === editingId ? propertyData : p);
      } else {
        newProps = [propertyData, ...properties];
      }
      setProperties(newProps);
      localStorage.setItem('dev_properties', JSON.stringify(newProps));
    }
    
    closeAndResetModal();
  };

  const handleEdit = (property: any) => {
    setEditingId(property.id);
    setNewProperty({
      name: property.name || property.title || '',
      collection: property.collection || 'Starter',
      status: property.status || 'Available',
      style: property.style || 'minimalis',
      description: property.description || '',
      location: property.location || 'Prime Location',
      buildTime: property.buildTime || '4-6 Months',
      customization: property.customization || 'Available',
      specs: {
        area: property.specs?.area || '',
        beds: property.specs?.beds || 1,
        baths: property.specs?.baths || 1,
        features: property.keyFeatures?.join(', ') || ''
      },
      images: {
        exterior: property.images?.exterior || property.image || '',
        gallery: property.images?.gallery?.[0] || ''
      }
    });
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewProperty(initialPropertyState);
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length > 1 ? 'these properties' : 'this property'}?`)) return;

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
  };

  const toggleSelection = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(pid => pid !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Property Catalog</h2>
          <p className="text-gray-500">Manage your real estate listings and collections.</p>
        </div>
        <div className="flex space-x-3">
          {selectedProperties.length > 0 && (
            <button 
              onClick={() => handleDelete(selectedProperties)}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-red-100 transition-colors"
            >
              <span>Delete Selected ({selectedProperties.length})</span>
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F4C5C] text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-[#0F4C5C]/90 transition-colors"
          >
            <Plus size={20} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search properties by name or collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 bg-gray-100 px-4 py-3 rounded-xl text-gray-700"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Filters */}
        {(isFilterOpen || window.innerWidth >= 768) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 mt-4 border-t border-gray-100">
            {/* Style Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Architectural Style</label>
              <select
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                <option value="all">All Styles</option>
                {styles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>

            {/* Collection Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
              <select
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="all">All Collections</option>
                <option value="starter">Starter</option>
                <option value="signature">Signature</option>
                <option value="signature+">Signature+</option>
              </select>
            </div>

            {/* Beds Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Bedrooms</label>
              <select
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 rounded-xl"
                value={minBeds}
                onChange={(e) => setMinBeds(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+ Beds</option>
                <option value={2}>2+ Beds</option>
                <option value={3}>3+ Beds</option>
                <option value={4}>4+ Beds</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#0F4C5C] rounded-full flex items-center justify-center mb-2">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Your Property Catalog is Empty</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            It looks like this is a fresh Vercel database! You can start adding properties manually, or import the demo properties to get started instantly.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSeedDemoProperties}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Import Demo Properties
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0F4C5C] text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 hover:bg-[#0F4C5C]/90 transition-colors"
            >
              <Plus size={20} />
              <span>Add Property</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {properties
            .filter(p => {
               const searchLower = searchQuery.toLowerCase();
               const nameMatches = (p.name || p.title || '').toLowerCase().includes(searchLower);
               const collectionSearchMatches = (p.collection || '').toLowerCase().includes(searchLower);
               const matchesSearch = nameMatches || collectionSearchMatches;

               const matchesStyle = selectedStyle === 'all' || p.style === selectedStyle;
               const matchesCollection = selectedCollection === 'all' || (p.collection || '').toLowerCase() === selectedCollection.toLowerCase();
               const matchesBeds = minBeds === 0 || ((p.specs?.beds || 0) >= minBeds);

               return matchesSearch && matchesStyle && matchesCollection && matchesBeds;
            })
            .map((property) => (
            <div key={property.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-colors ${selectedProperties.includes(property.id) ? 'border-[#0F4C5C] ring-1 ring-[#0F4C5C]' : 'border-gray-100'}`}>
              <div className="h-32 md:h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative">
                
                {/* Checkbox for selection */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
                  <input 
                    type="checkbox" 
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => toggleSelection(property.id)}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-[#0F4C5C] focus:ring-[#0F4C5C] cursor-pointer shadow-sm"
                  />
                </div>

                {property.images?.exterior || property.image ? (
                  <img src={property.images?.exterior || property.image} alt={property.name || property.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="opacity-50" />
                )}
                <div className="absolute top-2 right-2 md:top-3 md:right-3">
                  <span className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-full ${
                    property.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold tracking-wider text-[#0F4C5C] uppercase">
                    {property.collection}
                  </span>
                </div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-1">{property.name || property.title}</h3>
                
                <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 flex justify-between">
                  <button onClick={() => handleEdit(property)} className="text-[#0F4C5C] text-xs md:text-sm font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete([property.id])} className="text-gray-400 hover:text-red-500 text-xs md:text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeAndResetModal}>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-serif text-[#0F4C5C]">{editingId ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={closeAndResetModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              
              {/* SECTION: Basic Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input type="text" required value={newProperty.name} onChange={e => setNewProperty({...newProperty, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. Type 36 or The Glass House" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                    <select value={newProperty.collection} onChange={e => setNewProperty({...newProperty, collection: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
                      <option value="Starter">Starter</option>
                      <option value="Family">Family</option>
                      <option value="Signature">Signature</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                    <input type="text" value={newProperty.style} onChange={e => setNewProperty({...newProperty, style: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. minimalis, tropis" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={newProperty.status} onChange={e => setNewProperty({...newProperty, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: Specifications */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size (Area)</label>
                    <input type="text" value={newProperty.specs.area} onChange={e => setNewProperty({...newProperty, specs: {...newProperty.specs, area: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. 36 m²" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                    <input type="number" min="0" value={newProperty.specs.beds} onChange={e => setNewProperty({...newProperty, specs: {...newProperty.specs, beds: parseInt(e.target.value) || 0}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                    <input type="number" min="0" value={newProperty.specs.baths} onChange={e => setNewProperty({...newProperty, specs: {...newProperty.specs, baths: parseInt(e.target.value) || 0}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (comma separated)</label>
                  <input type="text" value={newProperty.specs.features} onChange={e => setNewProperty({...newProperty, specs: {...newProperty.specs, features: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. Mini Living Room, Carport, Indoor Garden" />
                </div>
              </div>

              {/* SECTION: Details & Marketing */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Details & Marketing</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About this Property</label>
                    <textarea rows={3} value={newProperty.description} onChange={e => setNewProperty({...newProperty, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="Detailed description of the property..."></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Label</label>
                      <input type="text" value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. Prime Location" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Est. Build Time</label>
                      <input type="text" value={newProperty.buildTime} onChange={e => setNewProperty({...newProperty, buildTime: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. 4-6 Months" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customization</label>
                      <input type="text" value={newProperty.customization} onChange={e => setNewProperty({...newProperty, customization: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" placeholder="e.g. Available" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Images */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Property Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Landing / Exterior Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landing Page Image (Exterior)</label>
                    {newProperty.images.exterior ? (
                      <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                        <img src={newProperty.images.exterior} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setNewProperty({...newProperty, images: {...newProperty.images, exterior: ''}})} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'exterior')} disabled={!!isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-48 bg-gray-50 hover:bg-gray-100 transition-colors">
                          {isUploading === 'exterior' ? (
                            <div className="flex flex-col items-center space-y-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0F4C5C]"></div>
                              <span className="text-sm text-gray-500">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                              <Upload size={24} className="text-[#0F4C5C]/60" />
                              <span className="text-sm font-medium">Upload Exterior Photo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Gallery Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Gallery Image</label>
                    {newProperty.images.gallery ? (
                      <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                        <img src={newProperty.images.gallery} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setNewProperty({...newProperty, images: {...newProperty.images, gallery: ''}})} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={!!isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-48 bg-gray-50 hover:bg-gray-100 transition-colors">
                          {isUploading === 'gallery' ? (
                            <div className="flex flex-col items-center space-y-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0F4C5C]"></div>
                              <span className="text-sm text-gray-500">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                              <Upload size={24} className="text-[#0F4C5C]/60" />
                              <span className="text-sm font-medium">Upload Gallery Photo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!!isUploading}
                  className="px-6 py-2.5 text-sm font-medium bg-[#0F4C5C] text-white rounded-xl hover:bg-[#0F4C5C]/90 transition-colors disabled:opacity-50 shadow-sm"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
