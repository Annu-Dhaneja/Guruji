import React from 'react';
import { Sparkles, Heart, Flame, Compass, Sun, Feather, Shield, Star } from 'lucide-react';
import { GurujiMoodType } from '../../types';

interface MoodItem {
  id: GurujiMoodType;
  title: string;
  hindiTitle: string;
  description: string;
  mantra: string;
  icon: string;
  color: string;
  gradient: string;
  borderColor: string;
  bgActive: string;
}

export const SACRED_MOODS: MoodItem[] = [
  {
    id: 'peace',
    title: 'Peace & Serenity',
    hindiTitle: 'शांति और सुकून',
    description: 'Calm the mind, release worries & invite divine stillness into your day.',
    mantra: '॥ ॐ शांतिः शांतिः शांतिः ॥',
    icon: '🌿',
    color: 'text-teal-300',
    gradient: 'from-teal-900/40 via-slate-900 to-slate-950',
    borderColor: 'border-teal-500/30',
    bgActive: 'bg-teal-500/20 text-teal-300 border-teal-400',
  },
  {
    id: 'gratitude',
    title: 'Gratitude & Shukrana',
    hindiTitle: 'शुकराना और आभार',
    description: 'Acknowledge every blessing with a humble, overflowing heart.',
    mantra: '॥ शुकराना गुरु जी अनंतम अनंतम ॥',
    icon: '❤️',
    color: 'text-rose-300',
    gradient: 'from-rose-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-rose-500/30',
    bgActive: 'bg-rose-500/20 text-rose-300 border-rose-400',
  },
  {
    id: 'blessings',
    title: 'Grace & Protection',
    hindiTitle: 'कृपा और रक्षा',
    description: 'Surround your home and family with the divine shield of Guruji.',
    mantra: '॥ गुरु रक्षा सर्वदा ॥',
    icon: '🙏',
    color: 'text-amber-300',
    gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-amber-500/30',
    bgActive: 'bg-amber-500/20 text-amber-300 border-amber-400',
  },
  {
    id: 'motivation',
    title: 'Courage & Hope',
    hindiTitle: 'हिम्मत और आशा',
    description: 'Rise above self-doubt with unwavering faith in the divine master.',
    mantra: '॥ निर्भय होय भजो भगवान ॥',
    icon: '✨',
    color: 'text-yellow-300',
    gradient: 'from-yellow-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-yellow-500/30',
    bgActive: 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
  },
  {
    id: 'meditation',
    title: 'Meditation & Dhyan',
    hindiTitle: 'ध्यान और अमृत वेला',
    description: 'Deepen your connection during Amrit Vela with sacred focal artworks.',
    mantra: '॥ ॐ गुरुवे नमः ॥',
    icon: '🧘',
    color: 'text-indigo-300',
    gradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-indigo-500/30',
    bgActive: 'bg-indigo-500/20 text-indigo-300 border-indigo-400',
  },
  {
    id: 'positivity',
    title: 'Joy & Healing',
    hindiTitle: 'सकारात्मक ऊर्जा',
    description: 'Infuse your aura with cheerful light, health, and harmony.',
    mantra: '॥ सर्व सुख शांति भवतु ॥',
    icon: '🌸',
    color: 'text-emerald-300',
    gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-emerald-500/30',
    bgActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
  },
  {
    id: 'strength',
    title: 'Inner Resilience',
    hindiTitle: 'आत्मिक बल',
    description: 'Find fortitude in times of difficulty and tests of faith.',
    mantra: '॥ गुरु बिन घोर अंधार ॥',
    icon: '🔥',
    color: 'text-orange-300',
    gradient: 'from-orange-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-orange-500/30',
    bgActive: 'bg-orange-500/20 text-orange-300 border-orange-400',
  },
  {
    id: 'new-beginning',
    title: 'New Beginning & Pooja',
    hindiTitle: 'शुभ आरंभ और मंगल',
    description: 'Start new ventures, home warming, or businesses with auspicious grace.',
    mantra: '॥ ॐ श्री गणेशाय नमः ॥',
    icon: '💫',
    color: 'text-purple-300',
    gradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    borderColor: 'border-purple-500/30',
    bgActive: 'bg-purple-500/20 text-purple-300 border-purple-400',
  },
];

interface MoodSelectorSectionProps {
  selectedMood: string;
  onSelectMood: (moodId: string) => void;
  artworkCountMap?: Record<string, number>;
}

export const MoodSelectorSection: React.FC<MoodSelectorSectionProps> = ({
  selectedMood,
  onSelectMood,
  artworkCountMap = {},
}) => {
  const activeMoodObj = SACRED_MOODS.find((m) => m.id === selectedMood);

  return (
    <section id="mood-selector" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spiritual Emotion Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choose Your Mood & Seek Divine Alignment
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Select what your heart seeks today. Discover sacred Swaroops, vachans, and blessings curated specifically for your emotional and spiritual state.
          </p>
        </div>

        {selectedMood !== 'all' && (
          <button
            onClick={() => onSelectMood('all')}
            className="self-start md:self-auto text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            Show All Moods & Artworks
          </button>
        )}
      </div>

      {/* Mood Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {SACRED_MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          const count = artworkCountMap[mood.id] || 0;

          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(isSelected ? 'all' : mood.id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden border ${
                isSelected
                  ? `${mood.bgActive} shadow-lg ring-2 ring-amber-400/50 scale-105 z-10`
                  : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-2xl">{mood.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>

              <div>
                <div className="text-xs font-black tracking-tight leading-snug line-clamp-1">
                  {mood.title}
                </div>
                <div className="text-[10px] text-amber-400/80 font-medium truncate mt-0.5">
                  {mood.hindiTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mood Deep-Dive Card (If one is selected) */}
      {activeMoodObj && (
        <div
          className={`p-5 rounded-3xl bg-gradient-to-r ${activeMoodObj.gradient} border ${activeMoodObj.borderColor} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500`}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{activeMoodObj.icon}</span>
              <span className="text-sm font-black text-white">{activeMoodObj.title}</span>
              <span className="text-xs text-amber-300 font-semibold">({activeMoodObj.hindiTitle})</span>
            </div>
            <p className="text-xs text-slate-300">{activeMoodObj.description}</p>
            <div className="text-xs font-bold text-amber-400 pt-0.5">{activeMoodObj.mantra}</div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400">Filtering gallery for:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
              {activeMoodObj.title}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
