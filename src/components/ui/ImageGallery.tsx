import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PropertyType } from '../../data/properties';

interface ImageGalleryProps {
  property: PropertyType;
  isOpen: boolean;
  onClose: () => void;
}

const imageLabels = [
  { key: 'exterior', label: 'Exterior / Façade' },
  { key: 'livingRoom', label: 'Living Room' },
  { key: 'kitchen', label: 'Kitchen & Dining' },
  { key: 'masterBed', label: 'Master Bedroom' },
  { key: 'bath', label: 'Bathroom / Toilet' },
  { key: 'outdoor', label: 'Outdoor / Garden' },
];

export function ImageGallery({ property, isOpen, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableImages = imageLabels.filter(item => {
    const img = property.images[item.key as keyof typeof property.images];
    return typeof img === 'string' && img.trim() !== '';
  });

  // Reset index when opening to avoid out-of-bounds
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, property.id]);

  useEffect(() => {
    if (!isOpen || availableImages.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % availableImages.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, availableImages.length]);

  if (!isOpen) return null;
  if (availableImages.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % availableImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  
  const currentItem = availableImages[currentIndex];
  const currentImage = property.images[currentItem.key as keyof typeof property.images];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
        onClick={onClose}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-brand-secondary transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div 
          className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 w-full p-4 text-center z-10">
            <h3 className="text-white font-serif text-2xl">{property.name}</h3>
            <p className="text-brand-secondary">{currentItem.label}</p>
          </div>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-brand-primary transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            src={currentImage as string} 
            alt={currentItem.label}
            className="w-full h-full object-contain md:object-cover rounded-xl"
          />

          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-brand-primary transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1 md:gap-2 z-10 px-2 md:px-4 pb-2">
            {availableImages.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-1 max-w-[64px] md:max-w-[96px] aspect-video rounded-sm md:rounded-md overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-brand-secondary' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img 
                  src={property.images[item.key as keyof typeof property.images] as string} 
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
