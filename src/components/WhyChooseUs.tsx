import React from 'react';
import { 
  Sparkles, 
  Snowflake, 
  ShieldCheck, 
  Dumbbell, 
  UtensilsCrossed, 
  Leaf 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: '100% Natural Ingredients',
      description: 'Pure whole boneless chicken breast and lean beef, fresh mint, coriander, and hand-selected spices. No meat-paste or cheap fillers.'
    },
    {
      icon: Dumbbell,
      title: 'High Protein Nutrition',
      description: 'Packed with real lean protein to fuel your active family lifestyle, school lunches, and wholesome evening dinners.'
    },
    {
      icon: Snowflake,
      title: 'Keep Frozen at -18°C',
      description: 'State-of-the-art IQF (Individual Quick Freezing) locks in tender juiciness and nutrients naturally without synthetic additives.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Artificial Preservatives',
      description: 'No MSG, no artificial food colorings, and zero chemical preservatives. Exactly the recipe you would prepare at home.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Ready in Minutes',
      description: 'Straight from your freezer into the air fryer, pan, or oven. Golden, sizzling hot snacks ready in 4 to 8 minutes.'
    },
    {
      icon: Sparkles,
      title: 'Safe Cold-Chain Delivery',
      description: 'Dispatched in thermal insulated boxes with cold packs to guarantee the food reaches your kitchen rock-frozen.'
    }
  ];

  return (
    <section className="py-16 bg-brand-light/30 border-y border-brand-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf mb-2">
            The Mr. Frozen Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display">
            Why Pakistani Families Trust Mr. Frozen
          </h2>
          <p className="text-sm text-brand-muted mt-2">
            We believe good food starts with honest ingredients. No shortcuts, no fillers — just authentic home-style flavors frozen at peak freshness.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-surface-white border border-brand-main/70 shadow-xs hover:border-brand-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-4 text-brand-primary">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-base font-bold text-brand-dark mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
