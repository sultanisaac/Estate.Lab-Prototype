import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Bed, Bath, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PropertyType } from '../../data/properties';
import { ImageGallery } from './ImageGallery';
import { Button } from './Button';

interface PropertyCardProps {
  property: PropertyType;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-brand-accent/30 group flex flex-col"
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={property.images.exterior} 
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-brand-background/90 backdrop-blur text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
            {property.collection}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              variant="secondary" 
              onClick={() => setIsGalleryOpen(true)}
              className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <Maximize className="w-4 h-4 mr-2" />
              View Gallery
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-serif text-brand-primary mb-1">{property.name}</h3>
              <p className="text-brand-text/70 text-sm">{property.specs.features[0]}</p>
            </div>
            <span className="text-brand-secondary font-medium">{property.specs.area}</span>
          </div>
          
          <p className="text-brand-text/80 text-sm mb-6 flex-1">{property.description}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-brand-accent/30">
            <div className="flex items-center gap-4 text-brand-text/70">
              <span className="flex items-center text-sm"><Bed className="w-4 h-4 mr-1" /> {property.specs.beds}</span>
              <span className="flex items-center text-sm"><Bath className="w-4 h-4 mr-1" /> {property.specs.baths}</span>
            </div>
            <Link 
              to={`/property/${property.id}`}
              className="text-brand-primary font-medium text-sm flex items-center hover:text-brand-secondary transition-colors"
            >
              Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      <ImageGallery 
        property={property} 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
      />
    </>
  );
}
