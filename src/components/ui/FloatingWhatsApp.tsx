import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  // Broker WhatsApp contact details
  const phoneNumber = '6281123456789';
  const defaultMessage = encodeURIComponent(
    'Hello Sultan, I am interested in private real estate advisory and would like to learn more about your curated properties.'
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-brand-accent/50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-brand-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160"
                    alt="Sultan Isaac"
                    className="w-11 h-11 rounded-full object-cover border-2 border-brand-secondary"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight text-white">Sultan Isaac</h4>
                  <p className="text-[11px] text-brand-secondary font-medium">Private Real Estate Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close chat bubble"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-brand-background text-xs text-brand-text space-y-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-brand-accent/40 leading-relaxed">
                <p className="font-medium text-brand-primary mb-1">Hi there! 👋</p>
                <p className="text-brand-text/80">
                  I'm Sultan Isaac. How can I assist you with your luxury property search or architectural consultation today?
                </p>
                <span className="text-[10px] text-brand-text/40 block text-right mt-1">Just now</span>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-3 bg-white border-t border-brand-accent/30">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.49 1.199.534 1.286.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.182-.076.355.101.173.449.741.963 1.199.662.589 1.22.771 1.393.858.173.087.274.072.375-.043.101-.116.433-.505.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1.825z" />
                </svg>
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-3 bg-brand-primary hover:bg-[#135d70] text-white px-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-brand-secondary"
        aria-label="Direct message Sultan Isaac"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.49 1.199.534 1.286.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.182-.076.355.101.173.449.741.963 1.199.662.589 1.22.771 1.393.858.173.087.274.072.375-.043.101-.116.433-.505.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1.825z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
            Chat with Sultan
          </span>
        </div>
      </button>
    </div>
  );
}
