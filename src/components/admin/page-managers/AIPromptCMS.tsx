import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, Eye, EyeOff, Sparkles, Check, RefreshCw, Copy, Layers } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const AIPromptCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'prompts' | 'features'>('categories');

  // Prompt Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pPrice, setPPrice] = useState(199);
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pPlatform, setPPlatform] = useState('Midjourney');
  const [pCategory, setPCategory] = useState('Photorealistic Studio');
  const [pFullPrompt, setPFullPrompt] = useState('');
  const [pIsPremium, setPIsPremium] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cms = await getCMSData();
      if (cms.pageContents && cms.pageContents['ai-prompt']) {
        setData(cms.pageContents['ai-prompt']);
      } else {
        const resPage = await fetch('/api/page-content/ai-prompt');
        if (resPage.ok) {
          const json = await resPage.json();
          setData(json);
        }
      }

      if (cms.prompts && cms.prompts.length > 0) {
        setPrompts(cms.prompts);
      } else {
        const resPrompts = await fetch('/api/prompts');
        if (resPrompts.ok) {
          const pList = await resPrompts.json();
          setPrompts(pList);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Primary write to Firestore cms/main
      const cms = await getCMSData();
      const updatedPageContents = {
        ...(cms.pageContents || {}),
        'ai-prompt': data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      // Server sync
      fetch('/api/page-content/ai-prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn(e));

      setMessage('AI Prompt Page settings updated and saved in Firestore!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e: any) {
      console.error(e);
      setMessage(`Save failed: ${e?.message || 'Error saving to Firestore'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Loading AI Prompt CMS...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load AI Prompt data.</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Prompt Engineering CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white">AI Prompt Page Management</h2>
          <p className="text-sm text-slate-400">Manage ChatGPT, Gemini, Midjourney, DALL-E prompts, free vs premium access, copy counter & prompt categories.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center space-x-2 transition-all"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'categories', label: 'Prompt Categories' },
          { id: 'prompts', label: 'Prompts Catalog' },
          { id: 'features', label: 'Search & Copy Access' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing AI Prompt Categories</h3>
            <button
              onClick={() => {
                const cats = [...(data.categoriesList || [])];
                cats.push({
                  id: 'pcat-' + Date.now(),
                  name: 'New Prompt Category',
                  platform: 'Midjourney',
                  icon: 'Sparkles',
                  visible: true,
                });
                setData({ ...data, categoriesList: cats });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.categoriesList || []).map((cat: any, idx: number) => (
              <div key={cat.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={cat.name || ''}
                    onChange={(e) => {
                      const cats = [...data.categoriesList];
                      cats[idx].name = e.target.value;
                      setData({ ...data, categoriesList: cats });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={cat.platform || ''}
                    onChange={(e) => {
                      const cats = [...data.categoriesList];
                      cats[idx].platform = e.target.value;
                      setData({ ...data, categoriesList: cats });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400"
                  />
                </div>
                <button
                  onClick={() => {
                    const cats = data.categoriesList.filter((_: any, i: number) => i !== idx);
                    setData({ ...data, categoriesList: cats });
                  }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMPTS CATALOG */}
      {activeTab === 'prompts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Prompts Catalog ({prompts.length} Prompts)</h3>
              <p className="text-xs text-slate-400">Edit Title, Price, Description, Output Image Preview, AI Platform, and Full Prompt Text.</p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setPTitle('');
                setPPrice(199);
                setPDescription('');
                setPImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
                setPPlatform('Midjourney v6');
                setPCategory('Photorealistic Studio');
                setPFullPrompt('');
                setPIsPremium(false);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New AI Prompt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  {(p.imageUrl || p.previewUrl) && (
                    <div className="h-40 relative bg-slate-900 overflow-hidden">
                      <img src={p.imageUrl || p.previewUrl} alt={p.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${p.isPremium ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950 font-black'}`}>
                        {p.isPremium ? '₹' + (p.price || 199) : 'FREE'}
                      </span>
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                      {!(p.imageUrl || p.previewUrl) && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {p.isPremium ? '₹' + (p.price || 199) : 'Free'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description || p.category || 'AI Master Prompt'}</p>
                    <div className="bg-slate-900 rounded-lg p-2 text-[11px] font-mono text-purple-300 truncate border border-slate-800">
                      {p.fullPrompt || p.promptText}
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-800/80 flex items-center justify-end gap-2 bg-slate-900/50">
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setPTitle(p.title);
                      setPPrice(p.price || 199);
                      setPDescription(p.description || '');
                      setPImage(p.imageUrl || p.previewUrl || '');
                      setPPlatform(p.aiPlatform || p.platform || 'Midjourney v6');
                      setPCategory(p.category || 'Photorealistic Studio');
                      setPFullPrompt(p.fullPrompt || p.promptText || '');
                      setPIsPremium(p.isPremium ?? false);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Are you sure you want to delete ${p.title}?`)) return;
                      const updated = prompts.filter((pr) => pr.id !== p.id);
                      setPrompts(updated);
                      await saveCMSSection('prompts', updated).catch((e) => console.warn(e));
                      fetch(`/api/prompts/${p.id}`, { method: 'DELETE' }).catch(() => {});
                    }}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1 border border-red-500/20 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT PROMPT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>{editingId ? 'Edit AI Prompt' : 'Add New AI Prompt'}</span>
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  id: editingId || `prompt-${Date.now()}`,
                  title: pTitle,
                  price: Number(pPrice),
                  description: pDescription,
                  imageUrl: pImage,
                  previewUrl: pImage,
                  aiPlatform: pPlatform,
                  platform: pPlatform,
                  category: pCategory,
                  fullPrompt: pFullPrompt,
                  promptText: pFullPrompt,
                  isPremium: pIsPremium,
                };

                const updatedPrompts = editingId
                  ? prompts.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
                  : [payload, ...prompts];

                setPrompts(updatedPrompts);
                await saveCMSSection('prompts', updatedPrompts).catch((e) => console.warn(e));
                setIsModalOpen(false);

                if (editingId) {
                  fetch(`/api/prompts/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  }).catch(() => {});
                } else {
                  fetch('/api/prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  }).catch(() => {});
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-amber-400 font-black rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">AI Platform</label>
                  <select
                    value={pPlatform}
                    onChange={(e) => setPPlatform(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-2 font-bold"
                  >
                    <option value="Midjourney v6">Midjourney v6</option>
                    <option value="ChatGPT-4o">ChatGPT-4o</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                    <option value="Gemini Advanced">Gemini Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Sample Output Image URL</label>
                <input
                  type="text"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
                {pImage && (
                  <div className="mt-2 h-24 rounded-lg overflow-hidden border border-slate-700">
                    <img src={pImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Short Description</label>
                <textarea
                  rows={2}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Full Master Prompt Text</label>
                <textarea
                  rows={3}
                  required
                  value={pFullPrompt}
                  onChange={(e) => setPFullPrompt(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-purple-300 font-mono rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="premCheck"
                  checked={pIsPremium}
                  onChange={(e) => setPIsPremium(e.target.checked)}
                  className="rounded text-purple-600 bg-slate-800 border-slate-700"
                />
                <label htmlFor="premCheck" className="text-slate-300 font-bold">Premium Paid Prompt (Requires Payment to Unlock)</label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURES */}
      {activeTab === 'features' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Search, Copy & Premium Access Configuration</h3>
          <p className="text-xs text-slate-400">All prompt features (1-click copy prompt, category filter, free vs paid access) are connected to the live backend API.</p>
        </div>
      )}
    </div>
  );
};
