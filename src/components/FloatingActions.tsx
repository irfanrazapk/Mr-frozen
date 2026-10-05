import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const FloatingActions: React.FC = () => {
  const { siteSettings } = useShop();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Mr.%20Frozen!%20I%20have%20an%20inquiry%20regarding%20an%20order.`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-white text-brand-dark shadow-lg border border-brand-main/80 hover:bg-brand-light transition-all cursor-pointer hover:scale-105"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 text-brand-primary" />
        </button>
      )}

      {/* Floating WhatsApp Chat Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center p-3.5 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="hidden sm:group-hover:block absolute right-14 whitespace-nowrap bg-brand-dark text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-md">
          Chat with Mr. Frozen on WhatsApp
        </span>
      </a>
    </div>
  );
};
