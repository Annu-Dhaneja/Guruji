import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, Heart, ImageIcon, BookOpen, MessageCircle } from 'lucide-react';
import { ServiceItem } from '../types';
import { useCart } from '../context/CartContext';
import { MainServicesScrollingCards } from '../components/home/MainServicesScrollingCards';
import { HeroCreativeDesk } from '../components/home/HeroCreativeDesk';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from '../components/ui/LuminousTopEdgeFlare';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { addItem } = useCart();
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedServices(data.filter((s: ServiceItem) => s.id !== 'srv-ws-1' && s.category !== 'wardrobe-consultation').slice(0, 5));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative space-y-16 sm:space-y-20 pb-16 bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      {/* LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
      <LuminousTopEdgeFlare />
      
      {/* ========================================================================= */}
      {/* 5. HERO SECTION: Split-Layout with 3D Creative Studio Production Desk     */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDF2F4] via-[#F4F7F8] to-[#FFFFFF] dark:from-[#182228] dark:via-[#0E1518] dark:to-[#080D0F] border-b border-[#DCE7E7]/60 dark:border-[#243338] pt-12 pb-16 sm:pt-16 sm:pb-24 text-[#102A36] dark:text-white transition-colors duration-500">
        {/* DISTINCT OVERHEAD SPOTLIGHT & TOP EDGE FLARE */}
        <DistinctGreySpotlight intensity="high" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Elegant Eyebrow */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#182429] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/20 dark:border-[#2A3C40] text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>ANNU DHANEJA'S CREATIVE STUDIO • ROHINI, DELHI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.12] text-[#102A36] dark:text-[#F4F8F8]">
              Elevate Your <span className="text-[#0799A6] dark:text-[#25B4BD]">Brand, Visuals &amp; Spiritual Living</span>
            </h1>

            {/* Subtext Description */}
            <p className="text-base sm:text-lg text-[#52636A] dark:text-[#B7C6C8] leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              From high-converting Amazon e-commerce photo editing and custom graphic design to professional AI Photoshop studio workflows, sacred Guruji spiritual artwork, and AI prompt engineering.
            </p>

            {/* Primary & Secondary CTAs (Teal filled & thin teal border rounded buttons) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('quick-services')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-primary-cta flex items-center justify-center space-x-2.5 text-sm font-bold shadow-md cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Explore Quick Fixes (₹49)</span>
              </button>

              <button
                onClick={() => onNavigate('graphic-design')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-secondary-cta flex items-center justify-center space-x-2 text-sm font-semibold cursor-pointer active:scale-98"
              >
                <span>Explore Design Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-6 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#52636A] dark:text-[#B7C6C8] font-semibold">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>500+ Design Projects Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>Rohini, Delhi Studio Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>Direct WhatsApp Consultation</span>
              </div>
            </div>

          </div>

          {/* Hero Right: 3D Creative Studio Production Desk */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroCreativeDesk onNavigate={onNavigate} />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN SERVICES: Scrolling Royal Card Deck (Design-token themed)            */}
      {/* ========================================================================= */}
      <MainServicesScrollingCards onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* SIX SPECIALIZED CREATIVE PILLARS                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3F4] dark:bg-[#182429] border border-[#0799A6]/20 dark:border-[#2A3C40] text-[11px] font-bold text-[#087581] dark:text-[#25B4BD] uppercase tracking-wider">
            <span>Core Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
            Six Specialized Creative Pillars
          </h2>
          <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
            Designed to meet every aesthetic, commercial, personal styling, and spiritual need under Annu Dhaneja's creative direction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Pillar 1: Graphic & Brand Design */}
          <div
            onClick={() => onNavigate('graphic-design')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
                  alt="Graphic & Brand Design"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                Graphic &amp; Brand Design
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Logos, visiting cards, hoardings, Instagram posters, Youtube thumbnails, and corporate pitch decks designed with premium typography.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#DDF3F4] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#087581] dark:group-hover:text-[#25B4BD] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>Explore Graphic Design</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Pillar 2: AI Photoshop Studio */}
          <div
            onClick={() => onNavigate('photoshop-studio')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
                  alt="AI Photoshop Studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                AI Photoshop Studio
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Automate studio-grade background removal, portrait skin retouching, object removal, resolution upscaling, and smart generative fill workflows.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#DDF3F4] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#087581] dark:group-hover:text-[#25B4BD] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>Open Photoshop Studio</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Pillar 3: Guruji Divine Artwork */}
          <div
            onClick={() => onNavigate('guruji-artwork')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#F5A39A] dark:hover:border-[#F2A39A] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1611591475281-229ef58d55fa?auto=format&fit=crop&w=800&q=80"
                  alt="Guruji Divine Artwork"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#F5A39A] dark:text-[#F2A39A] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                Guruji Divine Artwork
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Sacred bracelets, acrylic donation boxes, Jai Guru Ji WhatsApp stickers, mobile wallpapers, and spiritual Vachan calendars.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#FDE2DE] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#F5A39A] dark:group-hover:text-[#F2A39A] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>Shop Spiritual Items</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Pillar 4: Vantage Ecom Photo Editing */}
          <div
            onClick={() => onNavigate('vantage-ecom')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                  alt="Vantage Ecom Photo Editing"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                Vantage Ecom Photo Editing
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Pure white Amazon background removal, ghost mannequin apparel, custom size charts, jersey color changes, &amp; promotional video reels.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#DDF3F4] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#087581] dark:group-hover:text-[#25B4BD] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>View Ecom Photo Services</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Pillar 5: Manual Book Cover Design */}
          <div
            onClick={() => onNavigate('book-design')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                  alt="Manual Book Cover Design"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                Manual Book Cover Design
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Amazon KDP Paperback, Hardcover, Dust Jackets, Kindle E-Books, and Hindi/English Devnagari lettering created with precision.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#DDF3F4] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#087581] dark:group-hover:text-[#25B4BD] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>Design Book Covers</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Pillar 6: AI Prompts & Learning */}
          <div
            onClick={() => onNavigate('learn-ai-prompts')}
            className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg card-hover-3d space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                  alt="AI Prompts & Learning"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center font-bold border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                AI Prompts &amp; Learning
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Curated library of high-converting Midjourney, ChatGPT, and Gemini prompts for logos, e-commerce, social media, and fashion.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 bg-[#F8FAFA] dark:bg-[#111A1E] group-hover:bg-[#DDF3F4] dark:group-hover:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#087581] dark:group-hover:text-[#25B4BD] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors">
              <span>Copy Free AI Prompts</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* BALANCED 2-COLUMN STUDIO FEATURE SHOWCASE (Clean, unified layout)         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: Quick Digital Services */}
          <div className="rounded-3xl bg-[#F8FAFA] dark:bg-[#141F23] border border-[#DCE7E7] dark:border-[#2A3C40] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#182429] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>MICRO-FIX DIGITAL REPAIR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8]">
                Quick Digital Services
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#0799A6] dark:text-[#25B4BD]">
                “Small Design Problems. Quick Professional Solutions.”
              </p>
              <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Got a blurry photo, bad background, or low-res logo? Upload your file, choose from 40+ micro fixes starting at ₹49, and receive your designer-corrected file in under 2 hours.
              </p>
              <div className="space-y-2 pt-2 text-xs font-semibold text-[#52636A] dark:text-[#B7C6C8]">
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>Upload → Professional Fix → Download</span></div>
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>Starting at only ₹49 / fix</span></div>
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>Same-Day &amp; 1-Hour Express Delivery</span></div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('quick-services')}
              className="w-full py-3.5 px-6 rounded-xl btn-primary-cta font-bold text-sm shadow-xs flex items-center justify-center space-x-2 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Explore 40+ Quick Fixes (₹49)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: AI Photoshop Workflow Studio */}
          <div className="rounded-3xl bg-[#F8FAFA] dark:bg-[#141F23] border border-[#DCE7E7] dark:border-[#2A3C40] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#182429] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>AI AUTOMATION SUITE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8]">
                AI Photoshop Workflow Studio
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#0799A6] dark:text-[#25B4BD]">
                Prompt-to-Action Non-Destructive Layer Recipes
              </p>
              <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Type ONE natural prompt to automatically generate downloadable Photoshop action (.ATN) files, verified non-destructive layer recipes, and interactive step-by-step studio guides.
              </p>
              <div className="space-y-2 pt-2 text-xs font-semibold text-[#52636A] dark:text-[#B7C6C8]">
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>Direct .ATN Action Script Download</span></div>
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>E-Commerce Clean White Backgrounds</span></div>
                <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" /><span>Studio Frequency Separation Skin Retouch</span></div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('photoshop-studio')}
              className="w-full py-3.5 px-6 rounded-xl btn-primary-cta font-bold text-sm shadow-xs flex items-center justify-center space-x-2 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Photoshop Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPULAR DESIGN SERVICES PREVIEW GRID                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">Popular Design Services</h2>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-1">Order directly with instant Razorpay payment simulation or WhatsApp inquiry.</p>
          </div>
          <button
            onClick={() => onNavigate('graphic-design')}
            className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] text-[#0799A6] dark:text-[#25B4BD] font-bold text-xs transition-colors shadow-xs"
          >
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((srv) => (
            <div
              key={srv.id}
              className="rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0799A6] dark:hover:border-[#25B4BD] card-hover-3d transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden relative bg-[#F8FAFA] dark:bg-[#111A1E]">
                <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-xs text-[#0799A6] dark:text-[#25B4BD] text-[10px] font-bold px-3 py-1 rounded-full border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                  {srv.categoryName}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8] line-clamp-1">{srv.title}</h3>
                  <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-2 line-clamp-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#52636A] dark:text-[#819396] font-bold block uppercase tracking-wider">Starting At</span>
                    <span className="text-lg font-black text-[#0799A6] dark:text-[#25B4BD]">₹{srv.startingPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        itemId: srv.id,
                        itemType: 'service',
                        name: srv.title,
                        price: srv.startingPrice,
                        quantity: 1,
                      });
                    }}
                    className="px-4 py-2 rounded-xl btn-primary-cta font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DIRECT CONTACT BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#F8FAFA] dark:bg-[#141F23] border border-[#DCE7E7] dark:border-[#2A3C40] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg transition-colors duration-300">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
              Ready to Start Your Custom Design Project?
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] max-w-xl leading-relaxed">
              Connect directly with Annu Dhaneja in Rohini, Delhi for custom inquiries, corporate graphic branding, or wardrobe styling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja!%20I%20would%20like%20to%20discuss%20a%20design%20project."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp +91 8527837527</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] text-[#102A36] dark:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] font-bold text-xs transition-colors shadow-xs"
            >
              Contact Form
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
