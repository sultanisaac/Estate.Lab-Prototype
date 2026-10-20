import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getWebsiteContent, type AboutMeData } from '../data/websiteContent';

const CONSULTATION_TYPES: Record<string, string> = {
  buying: 'Acquiring a Curated Home',
  offmarket: 'Private Off-Market Inquiries',
  selling: 'Listing / Selling an Estate',
  advisory: 'General Architecture Advisory',
};

const MEETING_FORMATS: Record<string, string> = {
  'in-person': 'Private Lounge Meeting (Sudirman)',
  virtual: 'Virtual Video Call (Zoom / Google Meet)',
  onsite: 'On-Site Property Viewing',
};

export function Contact() {
  const [aboutMe, setAboutMe] = useState<AboutMeData>(() => getWebsiteContent().aboutMe);

  useEffect(() => {
    const handleUpdate = () => {
      setAboutMe(getWebsiteContent().aboutMe);
    };
    window.addEventListener('website_content_updated', handleUpdate);
    return () => window.removeEventListener('website_content_updated', handleUpdate);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: 'buying',
    meetingFormat: 'in-person',
    preferredTime: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string>('');

  const advisorFirstName = (aboutMe.name || 'Sultan').trim().split(' ')[0];

  const quickWhatsappUrl = `https://wa.me/6281123456789?text=${encodeURIComponent(
    `Hello ${advisorFirstName}, I would like to schedule a private real estate consultation.`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const interestLabel = CONSULTATION_TYPES[formData.consultationType] || formData.consultationType;
    const formatLabel = MEETING_FORMATS[formData.meetingFormat] || formData.meetingFormat;

    const messageLines = [
      `*New Private Consultation Request - Estate.Lab*`,
      ``,
      `👤 *Full Name:* ${formData.name}`,
      `📧 *Email:* ${formData.email}`,
      `📱 *Phone / WhatsApp:* ${formData.phone}`,
      `🎯 *Area of Interest:* ${interestLabel}`,
      `🤝 *Meeting Preference:* ${formatLabel}`,
      formData.preferredTime ? `📅 *Preferred Date/Time:* ${formData.preferredTime}` : null,
      formData.message ? `📝 *Specific Requirements / Notes:*\n${formData.message}` : null,
      ``,
      `_Sent via Estate.Lab Private Advisory Portal_`
    ].filter(Boolean);

    const fullWhatsappUrl = `https://wa.me/6281123456789?text=${encodeURIComponent(messageLines.join('\n'))}`;
    setSubmittedWhatsappUrl(fullWhatsappUrl);

    // Automatically trigger WhatsApp in a new tab/window
    window.open(fullWhatsappUrl, '_blank', 'noopener,noreferrer');

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-background">
      {/* Hero Header */}
      <section className="container mx-auto px-4 md:px-8 pt-10 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/20 text-brand-primary text-xs font-semibold mb-4 border border-brand-secondary/30"
          >
            <span>Direct Client Access</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-primary font-bold mb-6"
          >
            Private Consultation with {aboutMe.name || 'Sultan Isaac'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-brand-text/75 leading-relaxed max-w-2xl mx-auto"
          >
            Connect directly with your advisor for confidential buyer representation, private viewings, or off-market property inquiries.
          </motion.p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contact Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick WhatsApp Card */}
            <div className="bg-brand-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/15 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={aboutMe.portraitUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                  alt={aboutMe.name || 'Sultan Isaac'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-secondary shrink-0 shadow-md"
                />
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-bold text-white truncate">{aboutMe.name || 'Sultan Isaac'}</h3>
                  <p className="text-xs text-brand-secondary uppercase tracking-wider font-semibold truncate">{aboutMe.roleTag || 'Private Broker'}</p>
                  <p className="text-xs text-white/70 mt-0.5">Average reply time: &lt; 15 mins</p>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Prefer immediate messaging? Reach out directly via WhatsApp for swift response on available inventory and viewing slots.
              </p>

              <a
                href={quickWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Message {advisorFirstName} on WhatsApp</span>
              </a>
            </div>

            {/* Direct Channels Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-accent/50 space-y-6">
              <h4 className="font-serif text-xl font-bold text-brand-primary">Direct Channels</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center shrink-0 text-brand-secondary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-text/50 uppercase font-semibold">Direct Telephone</p>
                    <a href="tel:+6281123456789" className="text-brand-primary font-medium hover:text-brand-secondary transition-colors">
                      +62 811 2345 6789
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center shrink-0 text-brand-secondary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-text/50 uppercase font-semibold">Confidential Email</p>
                    <a href="mailto:sultan@estatelab.com" className="text-brand-primary font-medium hover:text-brand-secondary transition-colors">
                      sultan@estatelab.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center shrink-0 text-brand-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-text/50 uppercase font-semibold">Private Advisory Lounge</p>
                    <p className="text-brand-text/80 text-sm">
                      Jl. Sudirman No. 45, Jakarta Selatan,<br />DKI Jakarta 12190
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center shrink-0 text-brand-secondary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-text/50 uppercase font-semibold">Consultation Hours</p>
                    <p className="text-brand-text/80 text-sm">
                      Monday – Saturday: 09:00 – 19:00 WIB<br />Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-accent/40 flex items-center gap-3 text-xs text-brand-text/70">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                <span>All discussions and property inquiries are protected under non-disclosure confidentiality.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Private Consultation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-brand-accent/50">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mb-2">
                Request a Private Consultation
              </h3>
              <p className="text-brand-text/70 text-sm mb-8">
                Please complete the form below. {aboutMe.name || 'Sultan Isaac'} will personally review your preferences and get in touch within 24 hours.
              </p>

              {submitted ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <MessageCircle className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-brand-primary">Consultation Details Ready</h4>
                    <p className="text-brand-text/70 max-w-md mx-auto text-sm leading-relaxed mt-2">
                      Thank you, <strong className="text-brand-primary">{formData.name}</strong>. Your consultation details have been compiled and sent to WhatsApp for <strong className="text-brand-primary">{aboutMe.name || 'Sultan Isaac'}</strong>.
                    </p>
                  </div>

                  {submittedWhatsappUrl && (
                    <div className="pt-2">
                      <a
                        href={submittedWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span>Send via WhatsApp Directly</span>
                      </a>
                      <p className="text-xs text-brand-text/50 mt-2">
                        Click above if WhatsApp did not open automatically in a new window.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-brand-accent/40">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          consultationType: 'buying',
                          meetingFormat: 'in-person',
                          preferredTime: '',
                          message: ''
                        });
                      }}
                      className="rounded-xl border-brand-primary text-brand-primary hover:bg-brand-primary/5 text-sm"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jonathan Pratama"
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. jonathan@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +62 812 3456 7890"
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Area of Interest
                      </label>
                      <select
                        value={formData.consultationType}
                        onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      >
                        <option value="buying">Acquiring a Curated Home</option>
                        <option value="offmarket">Private Off-Market Inquiries</option>
                        <option value="selling">Listing / Selling an Estate</option>
                        <option value="advisory">General Architecture Advisory</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Meeting Preference
                      </label>
                      <select
                        value={formData.meetingFormat}
                        onChange={(e) => setFormData({ ...formData, meetingFormat: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      >
                        <option value="in-person">Private Lounge Meeting (Sudirman)</option>
                        <option value="virtual">Virtual Video Call (Zoom / Google Meet)</option>
                        <option value="onsite">On-Site Property Viewing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                        Preferred Date / Time Window
                      </label>
                      <input
                        type="text"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        placeholder="e.g. Tuesday morning, next week"
                        className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-2">
                      Specific Requirements or Target Property
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share any preferences regarding budget, style (Tropical, Minimalist, Scandinavian, Industrial), or target location..."
                      className="w-full px-4 py-3 rounded-xl border border-brand-accent focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm bg-white transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-base font-semibold shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span>Opening WhatsApp...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span>Submit & Send via WhatsApp</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Map Embed Section */}
        <div className="mt-16 bg-white p-6 rounded-3xl shadow-sm border border-brand-accent/50">
          <div className="mb-4">
            <h4 className="font-serif text-lg font-bold text-brand-primary">Advisory Lounge Location</h4>
            <p className="text-xs text-brand-text/60">Jl. Sudirman No. 45, Jakarta Selatan (By appointment)</p>
          </div>
          <div className="h-[340px] rounded-2xl overflow-hidden shadow-inner bg-brand-background border border-brand-accent/30">
            <iframe
              title="Sultan Isaac Advisory Office"
              src="https://www.google.com/maps?q=Jl.+Sudirman+No.+45,+Jakarta+Selatan,+DKI+Jakarta+12190&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
