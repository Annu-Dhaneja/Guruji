import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Download,
  Share2,
  Sparkles,
  Heart,
  Eye,
  Filter,
  Check,
} from 'lucide-react';
import { StoryGraphicItem } from '../../types';

interface StoryGraphicsSectionProps {
  onSuccessNotice?: (msg: string) => void;
}

const SEED_STORY_GRAPHICS: StoryGraphicItem[] = [
  {
    id: 'story-1',
    title: 'Guru Purnima Divine Golden Aura Story',
    category: 'festival',
    categoryLabel: 'Festival Specials',
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/stories/story_guru_purnima.jpg',
    festivalTag: 'Guru Purnima',
    price: 0,
    isFree: true,
    tags: ['Guru Purnima', 'Golden Aura', '9:16 Story', 'Festival'],
    downloadsCount: 1540,
    createdAt: '2026-08-20',
  },
  {
    id: 'story-2',
    title: 'Morning Amrit Vela Shukrana Story',
    category: 'daily_vachan',
    categoryLabel: 'Daily Vachan & Morning',
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/stories/story_morning_amrit.jpg',
    festivalTag: 'Amrit Vela',
    price: 0,
    isFree: true,
    tags: ['Amrit Vela', 'Shukrana', '9:16 Story', 'Morning'],
    downloadsCount: 1220,
    createdAt: '2026-08-21',
  },
  {
    id: 'story-3',
    title: 'Maha Mantra Divine Glow Story',
    category: 'mantra',
    categoryLabel: 'Sacred Mantras',
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/stories/story_maha_mantra.jpg',
    festivalTag: 'Maha Mantra',
    price: 0,
    isFree: true,
    tags: ['Mantra', 'Om Namah Shivaya', '9:16 Story'],
    downloadsCount: 1890,
    createdAt: '2026-08-22',
  },
  {
    id: 'story-4',
    title: 'Mahashivratri Holy Darshan Story Template',
    category: 'festival',
    categoryLabel: 'Festival Specials',
    aspectRatio: '9:16',
    previewUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    downloadUrl: '/downloads/stories/story_mahashivratri.jpg',
    festivalTag: 'Mahashivratri',
    price: 0,
    isFree: true,
    tags: ['Mahashivratri', 'Darshan', '9:16 Story'],
    downloadsCount: 1410,
    createdAt: '2026-08-23',
  },
];

const STORY_CATEGORIES = [
  { id: 'all', label: 'All Story Templates' },
  { id: 'festival', label: '🪔 Festivals' },
  { id: 'daily_vachan', label: '☀️ Daily Vachan' },
  { id: 'mantra', label: '🕉️ Mantras' },
];

export const StoryGraphicsSection: React.FC<StoryGraphicsSectionProps> = ({
  onSuccessNotice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStories = SEED_STORY_GRAPHICS.filter((st) => {
    if (selectedCategory !== 'all' && st.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleDownloadStory = (st: StoryGraphicItem) => {
    const link = document.createElement('a');
    link.href = st.previewUrl;
    link.download = `${st.id}-story-9x16.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onSuccessNotice) {
      onSuccessNotice(`Downloaded "${st.title}" 9:16 story graphic!`);
    }
  };

  const handleShareStory = (st: StoryGraphicItem) => {
    if (navigator.share) {
      navigator.share({
        title: st.title,
        text: 'Download HD 9:16 Jai Guru Ji spiritual stories at GurucraftPro',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Story graphic link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="story-graphics-section">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>9:16 Vertical Visuals • Instagram & WhatsApp Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sacred Story Graphics Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Beautiful 1080×1920 full-screen vertical stories for Guru Purnima, daily blessings, festival announcements, and sacred mantras.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STORY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[9/16] bg-neutral-950 overflow-hidden">
                <img
                  src={story.previewUrl}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950/80 text-amber-300 border border-neutral-800 backdrop-blur-md">
                    {story.festivalTag || '9:16 Story'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold text-white line-clamp-1">{story.title}</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareStory(story)}
                    className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition"
                    title="Share Story"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadStory(story)}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Save 9:16 HD
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
