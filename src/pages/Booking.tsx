import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useEffect } from 'react';

export function Booking() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-24 bg-brand-background relative pt-32 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto">
          <div className="lg:w-5/12 relative h-64 lg:h-auto">
            <img 
              src="/booking-cover.png" 
              alt="Consultation" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-primary/40 mix-blend-multiply"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">Our Office</h3>
              <p className="opacity-90 mb-6">Jl. Sudirman No. 45, Jakarta Selatan 12190, Indonesia</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="font-bold">E</span>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Email Us</p>
                    <p className="font-medium">hello@estate.lab</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="font-bold">W</span>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">WhatsApp</p>
                    <p className="font-medium">+62 812 3456 7890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-7/12 p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-primary font-bold mb-4">Begin Your Journey Home</h2>
            <p className="text-brand-text/70 mb-8">Book a free consultation or schedule a private viewing of our show units with our property advisors. Please fill out the details below.</p>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">First Name</label>
                  <input type="text" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Last Name</label>
                  <input type="text" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="Doe" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Email Address</label>
                  <input type="email" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">WhatsApp Number</label>
                  <input type="tel" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="+62 812..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Preferred Date & Time</label>
                <div className="grid grid-cols-2 gap-5">
                  <input type="date" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" />
                  <input type="time" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Preferred Property Type</label>
                <select className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow">
                  <option value="">Select a collection...</option>
                  <option value="starter">Starter Collection (Type 45 & 60)</option>
                  <option value="family">Family Collection (Type 70 & 80)</option>
                  <option value="signature">Signature Collection (Type 90 & 120)</option>
                  <option value="undecided">Not sure yet / General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Additional Notes</label>
                <textarea rows={3} className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="Tell us more about what you're looking for..."></textarea>
              </div>
              
              <Button size="lg" className="w-full mt-2">
                Confirm Booking <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
