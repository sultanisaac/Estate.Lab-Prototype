import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, AlertCircle } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  imageLabel?: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  imageLabel = 'Property Image',
  onClose,
  onCropComplete,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset when a new image is loaded or modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Touch events for mobile/tablet admin usage
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.min(Math.max(0.6, prev + zoomFactor), 3.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const container = containerRef.current;
      const img = imageRef.current;
      const containerRect = container.getBoundingClientRect();

      // We want to export at a crisp 16:9 canvas resolution (e.g., 1920x1080)
      const exportWidth = 1920;
      const exportHeight = 1080;

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // The ratio between export resolution and display viewport
      const ratioMultiplier = exportWidth / containerRect.width;

      ctx.save();
      // Translate to canvas center
      ctx.translate(exportWidth / 2, exportHeight / 2);

      // Apply admin transformations
      ctx.translate(position.x * ratioMultiplier, position.y * ratioMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Natural image aspect calculation
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = 16 / 9;

      let drawWidth = exportWidth;
      let drawHeight = exportHeight;

      if (naturalAspect > containerAspect) {
        // Image is wider than 16:9
        drawHeight = exportHeight;
        drawWidth = exportHeight * naturalAspect;
      } else {
        // Image is taller than 16:9
        drawWidth = exportWidth;
        drawHeight = exportWidth / naturalAspect;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            onCropComplete(blob, previewUrl);
          }
        },
        'image/jpeg',
        0.92
      );
    } catch (error) {
      console.error('Crop processing failed:', error);
      setIsProcessing(false);
      alert('Failed to crop image. Please try again.');
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#111827] text-white rounded-3xl w-full max-w-4xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4B483] text-[#0F4C5C]">
                  16:9 Strict Ratio
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Crop & Frame: {imageLabel}
                </h3>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Drag to position, use slider or wheel to zoom. Cropped to standard 16:9 landscape.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Viewport Area */}
          <div className="p-6 flex flex-col items-center justify-center bg-black/40">
            {/* 16:9 Aspect Ratio Frame Container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-neutral-900 border-2 border-[#D4B483]/80 shadow-2xl cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: 'none' }}
            >
              {/* Image being cropped */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                }}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  crossOrigin="anonymous"
                  draggable={false}
                  className="max-w-none w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* 16:9 Grid Overlay (Rule of Thirds) */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-r border-b border-white/15"></div>
                <div className="border-b border-white/15"></div>
                <div className="border-r border-white/15"></div>
                <div className="border-r border-white/15"></div>
                <div></div>
              </div>

              {/* Pan Drag Indicator overlay */}
              <div className="absolute top-3 left-3 pointer-events-none bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white/80 flex items-center gap-1.5 border border-white/10">
                <Move size={12} />
                <span>Drag to reposition</span>
              </div>

              {/* 16:9 Badge */}
              <div className="absolute bottom-3 right-3 pointer-events-none bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-[#D4B483] border border-white/10">
                16:9 (1920 × 1080)
              </div>
            </div>

            {/* Hint Notice */}
            <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <AlertCircle size={14} className="text-[#D4B483]" />
              <span>To ensure consistent layout across Estate.Lab, all images must be strictly 16:9 landscape.</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="px-6 py-4 bg-[#1F2937] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Zoom & Rotation Controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => setScale(prev => Math.max(0.6, prev - 0.1))}
                  className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="3.0"
                  step="0.05"
                  value={scale}
                  onChange={e => setScale(parseFloat(e.target.value))}
                  className="w-28 sm:w-36 accent-[#D4B483] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setScale(prev => Math.min(3.0, prev + 0.1))}
                  className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <span className="text-xs font-mono text-white/60 min-w-[38px] text-right">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <div className="h-5 w-px bg-white/15 hidden sm:block"></div>

              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors text-xs"
                title="Rotate 90 degrees"
              >
                <RotateCw size={14} />
                <span>Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className="text-xs text-white/50 hover:text-white/80 transition-colors underline"
              >
                Reset
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-[#D4B483] text-[#0F4C5C] hover:bg-[#e0c498] font-bold transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0F4C5C] border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Apply & Save 16:9</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
