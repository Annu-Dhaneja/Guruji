import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Sun, Moon, Menu, X, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onOpenCart, onOpenAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'quick-services', label: 'Quick Fixes', badge: '₹49' },
    { id: 'product/perfume', label: '3D Products', badge: '360°' },
    { id: 'graphic-design', label: 'Graphic Design' },
    { id: 'guruji-artwork', label: 'Guruji Artwork' },
    { id: 'vantage-ecom', label: 'Vantage Ecom' },
    { id: 'image-studio', label: 'Bulk Image Studio', badge: 'NEW' },
    { id: 'photoshop-studio', label: 'AI Studio & Prompts', badge: 'AI' },
    { id: 'book-design', label: 'Book Covers' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFFFFF]/95 dark:bg-[#0B1114]/95 backdrop-blur-md border-b border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs py-2.5'
          : 'bg-[#FFFFFF] dark:bg-[#0B1114] border-b border-[#DCE7E7]/80 dark:border-[#2A3C40]/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo (Matching Reference Image) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 text-left group focus:outline-none"
        >
          {/* Circular Logo Icon with Theme-Adaptive Favicon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#087581] to-[#0799A6] p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#0B1114] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={theme === 'dark' ? '/favicon-dark.jpg' : '/favicon-light.jpg'}
                alt="GurucraftPro Favicon Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full transition-opacity duration-300"
              />
            </div>
          </div>

          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8] flex items-center leading-none">
              <span>Gurucraft</span>
              <span className="text-[#0799A6] dark:text-[#25B4BD]">Pro</span>
            </div>
            <p className="text-[10px] text-[#52636A] dark:text-[#819396] font-medium tracking-tight mt-0.5">
              By Annu Dhaneja • Rohini, Delhi
            </p>
          </div>
        </button>

        {/* Desktop Nav Links (Pills matching reference image) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive =
              activePage === link.id ||
              (link.id === 'photoshop-studio' && activePage === 'learn-ai-prompts');
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] font-bold border border-[#0799A6]/30 shadow-xs'
                    : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] hover:bg-[#DDF3F4]/40 dark:hover:bg-[#173D40]/30'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FDE2DE] dark:bg-[#533735] text-[#D9777F] dark:text-[#F2A39A] border border-[#F5A39A]/40">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-[#F8FAFA] dark:bg-[#182429] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F2A39A]" />
            ) : (
              <Moon className="w-4 h-4 text-[#52636A]" />
            )}
          </button>

          {/* Cart Drawer */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-[#F8FAFA] dark:bg-[#182429] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] transition-colors shadow-xs"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F5A39A] dark:bg-[#F2A39A] text-[#102A36] dark:text-[#0B1114] font-black text-[10px] flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account or Sign In (Peach Pill as in reference image) */}
          {user ? (
            <button
              onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'dashboard')}
              className="px-4 py-2 rounded-full bg-[#F8FAFA] dark:bg-[#182429] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] font-bold text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
              <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 rounded-full bg-[#F5A39A] dark:bg-[#F2A39A] hover:brightness-105 text-[#102A36] dark:text-[#0B1114] font-extrabold text-xs shadow-xs transition-all active:scale-95"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-[#F8FAFA] dark:bg-[#182429] lg:hidden text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 bg-[#FFFFFF] dark:bg-[#111A1E] border-b border-[#DCE7E7] dark:border-[#2A3C40] space-y-1.5 text-xs font-semibold animate-in fade-in duration-200">
          {navLinks.map((link) => {
            const isActive =
              activePage === link.id ||
              (link.id === 'photoshop-studio' && activePage === 'learn-ai-prompts');
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-full transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] font-bold border border-[#0799A6]/30'
                    : 'text-[#52636A] dark:text-[#B7C6C8] hover:bg-[#DDF3F4]/40 dark:hover:bg-[#173D40]/30 hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#FDE2DE] dark:bg-[#533735] text-[#D9777F] dark:text-[#F2A39A] border border-[#F5A39A]/40">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex justify-between items-center px-2">
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-[#0799A6] dark:text-[#25B4BD] flex items-center space-x-1.5 font-semibold text-xs py-1"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
