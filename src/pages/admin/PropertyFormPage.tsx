import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Upload, Trash2, RefreshCw, Star, 
  Check, Image as ImageIcon, Sparkles, Plus, X 
} from 'lucide-react';
import { styles } from '../../data/styles';
import { properties as fallbackProperties } from '../../data/properties';
import { ImageCropperModal } from '../../components/admin/ImageCropperModal';

const IMAGE_SLOTS = [
  { key: 'exterior', label: 'Landing Page (Exterior / Hero)', description: 'Primary thumbnail shown in catalog & cards' },
  { key: 'livingRoom', label: 'Living Room', description: 'Main living area photo' },
  { key: 'kitchen', label: 'Kitchen & Dining', description: 'Cooking & culinary space' },
  { key: 'masterBed', label: 'Master Bedroom', description: 'Main sleeping quarters' },
  { key: 'bath', label: 'Bathroom', description: 'Primary bath & sanitary area' },
  { key: 'outdoor', label: 'Outdoor / Garden / Carport', description: 'Exterior yard or balcony' }
];

export function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    collection: 'Starter',
    status: 'Available',
    style: 'minimalis',
    isCurated: true, // Default to true for easy discovery
    description: '',
    location: 'Prime Location',
    buildTime: '4-6 Months',
    customization: 'Available',
    specs: {
      area: '',
      beds: 1,
      baths: 1,
      features: [] as string[]
    },
    images: {
      exterior: '',
      livingRoom: '',
      kitchen: '',
      masterBed: '',
      bath: '',
      outdoor: '',
      gallery: [] as string[]
    }
  });

  // Cropper State
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    targetSlot: string | null;
    slotLabel: string;
  }>({
    isOpen: false,
    imageSrc: null,
    targetSlot: null,
    slotLabel: ''
  });

  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadSlot, setActiveUploadSlot] = useState<string | null>(null);

  // Load existing property data if editing
  useEffect(() => {
    if (!isEditing || !id) return;

    async function loadProperty() {
      setIsLoading(true);
      try {
        let property: any = null;

        // Try API first
        try {
          const res = await fetch('/api/admin/properties');
          if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) {
              property = list.find((p: any) => p.id === id);
            }
          }
        } catch (e) {
          console.log('API fetch skipped or failed locally.');
        }

        // Try localStorage
        if (!property) {
          const localData = localStorage.getItem('dev_properties');
          if (localData) {
            const parsed = JSON.parse(localData);
            property = parsed.find((p: any) => p.id === id);
          }
        }

        // Try fallback bundled properties
        if (!property) {
          property = fallbackProperties.find(p => p.id === id);
        }

        if (property) {
          const rawFeatures = property.specs?.features || property.keyFeatures || [];
          const featuresArray = Array.isArray(rawFeatures)
            ? rawFeatures
            : typeof rawFeatures === 'string'
              ? rawFeatures.split(',').map((f: string) => f.trim()).filter(Boolean)
              : [];

          setFormData({
            name: property.name || property.title || '',
            collection: property.collection || 'Starter',
            status: property.status || 'Available',
            style: property.style || 'minimalis',
            isCurated: property.isCurated ?? true,
            description: property.description || '',
            location: property.location || 'Prime Location',
            buildTime: property.buildTime || '4-6 Months',
            customization: property.customization || 'Available',
            specs: {
              area: property.specs?.area || '',
              beds: property.specs?.beds || 1,
              baths: property.specs?.baths || 1,
              features: featuresArray
            },
            images: {
              exterior: property.images?.exterior || property.image || '',
              livingRoom: property.images?.livingRoom || property.images?.gallery?.[0] || '',
              kitchen: property.images?.kitchen || property.images?.gallery?.[1] || '',
              masterBed: property.images?.masterBed || property.images?.gallery?.[2] || '',
              bath: property.images?.bath || property.images?.gallery?.[3] || '',
              outdoor: property.images?.outdoor || property.images?.gallery?.[4] || '',
              gallery: property.images?.gallery || []
            }
          });
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [id, isEditing]);

  // Handle file selection from disk -> Open 16:9 Cropper
  const handleSelectFile = (slotKey: string) => {
    setActiveUploadSlot(slotKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSlot) return;

    const matchedSlot = IMAGE_SLOTS.find(s => s.key === activeUploadSlot);
    const slotLabel = matchedSlot ? matchedSlot.label : 'Property Image';

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCropperModal({
        isOpen: true,
        imageSrc: result,
        targetSlot: activeUploadSlot,
        slotLabel: slotLabel
      });
    };
    reader.readAsDataURL(file);
  };

  // Called after 16:9 cropping is completed in the modal
  const handleCropComplete = async (croppedBlob: Blob, previewUrl: string) => {
    const slotKey = cropperModal.targetSlot;
    if (!slotKey) return;

    // Close the cropper modal
    setCropperModal(prev => ({ ...prev, isOpen: false }));
    setUploadingSlot(slotKey);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      
      if (apiKey) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', croppedBlob, `${slotKey}-${Date.now()}.jpg`);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formDataUpload
        });

        const data = await res.json();
        if (data.success && data.data?.url) {
          setFormData(prev => ({
            ...prev,
            images: {
              ...prev.images,
              [slotKey]: data.data.url
            }
          }));
          setUploadingSlot(null);
          return;
        }
      }

      // Fallback for local development or if ImgBB fails: use data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [slotKey]: base64data
          }
        }));
        setUploadingSlot(null);
      };
      reader.readAsDataURL(croppedBlob);

    } catch (err) {
      console.error('Image upload failed, falling back to local preview:', err);
      // Fallback to local object URL
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [slotKey]: previewUrl
        }
      }));
      setUploadingSlot(null);
    }
  };

  // Delete image from slot
  const handleDeleteImage = (slotKey: string) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [slotKey]: ''
      }
    }));
  };

  // Tag Management for Key Features
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!formData.specs.features.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          features: [...prev.specs.features, trimmed]
        }
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        features: prev.specs.features.filter(t => t !== tagToRemove)
      }
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide a property name.');
      return;
    }

    setIsSaving(true);

    const propertyId = id || `p-${Date.now()}`;
    const payload = {
      id: propertyId,
      name: formData.name,
      title: formData.name,
      collection: formData.collection,
      status: formData.status,
      style: formData.style,
      isCurated: formData.isCurated,
      description: formData.description,
      location: formData.location,
      buildTime: formData.buildTime,
      customization: formData.customization,
      specs: {
        area: formData.specs.area,
        beds: parseInt(formData.specs.beds as any) || 0,
        baths: parseInt(formData.specs.baths as any) || 0,
        features: formData.specs.features
      },
      keyFeatures: formData.specs.features,
      images: {
        exterior: formData.images.exterior,
        livingRoom: formData.images.livingRoom,
        kitchen: formData.images.kitchen,
        masterBed: formData.images.masterBed,
        bath: formData.images.bath,
        outdoor: formData.images.outdoor,
        gallery: []
      }
    };

    try {
      // Send to Vercel KV API
      await fetch('/api/admin/properties', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Update LocalStorage dev cache
      const localData = localStorage.getItem('dev_properties');
      let currentList = localData ? JSON.parse(localData) : fallbackProperties.map(p => ({ ...p, status: 'Available' }));
      
      if (isEditing) {
        currentList = currentList.map((p: any) => p.id === propertyId ? payload : p);
      } else {
        currentList = [payload, ...currentList];
      }
      localStorage.setItem('dev_properties', JSON.stringify(currentList));

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin/properties');
      }, 700);

    } catch (err) {
      console.error('API submission failed, updating local state:', err);
      // Fallback save to localStorage
      const localData = localStorage.getItem('dev_properties');
      let currentList = localData ? JSON.parse(localData) : fallbackProperties.map(p => ({ ...p, status: 'Available' }));
      
      if (isEditing) {
        currentList = currentList.map((p: any) => p.id === propertyId ? payload : p);
      } else {
        currentList = [payload, ...currentList];
      }
      localStorage.setItem('dev_properties', JSON.stringify(currentList));

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin/properties');
      }, 700);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F4C5C]"></div>
        <p className="text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hidden file input for opening cropper */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={onFileInputChange} 
      />

      {/* 16:9 Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageSrc={cropperModal.imageSrc}
        imageLabel={cropperModal.slotLabel}
        onClose={() => setCropperModal(prev => ({ ...prev, isOpen: false }))}
        onCropComplete={handleCropComplete}
      />

      {/* Sticky Top Navigation & Header */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md pt-2 pb-4 mb-6 border-b border-gray-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to="/admin/properties" className="hover:text-[#0F4C5C] flex items-center gap-1 transition-colors">
                <ArrowLeft size={16} />
                <span>Properties</span>
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{isEditing ? 'Edit Property' : 'Create New Property'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F4C5C] flex items-center gap-3">
              {isEditing ? (formData.name || 'Edit Property') : 'Add New Property'}
              {formData.isCurated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-sans font-semibold rounded-full bg-[#D4B483]/20 text-[#856937] border border-[#D4B483]/40">
                  <Star size={12} className="fill-[#D4B483] text-[#D4B483]" />
                  Curated Collection
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 font-medium transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check size={16} className="text-[#D4B483]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditing ? 'Update Property' : 'Publish Property'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Curated Collection Spotlight Card */}
        <div className={`p-6 rounded-2xl border transition-all shadow-sm ${
          formData.isCurated 
            ? 'bg-gradient-to-r from-[#0F4C5C]/5 via-[#D4B483]/10 to-amber-50/50 border-[#D4B483]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${formData.isCurated ? 'bg-[#D4B483] text-[#0F4C5C]' : 'bg-gray-100 text-gray-400'}`}>
                <Sparkles size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif font-bold text-gray-900">
                    The Curated Collections
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    formData.isCurated ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {formData.isCurated ? 'Featured on Home Page' : 'Catalog Only'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Turn this switch on to highlight this product directly in the exclusive <strong>"The Curated Collections"</strong> showcase on the home page.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isCurated}
                onChange={e => setFormData({ ...formData, isCurated: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0F4C5C]"></div>
            </label>
          </div>
        </div>

        {/* Two-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 spans): Details & Specs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section: Basic Information */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-serif font-bold text-[#0F4C5C]">Basic Information</h2>
                <p className="text-sm text-gray-500">Core identity and architectural style of the property.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Name / Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Type 36, Type 54, or The Glass Villa"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location / City Label
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Jakarta, Bali, Bandung, or Prime Location"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Architectural Style
                  </label>
                  <select
                    value={formData.style}
                    onChange={e => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  >
                    {styles.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    <option value="modern-contemporary">Modern Contemporary</option>
                    <option value="japandi">Japandi Modern</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Status
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Available' })}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-center ${
                        formData.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20 font-bold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Sold' })}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-center ${
                        formData.status === 'Sold'
                          ? 'bg-gray-800 text-white border-gray-900 ring-2 ring-gray-700/20 font-bold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Sold Out
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marketing Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the architectural design concept, space optimization, and target lifestyle..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Section: Specifications */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-serif font-bold text-[#0F4C5C]">Specifications</h2>
                <p className="text-sm text-gray-500">Physical dimensions, room counts, and standout amenities.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size / Area
                  </label>
                  <input
                    type="text"
                    value={formData.specs.area}
                    onChange={e => setFormData({ ...formData, specs: { ...formData.specs, area: e.target.value } })}
                    placeholder="e.g. 36 m²"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.specs.beds}
                    onChange={e => setFormData({ ...formData, specs: { ...formData.specs, beds: parseInt(e.target.value) || 0 } })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.specs.baths}
                    onChange={e => setFormData({ ...formData, specs: { ...formData.specs, baths: parseInt(e.target.value) || 0 } })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-base transition-all"
                  />
                </div>
              </div>

              {/* Tag / Chip Input for Key Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Features & Highlights
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type amenity (e.g. Mini Living Room, Carport, High Ceiling) & press Enter"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors flex items-center gap-1"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>

                {formData.specs.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.specs.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F4C5C]/10 text-[#0F4C5C] text-xs font-medium border border-[#0F4C5C]/20"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(feature)}
                          className="hover:text-red-500 rounded-full p-0.5 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No features added yet. Add a few highlights to attract buyers!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 span): Live Summary Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-base font-serif font-bold text-[#0F4C5C] mb-4 flex items-center justify-between">
                <span>Card Preview</span>
                <span className="text-xs font-sans font-normal text-gray-400">Live Appearance</span>
              </h3>

              {/* Preview Card */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                <div className="relative aspect-video bg-gray-100">
                  {formData.images.exterior ? (
                    <img 
                      src={formData.images.exterior} 
                      alt="Exterior Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                      <ImageIcon size={28} />
                      <span className="text-xs">No exterior image</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      formData.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-800 text-white'
                    }`}>
                      {formData.status}
                    </span>
                  </div>

                  {formData.isCurated && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#D4B483] text-[#0F4C5C] shadow-sm flex items-center gap-1">
                        <Star size={10} className="fill-[#0F4C5C]" />
                        Curated
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-semibold text-[#0F4C5C] uppercase tracking-wider">
                    {formData.style} • {formData.specs.area || 'N/A'}
                  </div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">
                    {formData.name || 'Untitled Property'}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 border-t border-gray-100">
                    <span>{formData.specs.beds} Beds</span>
                    <span>•</span>
                    <span>{formData.specs.baths} Baths</span>
                    <span>•</span>
                    <span>{formData.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions in Sidebar */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 font-medium transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Publish Property'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/properties')}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                >
                  Discard & Exit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Section: 16:9 Image Gallery Management */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-[#0F4C5C]">
                  Property Media Gallery
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4B483]/20 text-[#856937] border border-[#D4B483]/40">
                  Strict 16:9 Landscape
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload room-by-room imagery. When uploading, the 16:9 cropper allows precise panning and zoom framing.
              </p>
            </div>
          </div>

          {/* 16:9 Image Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMAGE_SLOTS.map((slot) => {
              const currentImageUrl = formData.images[slot.key as keyof typeof formData.images] as string;
              const isUploadingThis = uploadingSlot === slot.key;

              return (
                <div key={slot.key} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">
                      {slot.label}
                    </span>
                    {slot.key === 'exterior' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Primary Hero
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{slot.description}</p>

                  {/* 16:9 Aspect Frame */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group shadow-sm transition-all">
                    {isUploadingThis ? (
                      /* Uploading State */
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 space-y-2">
                        <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#0F4C5C] border-t-transparent"></div>
                        <span className="text-xs font-medium text-gray-500">Uploading 16:9 image...</span>
                      </div>
                    ) : currentImageUrl ? (
                      /* Populated Image with Hover / Action Controls */
                      <>
                        <img 
                          src={currentImageUrl} 
                          alt={slot.label} 
                          className="w-full h-full object-cover" 
                        />

                        {/* Always visible on mobile, hover on desktop overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                          <button
                            type="button"
                            onClick={() => handleSelectFile(slot.key)}
                            className="p-2.5 rounded-xl bg-white text-gray-800 hover:bg-[#D4B483] hover:text-[#0F4C5C] shadow-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                            title="Replace image with new 16:9 crop"
                          >
                            <RefreshCw size={14} />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(slot.key)}
                            className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                            title="Delete image"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* 16:9 Badge */}
                        <div className="absolute bottom-2 left-2 pointer-events-none bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/90">
                          16:9
                        </div>
                      </>
                    ) : (
                      /* Empty Slot - Drop / Select Zone */
                      <div
                        onClick={() => handleSelectFile(slot.key)}
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/80 transition-colors border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center group-hover:border-[#0F4C5C]/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#0F4C5C]/5 text-[#0F4C5C] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload size={18} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-[#0F4C5C]">
                          Upload 16:9 Image
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          Click to select & crop
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors text-sm font-medium"
          >
            ← Back to Properties
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 font-medium transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? 'Save Changes' : 'Publish Property'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
