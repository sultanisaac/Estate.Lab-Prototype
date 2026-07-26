import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function Legal() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-brand-accent/20"
        >
          <h1 className="font-serif text-4xl text-brand-primary mb-8 font-bold">Legal & Privacy Policy</h1>
          
          <div className="prose prose-brand max-w-none text-brand-text/80 space-y-8">
            <section>
              <h2 className="text-2xl font-serif text-brand-primary mb-4">1. Terms of Service</h2>
              <p>
                Welcome to Estate.Lab. By accessing and using our website and services, you agree to comply with and be bound by the following terms and conditions of use. Our services are provided "as is" and we reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-primary mb-4">2. Privacy Policy</h2>
              <p>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services or interact with our website.
              </p>
              <h3 className="text-xl font-serif text-brand-primary mt-6 mb-3">Information We Collect</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (name, email address, phone number) provided via our booking forms.</li>
                <li>Usage data and analytics to improve our website experience.</li>
                <li>Preferences regarding property types and styles.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-primary mb-4">3. Data Usage & Protection</h2>
              <p>
                We use the information we collect to communicate with you regarding your property inquiries, to schedule viewings, and to provide relevant updates about Estate.Lab. We implement appropriate technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. We do not sell or rent your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-primary mb-4">4. Cookie Policy</h2>
              <p>
                Our website uses cookies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you interact with our site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-primary mb-4">5. Contact Information</h2>
              <p>
                If you have any questions or concerns about our Legal & Privacy policies, please contact us at:
              </p>
              <p className="mt-2 font-medium text-brand-primary">
                Email: legal@estatelab.com<br />
                Phone: +62 (21) 555-0123
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
