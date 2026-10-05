import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  User,
  MapPin,
  CheckCircle2,
  Share2,
  Flame,
  Award,
} from 'lucide-react';
import { GurujiBlessingWallSubmission } from '../../types';

interface BlessingWallSectionProps {
  submissions: GurujiBlessingWallSubmission[];
  onAddSubmission: (sub: Partial<GurujiBlessingWallSubmission>) => Promise<boolean>;
  onLikeSubmission: (id: string) => void;
}

export const BlessingWallSection: React.FC<BlessingWallSectionProps> = ({
  submissions,
  onAddSubmission,
  onLikeSubmission,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [category, setCategory] = useState<'Gratitude' | 'Prayer' | 'Festival Greeting' | 'Inspirational'>('Gratitude');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) return;

    setSubmitting(true);
    const success = await onAddSubmission({
      userName: userName.trim(),
      userCity: userCity.trim() || 'India',
      category,
      message: message.trim(),
    });
    setSubmitting(false);

    if (success) {
      setSubmittedSuccess(true);
      setUserName('');
      setUserCity('');
      setMessage('');
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsModalOpen(false);
      }, 2500);
    }
  };

  const handleLike = (id: string) => {
    if (!likedMap[id]) {
      setLikedMap((prev) => ({ ...prev, [id]: true }));
      onLikeSubmission(id);
    }
  };

  return (
    <section id="blessing-wall" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Devotee Sangat Wall</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Devotee Shukrana & Prayer Wall
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Read heartfelt experiences, prayers, and gratitude notes shared by devotees worldwide. Add your own voice to our collective spiritual sanctuary.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-auto flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition-all hover:scale-105"
        >
          <Send className="w-4 h-4" />
          <span>Write Shukrana / Prayer</span>
        </button>
      </div>

      {/* Grid of Submissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((sub) => {
          const isLiked = likedMap[sub.id];

          return (
            <div
              key={sub.id}
              className={`p-6 rounded-3xl bg-slate-900/90 border transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl ${
                sub.isFeatured
                  ? 'border-amber-500/50 bg-gradient-to-b from-slate-900 to-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      {sub.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{sub.userName}</h4>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{sub.userCity || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {sub.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  "{sub.message}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                <span className="text-[11px]">
                  {new Date(sub.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <button
                  onClick={() => handleLike(sub.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                    isLiked
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
                  <span className="font-bold text-[11px]">{sub.likesCount + (isLiked ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-white">Share Your Shukrana or Prayer</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center space-y-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="text-sm font-black">Shukrana Submitted!</h4>
                <p className="text-xs text-slate-300">
                  May Guruji's blessings shower upon you and your loved ones. Your message is now live on the Devotee Wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Annu Dhaneja"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">City / Country</label>
                    <input
                      type="text"
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      placeholder="e.g. Delhi, India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Gratitude">❤️ Shukrana / Gratitude</option>
                    <option value="Prayer">🙏 Prayer for Health / Family</option>
                    <option value="Festival Greeting">🌸 Festival / Satsang Greeting</option>
                    <option value="Inspirational">✨ Inspirational Devotee Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Sacred Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Express your heartfelt shukrana, prayer or blessing..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Publishing...' : 'Post to Devotee Wall'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
