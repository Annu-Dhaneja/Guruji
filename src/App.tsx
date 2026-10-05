import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { CMSProvider, useCMS } from './context/CMSContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { RazorpayCheckoutModal } from './components/RazorpayCheckoutModal';
import { SalesAgentWidget } from './components/sales-agent/SalesAgentWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { GraphicDesignPage } from './pages/GraphicDesignPage';
import { GurujiArtworkPage } from './pages/GurujiArtworkPage';
import { VantageEcomPage } from './pages/VantageEcomPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { VantageInquiryPage } from './pages/VantageInquiryPage';
import { BookDesignPage } from './pages/BookDesignPage';
import { LearnAIPromptsPage } from './pages/LearnAIPromptsPage';
import { PhotoshopWorkflowStudioPage } from './pages/PhotoshopWorkflowStudioPage';
import { QuickServicesPage } from './pages/QuickServicesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BulkImageStudioPage } from './pages/BulkImageStudioPage';
import { DistinctGreySpotlight } from './components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from './components/ui/LuminousTopEdgeFlare';

const AppContent: React.FC = () => {
  const { loading, error } = useCMS();
  const { isCartOpen, setIsCartOpen } = useCart();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Synchronize hash routing for dynamic URLs like #/services/slug or #/inquiry/slug
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').replace(/^#\/?/, '');
      if (hash.startsWith('services/') || hash.startsWith('service/')) {
        const slug = hash.split('/')[1] || '';
        const graphicDesignCategorySlugs = [
          'social-media-design',
          'social-media',
          'logo-branding',
          'branding',
          'reels-video',
          'ecommerce-design',
          'ecommerce',
          'marketing-design',
          'marketing',
          'youtube-creator',
          'creator',
          'photo-editing',
          'print-design',
        ];

        if (slug === 'photoshop-studio' || slug === 'photoshop-ai' || slug === 'ai-studio') {
          setCurrentPage('photoshop-studio');
        } else if (slug === 'bulk-image-studio' || slug === 'image-studio' || slug === 'bulk-resizer') {
          setCurrentPage('bulk-image-studio');
        } else if (slug === 'learn-ai-prompts' || slug === 'ai-prompts') {
          setCurrentPage('learn-ai-prompts');
        } else if (slug === 'quick-services' || slug === 'quick-digital-services') {
          setCurrentPage('quick-services');
        } else if (slug === 'guruji-artwork' || slug === 'guruji' || slug === 'daily-blessings') {
          setCurrentPage('guruji-artwork');
        } else if (slug === 'wardrobe-planner' || slug === '7-day-wardrobe-planner') {
          setCurrentPage('home');
        } else if (graphicDesignCategorySlugs.includes(slug)) {
          setActiveServiceSlug(slug);
          setCurrentPage('graphic-design');
        } else if (slug) {
          setActiveServiceSlug(slug);
          setCurrentPage('service-detail');
        }
      } else if (hash.startsWith('product/') || hash.startsWith('products/')) {
        const prodSlug = hash.split('/')[1] || 'perfume';
        setActiveServiceSlug(prodSlug);
        setCurrentPage('product-detail');
      } else if (hash.startsWith('experts')) {
        setCurrentPage('guruji-artwork');
      } else if (hash.startsWith('prediction')) {
        setCurrentPage('guruji-artwork');
      } else if (hash.startsWith('inquiry')) {
        const queryParam = hash.includes('service=') ? hash.split('service=')[1]?.split('&')[0] : '';
        const pathSlug = hash.includes('/') ? hash.split('/')[1] : '';
        const selectedSlug = queryParam || pathSlug;
        if (selectedSlug) {
          setActiveServiceSlug(`inquiry-${selectedSlug}`);
          setCurrentPage('graphic-design');
        } else {
          setCurrentPage('inquiry');
        }
      } else if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeServiceSlug]);

  const handleNavigate = (page: string, slug?: string) => {
    if (page === 'product-detail' || page === 'product' || page.startsWith('product/')) {
      const prodSlug = slug || page.split('/')[1] || 'perfume';
      setActiveServiceSlug(prodSlug);
      window.location.hash = `/product/${prodSlug}`;
      setCurrentPage('product-detail');
    } else if (page === 'graphic-design' && slug) {
      setActiveServiceSlug(slug);
      window.location.hash = `/services/${slug}`;
      setCurrentPage('graphic-design');
    } else if (slug) {
      setActiveServiceSlug(slug);
      window.location.hash = `/services/${slug}`;
      setCurrentPage('service-detail');
    } else if (page.startsWith('services/') || page.startsWith('service/')) {
      const parts = page.split('/');
      setActiveServiceSlug(parts[1]);
      window.location.hash = `/${page}`;
      setCurrentPage('service-detail');
    } else {
      window.location.hash = `/${page}`;
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    if (currentPage === 'product-detail' || currentPage.startsWith('product/') || currentPage.startsWith('products/')) {
      const prodSlug = activeServiceSlug || currentPage.split('/')[1] || 'perfume';
      return (
        <ProductDetailPage
          slug={prodSlug}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPage === 'service-detail' || currentPage.startsWith('services/') || currentPage.startsWith('service/')) {
      const slug = activeServiceSlug || currentPage.split('/')[1] || '';
      return (
        <ServiceDetailPage
          slug={slug}
          onBack={() => handleNavigate('vantage-ecom')}
          onNavigateToService={(newSlug) => handleNavigate('service-detail', newSlug)}
        />
      );
    }

    if (currentPage === 'inquiry') {
      return (
        <VantageInquiryPage
          onBack={() => handleNavigate('vantage-ecom')}
          onNavigateToCatalog={() => handleNavigate('vantage-ecom')}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'quick-services':
      case 'quick-digital-services':
        return <QuickServicesPage onNavigate={handleNavigate} />;
      case 'graphic-design':
        return (
          <GraphicDesignPage
            onNavigate={handleNavigate}
            initialCategory={activeServiceSlug?.startsWith('inquiry-') ? undefined : activeServiceSlug}
            initialInquirySlug={activeServiceSlug?.startsWith('inquiry-') ? activeServiceSlug : undefined}
          />
        );
      case 'guruji-artwork':
        return <GurujiArtworkPage />;
      case 'vantage-ecom':
        return <VantageEcomPage />;
      case 'book-design':
        return <BookDesignPage />;
      case 'learn-ai-prompts':
        return <PhotoshopWorkflowStudioPage onNavigate={handleNavigate} initialTab="prompts" />;
      case 'photoshop-studio':
      case 'photoshop-ai':
      case 'ai-studio':
        return <PhotoshopWorkflowStudioPage onNavigate={handleNavigate} initialTab="all" />;
      case 'bulk-image-studio':
      case 'image-studio':
      case 'bulk-resizer':
      case 'tools/bulk-image-studio':
        return <BulkImageStudioPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactUsPage />;
      case 'dashboard':
        return <UserDashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0B1114] flex flex-col items-center justify-center p-6 text-center text-[#102A36] dark:text-[#F4F8F8] font-sans">
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-full border-2 border-[#DCE7E7] dark:border-[#2A3C40] border-t-[#0799A6] dark:border-t-[#25B4BD] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#0799A6] dark:text-[#25B4BD] animate-pulse" />
          </div>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8] mb-2">GurucraftPro</h1>
        <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] max-w-xs">Connecting to Firestore CMS...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0B1114] flex flex-col items-center justify-center p-6 text-center text-[#102A36] dark:text-[#F4F8F8] font-sans">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#102A36] dark:text-[#F4F8F8] mb-2">Firestore Connection Error</h1>
        <p className="text-sm text-red-500 dark:text-red-300 max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl btn-primary-cta font-bold text-sm transition-all shadow-xs"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0B1114] text-[#102A36] dark:text-[#F4F8F8] flex flex-col justify-between font-sans selection:bg-[#0799A6]/20 selection:text-[#087581] dark:selection:bg-[#25B4BD]/25 dark:selection:text-[#25B4BD] transition-colors duration-300">
      
      {/* Top Navigation */}
      <Navbar
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Dynamic View with Distinct Overhead Grey Spotlight (Theme-Aware: Dark vs Light) */}
      <main className="flex-1 pb-16 relative overflow-hidden bg-gradient-to-b from-[#E2E8F0] via-[#F1F5F9] to-[#FFFFFF] dark:from-[#162026] dark:via-[#0E1518] dark:to-[#0A0E10] text-[#102A36] dark:text-white transition-colors duration-500">
        {/* GLOBAL LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
        <LuminousTopEdgeFlare />

        {/* DISTINCT OVERHEAD SPOTLIGHT */}
        <DistinctGreySpotlight intensity="high" />

        <div className="relative z-10">
          {renderPage()}
        </div>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton phoneNumber="8527837527" />

      {/* Conversion-Focused AI Sales Assistant Widget */}
      <SalesAgentWidget
        onNavigate={handleNavigate}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Cart Drawer Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Auth Sign In / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Razorpay Simulation Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          setCurrentPage('dashboard');
        }}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CMSProvider>
        <ThemeProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ThemeProvider>
      </CMSProvider>
    </AuthProvider>
  );
};

export default App;
