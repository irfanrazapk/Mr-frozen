import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { WishlistView } from './components/WishlistView';
import { AccountView } from './components/AccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutView, FAQView, ContactView } from './components/StaticPages';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { FloatingActions } from './components/FloatingActions';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, selectedProduct } = useShop();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-details':
        return selectedProduct ? (
          <ProductDetailsView
            product={selectedProduct}
            onBack={() => setCurrentView('shop')}
            onOpenCheckout={() => setCurrentView('checkout')}
          />
        ) : (
          <ShopView />
        );
      case 'cart':
        return <ShopView />;
      case 'checkout':
        return (
          <CheckoutView
            onBack={() => setCurrentView('shop')}
            onOrderSuccess={() => setCurrentView('order-success')}
          />
        );
      case 'order-success':
        return <OrderSuccessView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'wishlist':
        return <WishlistView />;
      case 'account':
        return <AccountView />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutView />;
      case 'faq':
      case 'shipping-policy':
        return <FAQView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-cream text-brand-dark selection:bg-brand-light selection:text-brand-primary">
      {/* Global Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Sign In & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Subtle Floating Actions (WhatsApp + Scroll to Top) */}
      <FloatingActions />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
