import { useParams, Link } from 'react-router-dom';
import { properties } from '../data/properties';
import { Bed, Bath, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif text-brand-primary mb-4">Property Not Found</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const galleryImages = [
    { src: property.images.livingRoom, label: 'Living Room' },
    { src: property.images.kitchen, label: 'Kitchen' },
    { src: property.images.masterBed, label: 'Master Bedroom' },
    { src: property.images.bath, label: 'Bathroom' },
    { src: property.images.outdoor, label: 'Outdoor' },
  ];

  return (
    <div className="font-sans bg-brand-background min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img 
          src={property.images.exterior} 
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <Link to="/">
            <Button variant="secondary" className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto">
            <div className="inline-block px-4 py-1 bg-brand-secondary text-brand-primary font-bold text-sm uppercase tracking-wider rounded-full mb-4">
              {property.collection} Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-md">{property.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-lg md:text-xl text-white/90">
              <span className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> Prime Location</span>
              <span className="flex items-center"><Bed className="w-5 h-5 mr-2" /> {property.specs.beds} Beds</span>
              <span className="flex items-center"><Bath className="w-5 h-5 mr-2" /> {property.specs.baths} Baths</span>
              <span className="font-medium bg-white/20 px-3 py-1 rounded-md backdrop-blur-sm">{property.specs.area}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif text-brand-primary mb-6">About this Property</h2>
              <p className="text-lg text-brand-text/80 leading-relaxed">{property.description}</p>
            </section>

            <section>
              <h2 className="text-3xl font-serif text-brand-primary mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.specs.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-brand-accent/20">
                    <CheckCircle className="w-6 h-6 text-brand-secondary flex-shrink-0" />
                    <span className="text-brand-text font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-3xl font-serif text-brand-primary mb-6">Property Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded-xl overflow-hidden group">
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium drop-shadow-md">
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / CTA */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-accent/20 sticky top-24">
              <h3 className="text-2xl font-serif text-brand-primary mb-2">Interested in {property.name}?</h3>
              <p className="text-brand-text/70 mb-8">Schedule a consultation with our architects to discuss customizing this model for your family.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-brand-accent/20">
                  <span className="text-brand-text/70">Collection</span>
                  <span className="font-medium text-brand-primary">{property.collection}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-brand-accent/20">
                  <span className="text-brand-text/70">Est. Build Time</span>
                  <span className="font-medium text-brand-primary">4-6 Months</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-brand-accent/20">
                  <span className="text-brand-text/70">Customization</span>
                  <span className="font-medium text-brand-primary">Available</span>
                </div>
              </div>

              <Link to="/booking" className="block w-full">
                <Button className="w-full py-4 text-lg">Book Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
