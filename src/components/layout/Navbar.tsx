import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={clsx(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      (isScrolled || !isHomePage) ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Estate.Lab Logo" className="w-10 h-10 object-contain rounded-md shadow-sm" />
          <div className="flex flex-col">
            <span className={clsx(
              "font-serif font-bold text-xl sm:text-2xl tracking-tight transition-colors leading-none",
              (isScrolled || !isHomePage) ? "text-brand-primary" : "text-white"
            )}>
              Sultan Isaac
            </span>
            <span className={clsx(
              "text-[10px] uppercase tracking-widest font-medium mt-0.5",
              (isScrolled || !isHomePage) ? "text-brand-secondary" : "text-[#D4B483]"
            )}>
              Estate.Lab Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className={clsx(
            "flex gap-7 text-sm font-medium transition-colors",
            (isScrolled || !isHomePage) ? "text-brand-text" : "text-white/90"
          )}>
            <Link to="/properties" className="hover:text-brand-secondary transition-colors">Properties</Link>
            <Link to="/about-me" className="hover:text-brand-secondary transition-colors">About Me</Link>
            <Link to="/contact" className="hover:text-brand-secondary transition-colors">Contact</Link>
          </div>
          <Link to="/contact">
            <Button variant={(isScrolled || !isHomePage) ? "primary" : "secondary"} className="rounded-xl px-5">
              Book Consultation
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className={clsx("w-6 h-6", !(isScrolled || !isHomePage) && "text-white")} />}
        </button>
      </div>

      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white flex flex-col px-4 py-6"
          >
            <div className="flex justify-between items-center">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <img src="/logo.png" alt="Estate.Lab Logo" className="w-10 h-10 object-contain rounded-md shadow-sm" />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-2xl tracking-tight text-brand-primary leading-none">
                    Sultan Isaac
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-medium mt-0.5">
                    Estate.Lab Advisory
                  </span>
                </div>
              </Link>
              <button 
                className="text-brand-primary p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 mt-20 px-4">
              <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-3xl hover:text-brand-secondary transition-colors">Properties</Link>
              <Link to="/about-me" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-3xl hover:text-brand-secondary transition-colors">About Me</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-3xl hover:text-brand-secondary transition-colors">Contact</Link>
            </div>
            
            <div className="mt-auto px-4 pb-6 flex flex-col gap-4">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="lg" className="w-full text-base py-4 rounded-xl">Book Consultation</Button>
              </Link>
              <p className="text-brand-text/50 text-xs text-center">&copy; {new Date().getFullYear()} Sultan Isaac • Estate.Lab Advisory.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
