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
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Estate.Lab Logo" className="w-10 h-10 object-contain rounded-md shadow-sm" />
          <span className={clsx(
            "font-serif font-bold text-2xl tracking-tight transition-colors",
            (isScrolled || !isHomePage) ? "text-brand-primary" : "text-white"
          )}>
            Estate.Lab
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className={clsx(
            "flex gap-6 text-sm font-medium transition-colors",
            (isScrolled || !isHomePage) ? "text-brand-text" : "text-white/90"
          )}>
            <a href="/#properties" className="hover:text-brand-secondary transition-colors">Properties</a>
            <a href="/#styles" className="hover:text-brand-secondary transition-colors">Styles</a>
            <a href="/#about" className="hover:text-brand-secondary transition-colors">About Us</a>
          </div>
          <Link to="/booking">
            <Button variant={(isScrolled || !isHomePage) ? "primary" : "secondary"}>Book Viewing</Button>
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
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="Estate.Lab Logo" className="w-10 h-10 object-contain rounded-md shadow-sm" />
                <span className="font-serif font-bold text-2xl tracking-tight text-brand-primary">
                  Estate.Lab
                </span>
              </Link>
              <button 
                className="text-brand-primary p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 mt-24 px-4">
              <a href="/#properties" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-4xl hover:text-brand-secondary transition-colors">Properties</a>
              <a href="/#styles" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-4xl hover:text-brand-secondary transition-colors">Styles</a>
              <a href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-brand-primary font-serif text-4xl hover:text-brand-secondary transition-colors">About Us</a>
            </div>
            
            <div className="mt-auto px-4 pb-6 flex flex-col gap-6">
              <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="lg" className="w-full text-lg py-4">Book Viewing</Button>
              </Link>
              <p className="text-brand-text/50 text-sm text-center">&copy; {new Date().getFullYear()} Estate.Lab. All rights reserved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
