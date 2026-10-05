import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { db } from '../services/dbStore';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = db.getReviews().filter(r => r.isApproved).slice(0, 3);

  return (
    <section className="py-16 bg-surface-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf mb-2">
            Real Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-display">
            Loved at Pakistani Dining Tables
          </h2>
          <p className="text-sm text-brand-muted mt-2">
            Hear directly from moms, chefs, and foodies who make Mr. Frozen their everyday frozen essential.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="p-6 rounded-2xl bg-surface-white border border-brand-main/70 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <h4 className="text-base font-bold text-brand-dark">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-brand-muted leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 mt-4 border-t border-brand-main/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                    <span>{rev.customerName}</span>
                    {rev.isVerifiedBuyer && (
                      <CheckCircle className="w-3.5 h-3.5 text-brand-leaf" />
                    )}
                  </div>
                  <div className="text-[11px] text-brand-leaf font-medium mt-0.5">
                    Purchased: {rev.productName}
                  </div>
                </div>

                <Quote className="w-6 h-6 text-brand-main/40 shrink-0" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
