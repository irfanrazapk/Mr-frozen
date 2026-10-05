import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Snowflake, 
  HeartHandshake, 
  Send 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, siteSettings, showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      showToast('Thank you for subscribing to Mr. Frozen freshness updates!', 'success');
      setEmail('');
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <footer className="bg-brand-primary text-white pt-16 pb-8 border-t border-brand-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Trust Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Snowflake className="w-5 h-5 text-brand-light" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Blast Frozen at -18°C</h4>
              <p className="text-xs text-white/70">Locks in natural juices & flavor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-light" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Halal Prime Cuts</h4>
              <p className="text-xs text-white/70">Zero fillers or artificial colors</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-brand-light" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Cold-Chain Delivery</h4>
              <p className="text-xs text-white/70">Insulated thermal food packs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-brand-light" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Good Food. Guaranteed.</h4>
              <p className="text-xs text-white/70">Loved by families across Pakistan</p>
            </div>
          </div>
        </div>

        {/* 4 Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-white text-brand-primary flex items-center justify-center font-extrabold text-lg">
                MF
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                MR. FROZEN
              </span>
            </div>
            <p className="text-xs font-semibold text-brand-leaf uppercase tracking-wider">
              GOOD FOOD • FROZEN FRESH
            </p>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Crafting premium ready-to-cook chicken and meat delicacies with pure natural ingredients. From freezer to pan in minutes without compromising on nutritional goodness or taste.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-light" />
                <span>Helpline: {siteSettings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-light" />
                <span>Email: {siteSettings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-light" />
                <span>Karachi, Lahore & Islamabad, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Col 3: Shop Categories */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold tracking-wide uppercase text-brand-light font-display">
              Categories & Deals
            </h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => setCurrentView('deals')}
                  className="text-amber-300 font-extrabold hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>🔥 Mega Deals (Save up to Rs. 701)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('kebabs'); setCurrentView('shop'); }}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Kababs Range (Shami & Seekh)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('nuggets'); setCurrentView('shop'); }}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Chicken Nuggets
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('tender-pops'); setCurrentView('shop'); }}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Tender Pops & Bites
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('parathas'); setCurrentView('shop'); }}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Crispy Layered Parathas
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('family-packs'); setCurrentView('shop'); }}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Family Saver Packs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold tracking-wide uppercase text-brand-light font-display">
              Customer Care
            </h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => setCurrentView('order-tracking')}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Track Your Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shipping-policy')}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Cold-Chain Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Cooking & Storage FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Wholesale & Food Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-brand-light transition-colors text-left"
                >
                  Quality Standards & Halal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold tracking-wide uppercase text-brand-light font-display">
              Stay Fresh
            </h5>
            <p className="text-xs text-white/80 leading-relaxed">
              Subscribe for exclusive Ramadan offers, new product launches, and seasonal discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-hidden focus:border-brand-light"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-brand-leaf hover:bg-brand-leaf-hover text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} MR. FROZEN (SMC-PVT) LTD. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Bank Transfer</span>
            <span>·</span>
            <span>JazzCash / EasyPaisa</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
