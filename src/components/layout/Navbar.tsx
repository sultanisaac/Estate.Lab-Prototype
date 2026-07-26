import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-sm flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl leading-none">E</span>
          </div>
          <span className={clsx(
            "font-serif font-bold text-2xl tracking-tight transition-colors",
            isScrolled ? "text-brand-primary" : "text-white"
          )}>
            Estate.Lab
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className={clsx(
            "flex gap-6 text-sm font-medium transition-colors",
            isScrolled ? "text-brand-text" : "text-white/90"
          )}>
            <a href="#properties" className="hover:text-brand-secondary transition-colors">Properties</a>
            <a href="#styles" className="hover:text-brand-secondary transition-colors">Styles</a>
            <a href="#about" className="hover:text-brand-secondary transition-colors">About Us</a>
            <a href="#contact" className="hover:text-brand-secondary transition-colors">Contact</a>
          </div>
          <Button variant={isScrolled ? "primary" : "secondary"}>Book Viewing</Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className={clsx("w-6 h-6", !isScrolled && "text-white")} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-brand-accent/20 py-4 px-4 flex flex-col gap-4">
          <a href="#properties" onClick={() => setMobileMenuOpen(false)} className="text-brand-text font-medium py-2">Properties</a>
          <a href="#styles" onClick={() => setMobileMenuOpen(false)} className="text-brand-text font-medium py-2">Styles</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-brand-text font-medium py-2">About Us</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-brand-text font-medium py-2">Contact</a>
          <Button variant="primary" className="w-full mt-2">Book Viewing</Button>
        </div>
      )}
    </nav>
  );
}
