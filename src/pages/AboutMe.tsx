import { motion } from 'framer-motion';
import { Award, Shield, ArrowRight, Phone, Mail, Compass, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function AboutMe() {
  const credentials = [
    {
      icon: Award,
      title: "$40M+ Closed Volume",
      desc: "Represented high-net-worth clients and design-forward families across prime residential corridors."
    },
    {
      icon: Compass,
      title: "15+ Years In Advisory",
      desc: "Deep immersion in contemporary tropical, minimalist, and Scandinavian residential architecture."
    },
    {
      icon: Shield,
      title: "100% Client Discretion",
      desc: "Confidential negotiation and quiet off-market pocket listings shielded from public MLS listings."
    },
    {
      icon: Sparkles,
      title: "Architectural Vetting",
      desc: "Every listing is vetted for cross-ventilation, structural integrity, and long-term resale appreciation."
    }
  ];

  const milestones = [
    { year: "2010", title: "Architectural Foundations", desc: "Began career collaborating with renowned Southeast Asian architects and boutique real estate firms." },
    { year: "2015", title: "Private Client Group", desc: "Launched dedicated buyer representation advisory focusing on luxury custom residences." },
    { year: "2020", title: "Estate.Lab Advisory", desc: "Founded Estate.Lab to bridge architectural excellence with transparent, tech-forward real estate transactions." },
    { year: "Present", title: "Bespoke Portfolio", desc: "Advising an exclusive roster of private collectors, executives, and modern families across Indonesia." }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FDFCF7]">
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
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Sultan Isaac - Private Real Estate Advisor" 
                  className="w-full h-[460px] md:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#D4B483] font-semibold">Principal Advisor</span>
                  <h3 className="text-2xl font-serif font-bold">Sultan Isaac</h3>
                  <p className="text-xs text-white/80">Licensed Real Estate Broker & Architecture Specialist</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[210px]">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Advisory
                </div>
                <p className="text-xs text-gray-500">Currently managing private allocations & bespoke viewings</p>
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4B483]/20 text-[#856937] text-xs font-semibold mb-4">
              <span>Personal Advisory & Brokerage</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-primary font-bold leading-tight mb-6">
              "A home is the physical architecture of your peace, legacy, and ambition."
            </h1>

            <p className="text-base sm:text-lg text-brand-text/80 leading-relaxed mb-6 font-light">
              Welcome. I'm <strong className="font-semibold text-brand-primary">Sultan Isaac</strong>, a private real estate advisor and broker dedicated exclusively to curated architectural homes. 
              Over the past 15 years, I have helped discerning individuals, growing families, and selective investors navigate the complexities of acquiring properties where exceptional design meets flawless legal due diligence.
            </p>

            <p className="text-base sm:text-lg text-brand-text/80 leading-relaxed mb-8 font-light">
              Unlike traditional brokerage models focused on volume, my practice is intentionally boutique. I represent you as an independent fiduciary—filtering noise, curating only residences that meet strict architectural criteria, and unlocking off-market opportunities that never reach public listings.
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
            <span className="text-xs uppercase tracking-widest text-[#D4B483] font-semibold">Guiding Standards</span>
            <h2 className="text-white font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4">The Advisory Standards</h2>
            <p className="text-white/70 text-base sm:text-lg">
              Every representation is anchored in four uncompromising commitments to my clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {credentials.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 p-7 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4B483]/20 flex items-center justify-center text-[#D4B483] mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-serif text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Milestones */}
      <section className="py-24 container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#856937] font-semibold">Experience & Lineage</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary font-bold mt-2">15 Years in the Making</h2>
        </div>

        <div className="relative border-l-2 border-[#D4B483]/40 ml-4 sm:ml-8 md:ml-32 pl-6 sm:pl-10 space-y-12">
          {milestones.map((m, index) => (
            <div key={index} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-5 h-5 rounded-full bg-[#0F4C5C] border-4 border-[#D4B483] group-hover:scale-125 transition-transform"></div>
              <span className="text-sm font-bold text-[#856937] tracking-wider uppercase mb-1 block">{m.year}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mb-2">{m.title}</h3>
              <p className="text-brand-text/70 text-sm sm:text-base leading-relaxed max-w-2xl">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="container mx-auto px-4 md:px-8 mb-10">
        <div className="bg-[#0F4C5C] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Let's Discuss Your Ideal Living Space
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
              Whether you are looking to acquire a primary residence, explore off-market inventory, or request a private evaluation of your estate, my direct line is always open.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="rounded-xl px-8 font-semibold">
                  Get in Touch With Sultan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4B483]" />
                  <span>+62 811 2345 6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4B483]" />
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
