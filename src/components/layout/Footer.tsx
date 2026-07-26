import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-secondary rounded-sm flex items-center justify-center">
                <span className="text-gray-900 font-serif font-bold text-xl leading-none">E</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Estate.Lab
              </span>
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Engineered for living. Designed for you. We build premium, architecturally significant homes for the modern family.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-secondary hover:text-gray-900 transition-colors font-medium text-sm">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-secondary hover:text-gray-900 transition-colors font-medium text-sm">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-secondary hover:text-gray-900 transition-colors font-medium text-sm">
                X
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-xl mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#properties" className="hover:text-brand-secondary transition-colors">The Collections</a></li>
              <li><a href="#styles" className="hover:text-brand-secondary transition-colors">Architecture Lab</a></li>
              <li><a href="#about" className="hover:text-brand-secondary transition-colors">Why Estate.Lab</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Legal & Privacy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-xl mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 45, Jakarta Selatan,<br/>DKI Jakarta 12190</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-secondary shrink-0" />
                <span>+62 811 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-secondary shrink-0" />
                <span>hello@estatelab.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-xl mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to receive updates on new property launches and exclusive offers.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:border-brand-secondary transition-colors w-full"
              />
              <Button variant="secondary" className="w-full">
                Subscribe <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Estate.Lab. All rights reserved.</p>
          <p>Designed with luxury in mind.</p>
        </div>
      </div>
    </footer>
  );
}
