import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { properties as fallbackProperties } from '../data/properties';
import { styles } from '../data/styles';
import { PropertyCard } from '../components/ui/PropertyCard';
import { Button } from '../components/ui/Button';

export function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [minBeds, setMinBeds] = useState<number>(0);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/admin/properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProperties(data.reverse()); // Reverse to show oldest first, matching initial layout
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('API not found locally. Falling back to localStorage or mock properties.');
      } 
      
      const localData = localStorage.getItem('dev_properties');
      if (localData) {
        setProperties(JSON.parse(localData));
      } else {
        setProperties(fallbackProperties);
      }
      setIsLoading(false);
    }
    fetchProperties();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const styleParam = searchParams.get('style');
    if (styleParam) {
      setSelectedStyle(styleParam);
    }
    
    const collectionParam = searchParams.get('collection');
    if (collectionParam) {
      setSelectedCollection(collectionParam);
    }
  }, [searchParams]);

  // Derived state
  const filteredProperties = properties.filter((property) => {
    // Search Query (name or description)
    const matchesSearch = 
      property.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.specs?.features?.some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      property.keyFeatures?.some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    // Style
    const matchesStyle = selectedStyle === 'all' || property.style === selectedStyle;

    // Collection
    const matchesCollection = selectedCollection === 'all' || property.collection?.toLowerCase() === selectedCollection.toLowerCase();

    // Beds
    const matchesBeds = minBeds === 0 || (property.specs?.beds >= minBeds);

    return matchesSearch && matchesStyle && matchesCollection && matchesBeds;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStyle('all');
    setSelectedCollection('all');
    setMinBeds(0);
    setSearchParams({}); // Clear query string
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-brand-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl text-brand-primary mb-6 font-bold">Discover Your Next Home</h1>
          <p className="text-brand-text/70 text-lg max-w-2xl">
            Browse our curated collection of architectural masterpieces. Filter by style, collection, or simply search to find exactly what you're looking for.
          </p>
        </motion.div>

        {/* Search and Filter Engine */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20 mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, feature, or description..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              className="md:hidden flex items-center justify-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>

          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 768) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden md:!h-auto md:!opacity-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                  {/* Style Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Architectural Style</label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-xl"
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
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-xl"
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                    >
                      <option value="all">All Collections</option>
                      <option value="starter">Starter</option>
                      <option value="family">Family</option>
                    </select>
                  </div>

                  {/* Beds Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Bedrooms</label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-gray-50 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-xl"
                      value={minBeds}
                      onChange={(e) => setMinBeds(Number(e.target.value))}
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+ Beds</option>
                      <option value={2}>2+ Beds</option>
                      <option value={3}>3+ Beds</option>
                      <option value={4}>4+ Beds</option>
                      <option value={5}>5+ Beds</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-brand-primary hover:text-brand-secondary transition-colors font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-serif text-brand-primary">
              {isLoading ? 'Loading Properties...' : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'Property' : 'Properties'} Found`}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px] border border-gray-100">
                  <div className="h-64 bg-gray-200 rounded-t-3xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300"
            >
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any properties matching your current filter criteria. Try adjusting your search.</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
