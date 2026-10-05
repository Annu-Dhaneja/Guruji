import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { DefaultLinks, SocialLinkItem } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [defaultLinks, setDefaultLinks] = useState<DefaultLinks>({
    instagramUrl: 'https://instagram.com/gurucraftpro',
    facebookUrl: 'https://facebook.com/gurucraftpro',
    youtubeUrl: 'https://youtube.com/@gurucraftpro',
    amazonUrl: 'https://amazon.in/s?k=GurucraftPro',
    flipkartUrl: 'https://flipkart.com/search?q=GurucraftPro',
    etsyUrl: 'https://etsy.com/shop/GurucraftPro',
    whatsappUrl: 'https://wa.me/918527837527',
    contactUrl: 'mailto:annudhaneja@gmail.com',
    portfolioUrl: 'https://gurucraftpro.com',
    linkedinUrl: 'https://linkedin.com/company/gurucraftpro',
    directPhone: '8527837527',
    directEmail: 'annudhaneja@gmail.com',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);

  useEffect(() => {
    // Fetch live links dynamically
    fetch('/api/default-links')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setDefaultLinks((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    fetch('/api/social-links')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSocialLinks(data.filter((link) => link.active !== false));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-16 pb-12 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
              </div>
              <span className="text-lg font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                Gurucraft<span className="text-[#0799A6] dark:text-[#25B4BD]">Pro</span>
              </span>
            </div>
            <p className="text-[#52636A] dark:text-[#B7C6C8] leading-relaxed max-w-sm">
              Premier Creative Design Studio, E-commerce Photo Retouching, Wardrobe Style Consultation, Divine Guruji Spiritual Artwork, &amp; AI Prompt Engineering led by Annu Dhaneja in Rohini, Delhi.
            </p>

            {/* Dynamic Social Media Bar */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] font-bold text-[#819396] uppercase tracking-wider">
                Connect With Annu Dhaneja
              </div>
              <div className="flex flex-wrap gap-2">
                {defaultLinks.whatsappUrl && (
                  <a
                    href={defaultLinks.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-emerald-600 dark:text-emerald-400 border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                    title="Chat on WhatsApp (+91 8527837527)"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {defaultLinks.instagramUrl && (
                  <a
                    href={defaultLinks.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                    title="Follow on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {defaultLinks.youtubeUrl && (
                  <a
                    href={defaultLinks.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-red-600 dark:text-red-400 border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                    title="Watch YouTube Tutorials"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {defaultLinks.facebookUrl && (
                  <a
                    href={defaultLinks.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-blue-600 dark:text-blue-400 border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                    title="Facebook Page"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {defaultLinks.linkedinUrl && (
                  <a
                    href={defaultLinks.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-sky-600 dark:text-sky-400 border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                    title="LinkedIn B2B"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {/* Additional Dynamic Social Links from CMS */}
                {socialLinks
                  .filter((link) => link.category === 'social' || link.category === 'custom')
                  .slice(0, 4)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.openInNewTab ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors shadow-xs"
                      title={link.platformName}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Core Creative Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => onNavigate('quick-services')} className="text-[#0799A6] dark:text-[#25B4BD] hover:underline font-bold">
                  ⚡ Quick Fixes (₹49 Micro-Services)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('image-studio')} className="text-[#0799A6] dark:text-[#25B4BD] hover:underline font-bold flex items-center gap-1.5">
                  <span>Bulk Image Studio</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD]">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('photoshop-studio')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  AI Photoshop Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('graphic-design')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  Graphic &amp; Brand Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vantage-ecom')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  Vantage Ecom Editing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book-design')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  Manual Book Covers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn-ai-prompts')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  AI Prompt Library
                </button>
              </li>
            </ul>
          </div>

          {/* Online Marketplaces & Spiritual Store */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] uppercase tracking-wider">Storefronts</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => onNavigate('guruji-artwork')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  Divine Guruji Acrylic Frames
                </button>
              </li>
              {defaultLinks.amazonUrl && (
                <li>
                  <a
                    href={defaultLinks.amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
                    <span>Amazon India Store</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              )}
              {defaultLinks.flipkartUrl && (
                <li>
                  <a
                    href={defaultLinks.flipkartUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-[#52636A] dark:text-[#B7C6C8] hover:text-blue-500 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                    <span>Flipkart Seller Hub</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              )}
              {defaultLinks.etsyUrl && (
                <li>
                  <a
                    href={defaultLinks.etsyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-[#52636A] dark:text-[#B7C6C8] hover:text-orange-500 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                    <span>Etsy International</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  About Annu Dhaneja
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#0799A6] dark:text-[#25B4BD] hover:underline font-semibold">
                  Admin CMS Console
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] uppercase tracking-wider">Studio Reach Out</h4>
            <ul className="space-y-2.5 text-[#52636A] dark:text-[#B7C6C8] font-medium">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                <a href={`tel:${defaultLinks.directPhone || '8527837527'}`} className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  +91 {defaultLinks.directPhone || '8527837527'}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                <a href={`mailto:${defaultLinks.directEmail || 'annudhaneja@gmail.com'}`} className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">
                  {defaultLinks.directEmail || 'annudhaneja@gmail.com'}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                <span>Sector 8, Rohini, Delhi 110085</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex flex-col sm:flex-row items-center justify-between text-[#819396] gap-4">
          <p>© {new Date().getFullYear()} GurucraftPro. All Rights Reserved. Crafted by Annu Dhaneja • Rohini, Delhi.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('about')} className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">Terms of Service</button>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">XML Sitemap</a>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors">Robots.txt</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
