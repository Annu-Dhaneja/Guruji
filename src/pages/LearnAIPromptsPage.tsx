import React, { useEffect, useState } from 'react';
import { Zap, Copy, Check, Heart, Sparkles, Filter, Search, ShieldCheck } from 'lucide-react';
import { AIPromptItem } from '../types';
import { useCart } from '../context/CartContext';

export const LearnAIPromptsPage: React.FC = () => {
  const { addItem } = useCart();
  const [prompts, setPrompts] = useState<AIPromptItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // AI Prompt Generator Sandbox
  const [genTopic, setGenTopic] = useState('Luxury Perfume Bottle');
  const [genTool, setGenTool] = useState('Midjourney');
  const [genStyle, setGenStyle] = useState('Cyberpunk Neon Studio');
  const [genOutput, setGenOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(setPrompts)
      .catch(console.error);
  }, []);

  const categories = [
    { id: 'all', label: 'All Prompts' },
    { id: 'product-photo', label: 'Product Photo' },
    { id: 'logo', label: 'Logo & Branding' },
    { id: 'ecom', label: 'E-commerce Copy' },
    { id: 'graphic-design', label: 'Fashion & Graphics' },
    { id: 'social-media', label: 'Social Media' },
  ];

  const filteredPrompts = (prompts || []).filter(p => {
    const matchesCat = activeCategory === 'all' || p?.category === activeCategory;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = (p?.title || '').toLowerCase().includes(q) ||
                          (p?.fullPrompt || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    fetch(`/api/prompts/${id}/copy`, { method: 'POST' }).catch(console.error);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFav = (id: string) => {
    setFavorites(prev => (prev || []).includes(id) ? prev.filter(f => f !== id) : [...(prev || []), id]);
  };

  const handleGenerateCustomPrompt = async () => {
    setIsGenerating(true);
    setGenOutput('');
    try {
      const res = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic, aiTool: genTool, style: genStyle }),
      });
      const data = await res.json();
      setIsGenerating(false);
      setGenOutput(data.generatedPrompt);
    } catch (e) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Zap className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
          <span>Learn AI Prompts &amp; Generative Library</span>
        </div>
        <h1 className="text-4xl font-black text-[#102A36] dark:text-[#F4F8F8]">
          AI Prompt Library &amp; Custom Generator
        </h1>
        <p className="text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
          Curated collection of Midjourney, ChatGPT, Gemini, and DALL-E prompts for e-commerce, logos, fashion, social media, and product photography.
        </p>
      </div>

      {/* Interactive AI Prompt Generator Sandbox */}
      <div className="p-8 rounded-3xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] space-y-6 shadow-xs max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
          <Sparkles className="w-6 h-6 text-[#0799A6] dark:text-[#25B4BD] animate-pulse" />
          <div>
            <h3 className="text-lg font-black text-[#102A36] dark:text-[#F4F8F8]">Interactive Gemini AI Prompt Creator</h3>
            <p className="text-xs text-[#52636A] dark:text-[#819396]">Generates custom structured prompts tailored for Midjourney &amp; ChatGPT.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Topic / Subject</label>
            <input
              type="text"
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              placeholder="e.g. Handmade Leather Bag"
              className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
            />
          </div>

          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Target AI Tool</label>
            <select
              value={genTool}
              onChange={(e) => setGenTool(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
            >
              <option value="Midjourney">Midjourney v6</option>
              <option value="ChatGPT">ChatGPT Copywriting</option>
              <option value="Gemini">Gemini Strategy</option>
              <option value="DALL-E 3">DALL-E 3</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Aesthetic Style</label>
            <input
              type="text"
              value={genStyle}
              onChange={(e) => setGenStyle(e.target.value)}
              placeholder="e.g. Minimalist Studio Glass"
              className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateCustomPrompt}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-xl btn-primary-cta text-white font-black text-xs shadow-md hover:opacity-95 transition-opacity"
        >
          {isGenerating ? 'AI Crafting Prompt...' : 'Generate High-Converting Prompt'}
        </button>

        {genOutput && (
          <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#0799A6]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#0799A6] dark:text-[#25B4BD] uppercase">Generated AI Prompt</span>
              <button
                onClick={() => handleCopy('gen-ai', genOutput)}
                className="text-[11px] text-[#087581] dark:text-[#25B4BD] hover:underline flex items-center space-x-1 font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Output</span>
              </button>
            </div>
            <p className="text-xs text-[#102A36] dark:text-[#F4F8F8] font-mono leading-relaxed select-all">{genOutput}</p>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0799A6] text-white shadow-xs'
                  : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#819396] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt library..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
          />
        </div>
      </div>

      {/* Prompts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map((p) => {
          const isFav = favorites.includes(p.id);
          return (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30">
                    {p.tool} • {p.difficulty}
                  </span>
                  <button
                    onClick={() => toggleFav(p.id)}
                    className={`p-1.5 rounded-lg ${isFav ? 'text-[#F5A39A] fill-[#F5A39A]' : 'text-[#819396] hover:text-[#F5A39A]'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-[#F5A39A]' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8] line-clamp-1">{p.title}</h3>
                <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">{p.description}</p>

                {/* Prompt Code Block */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-mono text-[#102A36] dark:text-[#F4F8F8] leading-relaxed select-all">
                  {p.fullPrompt}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between text-xs">
                <span className="text-[#819396] font-semibold">{p.copyCount} Copies</span>

                <button
                  onClick={() => handleCopy(p.id, p.fullPrompt)}
                  className="px-4 py-2 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  {copiedId === p.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
