import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, ArrowRight, Phone, Mail, Compass, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { getWebsiteContent, type AboutMeData } from '../data/websiteContent';

export function AboutMe() {
  const [data, setData] = useState<AboutMeData>(() => getWebsiteContent().aboutMe);

  useEffect(() => {
    const handleUpdate = () => {
      setData(getWebsiteContent().aboutMe);
    };
    window.addEventListener('website_content_updated', handleUpdate);
    return () => window.removeEventListener('website_content_updated', handleUpdate);
  }, []);

  const standardIcons = [Award, Compass, Shield, Sparkles];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-background">
      {/* Editorial Hero */}
      <section className="container mx-auto px-4 md:px-8 mb-20 pt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img 
                  src={data.portraitUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'} 
                  alt={`${data.name} - ${data.title}`} 
                  className="w-full h-[460px] md:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-brand-secondary font-semibold">{data.roleTag}</span>
                  <h3 className="text-2xl font-serif font-bold text-white">{data.name}</h3>
                  <p className="text-xs text-white/80">{data.title}</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-5 rounded-2xl shadow-xl border border-brand-accent/50 max-w-[210px]">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-sm mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-pulse"></span>
                  {data.statusBadge.status}
                </div>
                <p className="text-xs text-brand-text/70">{data.statusBadge.subtext}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Philosophy */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/20 text-brand-primary text-xs font-semibold mb-4 border border-brand-secondary/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Personal Advisory & Brokerage</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-primary font-bold leading-tight mb-6">
              {data.headlineQuote}
            </h1>

            <p className="text-base sm:text-lg text-brand-text/80 leading-relaxed mb-6 font-light">
              {data.bio1}
            </p>

            <p className="text-base sm:text-lg text-brand-text/80 leading-relaxed mb-8 font-light">
              {data.bio2}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="rounded-xl px-8 shadow-md hover:shadow-lg">
                  Book Private Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" size="lg" className="rounded-xl px-7">
                  Explore Curated Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Advisory Pillars */}
      <section className="bg-brand-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-secondary font-semibold">Guiding Standards</span>
            <h2 className="text-white font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4">The Advisory Standards</h2>
            <p className="text-white/70 text-base sm:text-lg">
              Every representation is anchored in four uncompromising commitments to my clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {data.standards.map((item, idx) => {
              const IconComp = standardIcons[idx % standardIcons.length];
              return (
                <div 
                  key={item.id || idx}
                  className="bg-white/5 border border-white/10 p-7 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary mb-6 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-serif text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career Milestones */}
      <section className="py-24 container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-secondary font-bold tracking-wider">Experience & Lineage</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary font-bold mt-2">Career Milestones</h2>
        </div>

        <div className="relative border-l-2 border-brand-secondary/40 ml-4 sm:ml-8 md:ml-32 pl-6 sm:pl-10 space-y-12">
          {data.milestones.map((m, index) => (
            <div key={index} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-5 h-5 rounded-full bg-brand-primary border-4 border-brand-secondary group-hover:scale-125 transition-transform shadow-sm"></div>
              <span className="text-sm font-bold text-brand-primary tracking-wider uppercase mb-1 block">{m.year}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mb-2">{m.title}</h3>
              <p className="text-brand-text/70 text-sm sm:text-base leading-relaxed max-w-2xl">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="container mx-auto px-4 md:px-8 mb-10">
        <div className="bg-brand-primary rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 text-white">
              Let's Discuss Your Ideal Living Space
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
              Whether you are looking to acquire a primary residence, explore off-market inventory, or request a private evaluation of your estate, my direct line is always open.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="rounded-xl px-8 font-semibold shadow-md">
                  Get in Touch With Sultan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-6 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-secondary" />
                  <span>+62 811 2345 6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-secondary" />
                  <span>sultan@estatelab.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
