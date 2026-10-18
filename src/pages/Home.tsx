import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Award, Users, PenTool, CheckCircle, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
                <span>Featured Spotlight</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold">The Curated Collections</h2>
              <p className="text-brand-text/70 max-w-2xl text-base md:text-lg mt-2">
                Explore our meticulously designed property variants, tailored for every stage of your life journey.
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
                <span>Verified Homeowners</span>
              </div>
              <h2 className="text-4xl md:text-5xl text-white font-bold">Words from Our Homeowners</h2>
              <p className="text-white/70 max-w-2xl text-base md:text-lg mt-2">
                Real stories from families and professionals who found their dream architectural home.
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
