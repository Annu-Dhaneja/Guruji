import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, Gift, Flame } from 'lucide-react';

interface FestivalBannerSectionProps {
  onExploreFestival: (festivalSlug: string) => void;
}

const FESTIVAL_SPECIALS = [
  {
    id: 'fest-guru-purnima',
    slug: 'guru-purnima',
    title: 'Guru Purnima Maha Mahotsav Collection',
    subtitle: 'Exclusive 4K Royal Golden Sinhas Darshan & Blessing Master Suites',
    bannerImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    tag: 'Holy Mahotsav',
    discount: 'Special 50% Off Master Packs',
  },
  {
    id: 'fest-mahashivratri',
    slug: 'mahashivratri',
    title: 'Mahashivratri Sacred Cosmic Darshan',
    subtitle: 'Maha Mrityunjaya & Shiva Swaroop Divine Altar Collection',
    bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    tag: 'Om Namah Shivaya',
    discount: 'Free 4K Wallpapers Included',
  },
];

export const FestivalBannerSection: React.FC<FestivalBannerSectionProps> = ({
  onExploreFestival,
}) => {
  return (
    <div className="space-y-4" id="festival-collections-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm sm:text-base font-extrabold text-white">
            Auspicious Festival Collections
          </h3>
        </div>
        <span className="text-xs text-amber-400 font-semibold">Special Seasonal Blessings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FESTIVAL_SPECIALS.map((fest) => (
          <div
            key={fest.id}
            onClick={() => onExploreFestival(fest.slug)}
            className="group relative rounded-3xl overflow-hidden border border-amber-500/30 bg-neutral-900 cursor-pointer shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
          >
            {/* Background Image */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-950">
              <img
                src={fest.bannerImage}
                alt={fest.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-neutral-950 shadow-md">
                  {fest.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-900/80 text-amber-300 border border-neutral-700 backdrop-blur-md">
                  {fest.discount}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {fest.title}
                </h4>
                <p className="text-xs text-neutral-300 line-clamp-1">{fest.subtitle}</p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Festival Pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
