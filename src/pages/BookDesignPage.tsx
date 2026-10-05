import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, Star, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { ServiceItem } from '../types';
import { BookCoverWizard } from '../components/book-cover/BookCoverWizard';

export const BookDesignPage: React.FC = () => {
  const wizardRef = useRef<HTMLDivElement>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState<boolean>(false);

  const portfolioCovers = [
    {
      title: 'The Shadows of Hastinapur',
      author: 'Aarav Sharma',
      genre: 'Mythological Thriller',
      format: 'Amazon KDP Paperback',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Vachan & Divine Reflections',
      author: 'Gurucraft Spiritual Press',
      genre: 'Spiritual / Devotional',
      format: 'Hardcover & Dust Jacket',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Echoes of Silent Rivers',
      author: 'Priya Mukherjee',
      genre: 'Romance & Fiction',
      format: 'Kindle E-Book Cover',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Quantum Commerce 2026',
      author: 'Dr. Vikram Malhotra',
      genre: 'Business & Tech',
      format: '3D Paperback + Audio Book',
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      
      {/* 1. HERO LANDING SECTION */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 text-xs font-bold uppercase tracking-widest shadow-2xs">
          <BookOpen className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
          <span>Professional Book Cover Design</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#102A36] dark:text-[#F4F8F8] tracking-tight leading-tight">
          Turn Your Story Into a Cover People Want to Pick Up.
        </h1>

        <p className="text-base sm:text-lg text-[#52636A] dark:text-[#B7C6C8] max-w-2xl mx-auto leading-relaxed">
          Tell us about your book, choose your style, upload your existing cover or inspiration, and our designer will create a customized professional book cover for you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={scrollToWizard}
            className="px-8 py-4 rounded-2xl btn-primary-cta text-white font-black text-sm shadow-md flex items-center space-x-2 group transition-all"
          >
            <span>Start Your Book Cover Brief</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setShowPortfolioModal(true)}
            className="px-6 py-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] text-[#102A36] dark:text-[#F4F8F8] font-bold text-sm shadow-xs transition-all flex items-center space-x-2"
          >
            <ImageIcon className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
            <span>View Book Cover Portfolio</span>
          </button>
        </div>
      </div>

      {/* PORTFOLIO HIGHLIGHTS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolioCovers.map((item, idx) => (
          <div key={idx} className="group relative rounded-2xl overflow-hidden h-64 border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
            <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102A36] via-[#102A36]/40 to-transparent p-4 flex flex-col justify-end text-white space-y-1">
              <span className="text-[10px] font-bold text-[#F5A39A] uppercase tracking-wider">{item.format}</span>
              <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-[#DCE7E7] line-clamp-1">by {item.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WIZARD SECTION ANCHOR */}
      <div ref={wizardRef}>
        <BookCoverWizard />
      </div>

      {/* PORTFOLIO MODAL */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] p-6 sm:p-8 text-[#102A36] dark:text-[#F4F8F8] space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-[#0799A6] dark:text-[#25B4BD]" />
                <h3 className="text-xl font-bold">GurucraftPro Published Book Cover Portfolio</h3>
              </div>
              <button onClick={() => setShowPortfolioModal(false)} className="p-2 rounded-full hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E]">
                <X className="w-6 h-6 text-[#52636A] dark:text-[#819396]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {portfolioCovers.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden space-y-3 p-3">
                  <div className="h-64 rounded-xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 px-1">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase block">{item.genre}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400">Author: {item.author}</p>
                    <span className="text-[11px] font-bold text-amber-400 block pt-1">{item.format}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setShowPortfolioModal(false);
                  scrollToWizard();
                }}
                className="px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-xs"
              >
                Start My Book Cover Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
