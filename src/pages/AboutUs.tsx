import { motion } from 'framer-motion';
import { ArrowRight, Award, Shield, Users, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function AboutUs() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 mb-20 pt-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl text-brand-primary mb-6"
          >
            Engineered for <span className="text-brand-secondary">Living</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-brand-text/70 leading-relaxed mb-10"
          >
            Estate.Lab isn't just about finding a place to live; it's about curating a lifestyle. We build premium, architecturally significant homes for the modern family, bridging the gap between exceptional design and functional reality.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mt-12"
        >
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
            alt="Luxury Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-primary/20"></div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-brand-primary text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-white font-serif text-4xl mb-6">Our Philosophy</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                We believe that space shapes behavior. A well-designed home doesn't just look beautiful, it enhances your daily life, reduces friction, and inspires you to live better.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Every Estate.Lab property is a testament to this belief. We obsess over light, flow, materials, and how spaces transition into one another, ensuring that our homes are as intelligent as they are breathtaking.
              </p>
              <Link to="/properties">
                <Button variant="secondary" className="group">
                  View Properties 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Award, title: "Excellence", desc: "Award-winning architectural design." },
                { icon: Shield, title: "Integrity", desc: "Transparent processes from start to finish." },
                { icon: Users, title: "Community", desc: "Building spaces that bring people together." },
                { icon: Building2, title: "Innovation", desc: "Smart homes ready for the future." },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <item.icon className="w-8 h-8 text-brand-secondary mb-4" />
                  <h3 className="text-white font-serif text-xl mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-primary mb-4">Visit Our Office</h2>
            <p className="text-brand-text/70 text-lg">Come discuss your future home with our team of experts.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Address Details */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-serif text-2xl text-brand-primary mb-8">Estate.Lab Headquarters</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-secondary/10 p-3 rounded-full shrink-0">
                    <MapPin className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-primary mb-1">Address</h4>
                    <p className="text-brand-text/70">Jl. Sudirman No. 45, Jakarta Selatan,<br/>DKI Jakarta 12190</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-brand-secondary/10 p-3 rounded-full shrink-0">
                    <Phone className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-primary mb-1">Phone</h4>
                    <p className="text-brand-text/70">+62 811 2345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-secondary/10 p-3 rounded-full shrink-0">
                    <Mail className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-primary mb-1">Email</h4>
                    <p className="text-brand-text/70">hello@estatelab.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-full min-h-[400px] bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner">
              <iframe
                title="Estate.Lab Office Location"
                src="https://www.google.com/maps?q=Jl.+Sudirman+No.+45,+Jakarta+Selatan,+DKI+Jakarta+12190&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
