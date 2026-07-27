import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';

export function Booking() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    date: '',
    time: '',
    propertyType: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Booking API Error]', response.status, errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to send booking');
      }

      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: '', lastName: '', email: '', whatsapp: '',
          date: '', time: '', propertyType: '', notes: ''
        });
      }, 3000);
    } catch (error) {
      console.error('[Booking API Error]', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="Doe" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">WhatsApp Number</label>
                  <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="+62 812..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Preferred Date & Time</label>
                <div className="grid grid-cols-2 gap-5">
                  <input required name="date" value={formData.date} onChange={handleChange} type="date" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" />
                  <input required name="time" value={formData.time} onChange={handleChange} type="time" className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Preferred Property Type</label>
                <select required name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow">
                  <option value="" disabled>Select a collection...</option>
                  <option value="starter">Starter Collection (Type 45 & 60)</option>
                  <option value="family">Family Collection (Type 70 & 80)</option>
                  <option value="signature">Signature Collection (Type 90 & 120)</option>
                  <option value="undecided">Not sure yet / General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Additional Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-brand-background border border-brand-accent/50 rounded-md px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow" placeholder="Tell us more about what you're looking for..."></textarea>
              </div>
              
              <Button size="lg" className="w-full mt-2" disabled={isSubmitting || isSuccess}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center text-green-300">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Booking Request Sent!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Confirm Booking <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
