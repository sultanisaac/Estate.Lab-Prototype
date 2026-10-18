import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Award, Users, Star, ArrowRight, ChevronLeft, ChevronRight, Compass, Sparkles, Key } from 'lucide-react';

import { PropertyCard } from '../components/ui/PropertyCard';
import { StyleCard } from '../components/ui/StyleCard';
import { properties } from '../data/properties';
import { styles } from '../data/styles';

export function Home() {
  const navigate = useNavigate();
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isLowConnection, setIsLowConnection] = useState<boolean>(false);

  useEffect(() => {
    // Scroll to hash on mount or when hash changes
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [window.location.hash]);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      const checkConnection = () => {
        if (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
          setIsLowConnection(true);
        } else {
          setIsLowConnection(false);
        }
      };
      
      checkConnection();
      connection.addEventListener('change', checkConnection);
      
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);
  
  const [allProperties, setAllProperties] = useState<any[]>(properties);

  useEffect(() => {
    async function fetchLiveProperties() {
      try {
        const res = await fetch('/api/admin/properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllProperties(data);
            return;
          }
        }
      } catch (e) {
        // Fallback to local storage or bundled properties
      }

      const localData = localStorage.getItem('dev_properties');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllProperties(parsed);
          }
        } catch (e) {}
      }
    }
    fetchLiveProperties();
  }, []);

  const curatedList = allProperties.filter(p => p.isCurated === true);
  const curatedProperties = curatedList.length > 0 ? curatedList : allProperties.slice(0, 8);

  const testimonials = [
    {
      id: 1,
      name: 'Andi & Sarah',
      role: 'Type 60 Owners, Jakarta',
      rating: 5,
      text: "Found the perfect Tropical Modern home within our budget. The Type 60's cross-ventilation keeps it cool all day!",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 2,
      name: 'Michelle T.',
      role: 'Type 45 Owner, Bandung',
      rating: 5,
      text: "Amazing transparency and the legal team handled everything. Our Type 45 feels incredibly spacious and bright.",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 3,
      name: 'Budi & Clara',
      role: 'Type 50 Owners, Surabaya',
      rating: 5,
      text: "Estate.Lab made buying our first home easy. The Industrial unit is stunning and smart features are a game changer!",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 4,
      name: 'Diana R.',
      role: 'Type 90 Owner, Bali',
      rating: 5,
      text: "Upgraded to the Minimalist Collection. The architecture maximizes light beautifully—they truly understand modern living.",
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 5,
      name: 'Reza Pratama',
      role: 'Type 21 Owner, South Jakarta',
      rating: 5,
      text: "As a young tech professional, Type 21 is the ultimate studio. Compact, high ceilings, and zero wasted square meters.",
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 6,
      name: 'Hendro & Maya',
      role: 'Type 72 Owners, Tangerang',
      rating: 5,
      text: "The indoor garden and double-height ceiling make our family gatherings feel like a luxury resort stay.",
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 7,
      name: 'Clarissa W.',
      role: 'Type 36 Owner, Yogyakarta',
      rating: 5,
      text: "From 3D blueprint walkthroughs to key handover, everything was delivered exactly on schedule with immaculate finishing.",
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 8,
      name: 'Kevin S.',
      role: 'Type 80 Owner, Medan',
      rating: 5,
      text: "The raw brick and black steel industrial aesthetics get compliments from every guest. Truly standout architecture.",
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 9,
      name: 'dr. Farhan & Aisyah',
      role: 'Type 85 Owners, Semarang',
      rating: 5,
      text: "We opted for the custom pool layout. The seamless indoor-outdoor transition gives us a sanctuary after long hospital shifts.",
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    }
  ];

  // Auto-scroll logic for The Curated Collections
  const curatedSectionRef = useRef<HTMLElement>(null);
  const curatedScrollRef = useRef<HTMLDivElement>(null);
  const [isCuratedInView, setIsCuratedInView] = useState(false);
  const [isCuratedHovered, setIsCuratedHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCuratedInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (curatedSectionRef.current) {
      observer.observe(curatedSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isCuratedInView || isCuratedHovered) return;

    const interval = setInterval(() => {
      if (curatedScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = curatedScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          curatedScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          curatedScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isCuratedInView, isCuratedHovered]);

  const scrollCurated = (direction: 'left' | 'right') => {
    if (curatedScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      curatedScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Auto-scroll logic for Testimonials
  const testimonialSectionRef = useRef<HTMLElement>(null);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const [isTestimonialInView, setIsTestimonialInView] = useState(false);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTestimonialInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (testimonialSectionRef.current) {
      observer.observe(testimonialSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isTestimonialInView || isTestimonialHovered) return;

    const interval = setInterval(() => {
      if (testimonialScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = testimonialScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          testimonialScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testimonialScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTestimonialInView, isTestimonialHovered]);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (testimonialScrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      testimonialScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {isLowConnection ? (
            <img 
              src="/hero-image.png" 
              alt="Estate.Lab Hero" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              poster="/hero-image.png"
              className="w-full h-full object-cover"
            >
              <source src="/hero-video.mp4.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D4B483]/40 text-[#D4B483] text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <span>Private Real Estate Brokerage & Advisory</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 tracking-tight drop-shadow-md max-w-5xl mx-auto leading-tight"
          >
            Sultan Isaac
            <span className="block text-2xl sm:text-3xl md:text-4xl font-light text-[#D4B483] mt-2 font-sans tracking-normal">
              Curator of Architectural Residences & Private Estates
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow font-light leading-relaxed"
          >
            Guiding discerning individuals and families through vetted architectural residences, off-market opportunities, and discreet acquisitions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => {
                navigate('/contact');
                window.scrollTo(0, 0);
              }}
              className="px-8 py-4 bg-[#D4B483] hover:bg-[#c29f6b] text-[#0F4C5C] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2"
            >
              <span>Book Private Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#properties"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-semibold rounded-xl transition-all duration-300 text-base"
            >
              Explore Curated Portfolio
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-brand-primary text-white py-8 border-b-4 border-brand-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center text-center">
            <div className="flex items-center justify-center gap-3">
              <Award className="w-7 h-7 text-brand-secondary shrink-0" />
              <div className="text-left">
                <p className="font-bold text-base sm:text-lg">15+ Years</p>
                <p className="text-white/70 text-xs sm:text-sm">Private Advisory</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Compass className="w-7 h-7 text-brand-secondary shrink-0" />
              <div className="text-left">
                <p className="font-bold text-base sm:text-lg">$40M+ Volume</p>
                <p className="text-white/70 text-xs sm:text-sm">Closed Transactions</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Users className="w-7 h-7 text-brand-secondary shrink-0" />
              <div className="text-left">
                <p className="font-bold text-base sm:text-lg">98% Retention</p>
                <p className="text-white/70 text-xs sm:text-sm">Client Referrals</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Shield className="w-7 h-7 text-brand-secondary shrink-0" />
              <div className="text-left">
                <p className="font-bold text-base sm:text-lg">100% Discretion</p>
                <p className="text-white/70 text-xs sm:text-sm">Fiduciary Privacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Advisor Section */}
      <section className="py-20 sm:py-24 bg-[#FDFCF7] border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Advisor Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                    alt="Sultan Isaac - Private Real Estate Advisor"
                    className="w-full h-[400px] sm:h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-[#D4B483] font-semibold">Principal Broker</span>
                    <h4 className="text-2xl font-serif font-bold">Sultan Isaac</h4>
                    <p className="text-xs text-white/80">Estate.Lab Private Advisory</p>
                  </div>
                </div>

                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
                  <p className="text-[11px] uppercase tracking-wider text-[#856937] font-bold">Direct Access</p>
                  <p className="text-xs text-gray-700 font-medium mt-1">One client at a time, dedicated representation.</p>
                </div>
              </div>
            </div>

            {/* Advisor Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4B483]/20 text-[#856937] text-xs font-semibold">
                <Sparkles size={13} className="text-[#856937]" />
                <span>Meet Your Personal Advisor</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-primary font-bold leading-tight">
                Independent Representation. Architectural Rigor. Uncompromising Discretion.
              </h2>

              <p className="text-brand-text/80 text-base sm:text-lg leading-relaxed font-light">
                Acquiring an architecturally significant residence requires more than scrolling listings—it demands an advisor who understands structural integrity, light orientation, and unyielding privacy.
              </p>

              <p className="text-brand-text/80 text-base sm:text-lg leading-relaxed font-light">
                As your personal broker, I operate as an unbiased fiduciary. I pre-screen every residence against rigorous architectural standards, negotiate with precision, and unlock private off-market listings that never reach public eyes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    navigate('/about-me');
                    window.scrollTo(0, 0);
                  }}
                  className="px-6 py-3.5 bg-brand-primary hover:bg-[#135d70] text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>Read Biography & Track Record</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigate('/contact');
                    window.scrollTo(0, 0);
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-brand-primary rounded-xl font-semibold text-sm transition-all"
                >
                  Schedule Private Consultation
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section 
        id="properties" 
        ref={curatedSectionRef}
        className="py-24 bg-brand-background overflow-hidden relative"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4B483]/20 text-[#856937] text-xs font-semibold mb-3">
                <Star size={12} className="fill-[#D4B483] text-[#D4B483]" />
                <span>Broker's Handpicked Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold">The Curated Collections</h2>
              <p className="text-brand-text/70 max-w-2xl text-base md:text-lg mt-2">
                Hand-selected architectural residences meeting rigorous standards for light, spatial flow, and enduring value.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-text/50 hidden sm:inline-block">
                Scroll horizontally or drag to browse
              </span>
              <button 
                type="button"
                onClick={() => scrollCurated('left')}
                className="w-11 h-11 rounded-full border border-[#0F4C5C]/20 bg-white hover:bg-[#0F4C5C] text-[#0F4C5C] hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="Previous properties"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="button"
                onClick={() => scrollCurated('right')}
                className="w-11 h-11 rounded-full border border-[#0F4C5C]/20 bg-white hover:bg-[#0F4C5C] text-[#0F4C5C] hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="Next properties"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* 5 in a row Horizontal Scroll Carousel */}
          <div 
            ref={curatedScrollRef}
            onMouseEnter={() => setIsCuratedHovered(true)}
            onMouseLeave={() => setIsCuratedHovered(false)}
            onTouchStart={() => setIsCuratedHovered(true)}
            onTouchEnd={() => setIsCuratedHovered(false)}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth pb-6 pt-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {curatedProperties.map(property => (
              <div 
                key={property.id} 
                className="w-[calc(65%-12px)] sm:w-[calc(33.33%-14px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)] min-w-[240px] sm:min-w-[260px] lg:min-w-[270px] shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <button 
              onClick={() => {
                navigate('/properties');
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#0F4C5C] text-[#0F4C5C] font-semibold hover:bg-[#0F4C5C] hover:text-white transition-all duration-300 rounded-xl shadow-sm text-base group"
            >
              <span>View All Properties</span> 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Why Work With Me */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#856937] font-semibold mb-2 block">
              Bespoke Representation
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold mb-4">Why Work With Sultan Isaac?</h2>
            <p className="text-brand-text/70 text-base md:text-lg">
              Redefining luxury property acquisition through architectural expertise, independent fiduciary representation, and absolute confidentiality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-brand-background/60 p-8 rounded-2xl border border-gray-100 hover:border-[#D4B483]/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-[#0F4C5C] group-hover:text-white transition-all text-[#0F4C5C]">
                <Shield className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-serif text-brand-primary font-bold mb-3">Unbiased Buyer Advocacy</h4>
              <p className="text-brand-text/70 text-sm leading-relaxed">
                Operating with independent fiduciary integrity. Zero developer quotas, transparent pricing, and relentless negotiation on your behalf.
              </p>
            </div>
            
            <div className="bg-brand-background/60 p-8 rounded-2xl border border-gray-100 hover:border-[#D4B483]/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-[#0F4C5C] group-hover:text-white transition-all text-[#0F4C5C]">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-serif text-brand-primary font-bold mb-3">Architectural Due Diligence</h4>
              <p className="text-brand-text/70 text-sm leading-relaxed">
                Every residence undergoes rigorous screening—verifying cross-ventilation, natural illumination, material grade, and enduring resale appeal.
              </p>
            </div>
            
            <div className="bg-brand-background/60 p-8 rounded-2xl border border-gray-100 hover:border-[#D4B483]/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-[#0F4C5C] group-hover:text-white transition-all text-[#0F4C5C]">
                <Key className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-serif text-brand-primary font-bold mb-3">Off-Market Pocket Access</h4>
              <p className="text-brand-text/70 text-sm leading-relaxed">
                Gain discreet access to private listings, estate sales, and pre-launch architectural allocations shielded from public portals.
              </p>
            </div>

            <div className="bg-brand-background/60 p-8 rounded-2xl border border-gray-100 hover:border-[#D4B483]/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-[#0F4C5C] group-hover:text-white transition-all text-[#0F4C5C]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-serif text-brand-primary font-bold mb-3">White-Glove Discretion</h4>
              <p className="text-brand-text/70 text-sm leading-relaxed">
                From strict non-disclosure protections to complete notary, legal, and escrow management, every deal is handled seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialSectionRef}
        className="py-24 bg-brand-primary text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-secondary text-xs font-semibold mb-3">
                <Star size={12} className="fill-brand-secondary text-brand-secondary" />
                <span>Private Client Endorsements</span>
              </div>
              <h2 className="text-4xl md:text-5xl text-white font-bold">Words from Discerning Homeowners</h2>
              <p className="text-white/70 max-w-2xl text-base md:text-lg mt-2">
                Real experiences from executives, architects, and modern families who entrusted their acquisition to Sultan Isaac.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => scrollTestimonials('left')}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/10 hover:bg-[#D4B483] text-white hover:text-[#0F4C5C] flex items-center justify-center transition-all shadow-sm"
                title="Previous reviews"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="button"
                onClick={() => scrollTestimonials('right')}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/10 hover:bg-[#D4B483] text-white hover:text-[#0F4C5C] flex items-center justify-center transition-all shadow-sm"
                title="Next reviews"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Compact Testimonials Horizontal Scroll Carousel */}
          <div 
            ref={testimonialScrollRef}
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
            onTouchStart={() => setIsTestimonialHovered(true)}
            onTouchEnd={() => setIsTestimonialHovered(false)}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth pb-6 pt-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonials.map((t) => (
              <div 
                key={t.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl relative flex flex-col justify-between w-[270px] sm:w-[310px] md:w-[330px] shrink-0 hover:bg-white/10 transition-colors shadow-lg"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-secondary text-brand-secondary" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-4 italic line-clamp-4">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/10 mt-auto">
                  <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full overflow-hidden border border-brand-secondary/30">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-white text-xs md:text-sm truncate">{t.name}</h5>
                    <p className="text-brand-secondary text-[11px] md:text-xs truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
