import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';


export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <a href="#" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Estate.Lab Logo" className="w-10 h-10 object-contain rounded-md" />
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Estate.Lab
              </span>
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Engineered for living. Designed for you. We build premium, architecturally significant homes for the modern family.
            </p>

          </div>
          
          <div>
            <h4 className="text-white font-serif text-xl mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="/#properties" className="hover:text-brand-secondary transition-colors">Properties</a></li>
              <li><a href="/#styles" className="hover:text-brand-secondary transition-colors">Styles</a></li>
              <li><a href="/#about" className="hover:text-brand-secondary transition-colors">About Us</a></li>
              <li><Link to="/legal" className="hover:text-brand-secondary transition-colors">Legal & Privacy</Link></li>
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
            {status === 'success' ? (
              <div className="bg-brand-secondary/20 border border-brand-secondary/50 rounded-md p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <p className="text-brand-secondary text-sm">Thank you for subscribing! We've sent a welcome email to your inbox.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="Your email address" 
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:border-brand-secondary transition-colors w-full disabled:opacity-50"
                />
                <Button variant="secondary" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subscribing...
                    </span>
                  ) : (
                    <>Subscribe <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            )}
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
