import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, PenTool, CheckCircle, Quote } from 'lucide-react';

import { PropertyCard } from '../components/ui/PropertyCard';
import { StyleCard } from '../components/ui/StyleCard';
import { properties } from '../data/properties';
import { styles } from '../data/styles';

export function Home() {
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  
  const starterCollection = properties.filter(p => p.collection === 'Starter');
  const familyCollection = properties.filter(p => p.collection === 'Family');
  const signatureCollection = properties.filter(p => p.collection === 'Signature');

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 tracking-tight drop-shadow-md"
          >
            Engineered for Living.<br className="hidden md:block"/> Designed for You.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-brand-accent/90 max-w-2xl mx-auto mb-12 drop-shadow"
          >
            Discover architecturally significant homes that blend premium luxury with unparalleled functional design.
          </motion.p>
          

        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-brand-primary text-white py-8 border-b-4 border-brand-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-center">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-brand-secondary" />
              <div className="text-left">
                <p className="font-bold text-lg">15+ Years</p>
                <p className="text-white/70 text-sm">Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-secondary" />
              <div className="text-left">
                <p className="font-bold text-lg">Premium</p>
                <p className="text-white/70 text-sm">Quality Build</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-secondary" />
              <div className="text-left">
                <p className="font-bold text-lg">1,500+</p>
                <p className="text-white/70 text-sm">Happy Families</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PenTool className="w-8 h-8 text-brand-secondary" />
              <div className="text-left">
                <p className="font-bold text-lg">Board-Certified</p>
                <p className="text-white/70 text-sm">Architects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section id="properties" className="py-24 bg-brand-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold mb-4">The Curated Collections</h2>
            <p className="text-brand-text/70 max-w-2xl mx-auto text-lg">Explore our meticulously designed property variants, tailored for every stage of your life journey.</p>
          </div>

          <div className="space-y-20">
            {/* Starter Collection */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-serif text-brand-primary">Starter Collection</h3>
                <div className="h-px bg-brand-accent/50 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {starterCollection.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>

            {/* Family Collection */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-serif text-brand-primary">Family Collection</h3>
                <div className="h-px bg-brand-accent/50 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {familyCollection.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>

            {/* Signature Collection */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-serif text-brand-primary">Signature Collection</h3>
                <div className="h-px bg-brand-accent/50 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {signatureCollection.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Design Lab */}
      <section 
        id="styles" 
        className="py-24 relative transition-colors duration-1000 ease-in-out"
        style={{
          backgroundColor: activeStyle === 'minimalis' ? '#f0f4f8' :
                           activeStyle === 'tropis' ? '#f0f5ec' :
                           activeStyle === 'skandinavia' ? '#fdfdfd' :
                           activeStyle === 'industrial' ? '#e9ecef' : '#E8DCCB'
        }}
      >
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold mb-4">The Architecture Lab</h2>
            <p className="text-brand-text/70 max-w-2xl mx-auto text-lg">Choose an architectural aesthetic that resonates with your personal identity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {styles.map(style => (
              <StyleCard 
                key={style.id} 
                styleData={style} 
                onHover={setActiveStyle} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold mb-4">Why Choose Estate.Lab?</h2>
            <p className="text-brand-text/70 max-w-2xl mx-auto text-lg">We redefine the real estate experience through transparency, innovation, and unwavering quality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-brand-background rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-secondary/20 transition-colors">
                <CheckCircle className="w-10 h-10 text-brand-primary" />
              </div>
              <h4 className="text-2xl font-serif text-brand-primary mb-4">Transparent Pricing</h4>
              <p className="text-brand-text/70 leading-relaxed">No hidden fees, no surprise costs. We provide a comprehensive breakdown of all expenses from day one, ensuring absolute peace of mind.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-brand-background rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-secondary/20 transition-colors">
                <Shield className="w-10 h-10 text-brand-primary" />
              </div>
              <h4 className="text-2xl font-serif text-brand-primary mb-4">End-to-End Legal Assistance</h4>
              <p className="text-brand-text/70 leading-relaxed">Our in-house legal team manages all documentation, permits, and notarization, making the ownership transfer seamless and secure.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-brand-background rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-secondary/20 transition-colors">
                <Award className="w-10 h-10 text-brand-primary" />
              </div>
              <h4 className="text-2xl font-serif text-brand-primary mb-4">Smart Home Integration</h4>
              <p className="text-brand-text/70 leading-relaxed">Every Estate.Lab home comes pre-wired for the future, featuring baseline smart home security, lighting, and climate control readiness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <Quote className="w-12 h-12 text-brand-secondary mx-auto mb-6 opacity-50" />
            <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">Words from Our Homeowners</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative">
              <p className="text-lg text-white/90 leading-relaxed mb-6 italic">"Estate.Lab found us the perfect Tropical Modern home within our budget. The attention to detail in the Type 60 is extraordinary. We particularly love how the cross-ventilation keeps the house cool all day."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-secondary rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Client" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h5 className="font-bold text-white">Andi & Sarah</h5>
                  <p className="text-brand-secondary text-sm">Type 60 Owners, Jakarta</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative">
              <p className="text-lg text-white/90 leading-relaxed mb-6 italic">"The transparency during the purchasing process was refreshing. The legal team handled everything, and the Scandinavian design of our Type 45 makes it feel incredibly spacious and bright."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-secondary rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Client" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h5 className="font-bold text-white">Michelle T.</h5>
                  <p className="text-brand-secondary text-sm">Type 45 Owner, Bandung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
