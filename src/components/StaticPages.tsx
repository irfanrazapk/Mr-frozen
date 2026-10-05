import React, { useState } from 'react';
import { 
  Snowflake, 
  ShieldCheck, 
  Truck, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Utensils 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { brandImages } from '../assets/images';

export const AboutView: React.FC = () => {
  return (
    <div className="py-12 bg-surface-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
            Good Food • Frozen Fresh
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display">
            The Story Behind Mr. Frozen
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            Founded with a singular commitment: to give Pakistani households authentic, nutritious, and wholesome ready-to-cook delicacies without synthetic preservatives or shortcuts.
          </p>
        </div>

        {/* Feature Image Frame */}
        <div className="rounded-3xl overflow-hidden border border-brand-main shadow-md">
          <img
            src={brandImages.heroBanner}
            alt="Mr. Frozen Kitchen Preparation"
            className="w-full h-72 sm:h-96 object-cover"
          />
        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-brand-primary" />
            <h3 className="text-base font-bold text-brand-dark">100% Halal Prime Meat</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We exclusively source prime chicken breast and lean beef from certified ethical farms. Every batch is inspected for quality and tenderness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
            <Snowflake className="w-8 h-8 text-brand-primary" />
            <h3 className="text-base font-bold text-brand-dark">Blast-Frozen Freshness</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Our advanced IQF shock-freezing system drops temperatures to -18°C in minutes, preserving moisture, natural proteins, and home-style aroma naturally.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
            <Utensils className="w-8 h-8 text-brand-primary" />
            <h3 className="text-base font-bold text-brand-dark">Heritage Family Recipes</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Our Shami and Seekh Kebabs are seasoned with whole roasted spices, fresh mint, coriander, and split pulses — just like an authentic Pakistani home kitchen.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const FAQView: React.FC = () => {
  const faqs = [
    {
      q: 'Do I need to thaw Mr. Frozen products before cooking?',
      a: 'No! All Mr. Frozen snacks and kebabs are designed to go directly from your freezer into the hot pan, air fryer, or deep fryer. Thawing may cause moisture loss or alter the crispy texture.'
    },
    {
      q: 'How does your cold-chain delivery work in Pakistan?',
      a: 'We pack all shipments in custom insulated thermal cartons lined with specialized sub-zero cooling gel packs. Even during hot summer months, our riders ensure your package reaches your doorstep completely frozen.'
    },
    {
      q: 'Are any artificial preservatives or MSG added?',
      a: 'Never. We uphold a strict zero-artificial-preservatives policy. We freeze our food rapidly at -18°C which acts as nature’s purest preservative.'
    },
    {
      q: 'What is the minimum order for free delivery?',
      a: 'Orders above PKR 2,500 qualify for 100% free cold-chain delivery across major cities including Karachi, Lahore, Islamabad, and Rawalpindi.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD), Direct Bank Transfer to our corporate Meezan Bank account, JazzCash/EasyPaisa mobile wallets, and Visa/Mastercard.'
    }
  ];

  return (
    <div className="py-12 bg-surface-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
            Got Questions?
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-brand-muted">
            Everything you need to know about our ingredients, storage, and insulated deliveries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-brand-main shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-brand-dark flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { siteSettings, showToast } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been received. Our sales team will get back to you shortly!', 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="py-12 bg-surface-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
            We are here to help
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark font-display">
            Contact Mr. Frozen
          </h1>
          <p className="text-xs text-brand-muted">
            For retail orders, wholesale inquiries, institutional catering, or corporate orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="md:col-span-5 bg-brand-primary text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <h3 className="text-lg font-bold font-display">Headquarters</h3>
              <p className="text-xs text-white/80 mt-1">Mr. Frozen Food Manufacturing (Pvt) Ltd</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-light" />
                <span>Helpline: {siteSettings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-light" />
                <span>Email: {siteSettings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-light" />
                <span>Plot 42, Sector 24, Korangi Industrial Area, Karachi</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <span className="text-[11px] text-white/70 block">WhatsApp Support:</span>
              <a 
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm font-bold text-brand-light underline hover:text-white"
              >
                Chat on WhatsApp (+92-300-1234567)
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-dark">Inquiry / Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirement or wholesale order..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold cursor-pointer transition-colors shadow-xs"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
