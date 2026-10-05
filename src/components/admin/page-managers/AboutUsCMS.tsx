import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Info, Check, RefreshCw, Award, Heart, ShieldCheck, Target, Users } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const AboutUsCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'company' | 'stats' | 'milestones' | 'principles' | 'capabilities'>('company');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cms = await getCMSData();
      if (cms.pageContents && cms.pageContents['about-us']) {
        setData(cms.pageContents['about-us']);
      } else {
        const res = await fetch('/api/page-content/about-us');
        if (res.ok) {
          const json = await res.json();
          setData(json);
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
      const cms = await getCMSData();
      const updatedPageContents = {
        ...(cms.pageContents || {}),
        'about-us': data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      fetch('/api/page-content/about-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});

      setMessage('About Us Page content updated and permanently saved in Firestore!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error('Error saving About Us to Firestore:', e);
      setMessage('Failed to save to Firestore. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Loading About Us CMS...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load About Us data.</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-2">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Brand Identity CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white">About Us Page Management</h2>
          <p className="text-sm text-slate-400">Manage company story, mission, vision, founder profile, statistics, milestones, core values, and studio capabilities.</p>
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
          { id: 'company', label: 'Company Profile & Story' },
          { id: 'stats', label: 'Statistics & Metrics' },
          { id: 'milestones', label: 'Milestones Timeline' },
          { id: 'principles', label: 'Core Principles' },
          { id: 'capabilities', label: 'Studio Capabilities' },
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

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Company Profile & Founder Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={data.companyInfo?.name || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, name: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={data.companyInfo?.tagline || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, tagline: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Founder Name</label>
              <input
                type="text"
                value={data.companyInfo?.founderName || 'Annu Dhaneja'}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, founderName: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Founder Role</label>
              <input
                type="text"
                value={data.companyInfo?.founderRole || 'Founder & Master Creative Designer'}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, founderRole: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Established Year</label>
              <input
                type="text"
                value={data.companyInfo?.establishedYear || '2020'}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, establishedYear: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={data.companyInfo?.heroImage || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, heroImage: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Brand Story</label>
              <textarea
                rows={4}
                value={data.companyInfo?.story || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, story: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Mission Statement</label>
              <textarea
                rows={3}
                value={data.companyInfo?.mission || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, mission: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Vision Statement</label>
              <textarea
                rows={3}
                value={data.companyInfo?.vision || ''}
                onChange={(e) => setData({ ...data, companyInfo: { ...data.companyInfo, vision: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATS */}
      {activeTab === 'stats' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Statistics & Key Metrics</h3>
            <button
              onClick={() => {
                const stats = [...(data.stats || [])];
                stats.push({ id: 'st-' + Date.now(), label: 'New Metric', number: '100+', visible: true });
                setData({ ...data, stats });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.stats || []).map((s: any, idx: number) => (
              <div key={s.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={s.label || ''}
                    onChange={(e) => {
                      const stats = [...data.stats];
                      stats[idx].label = e.target.value;
                      setData({ ...data, stats });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={s.number || ''}
                    onChange={(e) => {
                      const stats = [...data.stats];
                      stats[idx].number = e.target.value;
                      setData({ ...data, stats });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    const stats = data.stats.filter((_: any, i: number) => i !== idx);
                    setData({ ...data, stats });
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

      {/* TAB 3: MILESTONES */}
      {activeTab === 'milestones' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Brand Milestones Timeline</h3>
            <button
              onClick={() => {
                const ms = [...(data.milestones || [])];
                ms.push({ id: 'm-' + Date.now(), year: '2025', title: 'New Milestone', description: 'Milestone summary' });
                setData({ ...data, milestones: ms });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.milestones || []).map((m: any, idx: number) => (
              <div key={m.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-400">Milestone #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const ms = data.milestones.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, milestones: ms });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={m.year || ''}
                    onChange={(e) => {
                      const ms = [...data.milestones];
                      ms[idx].year = e.target.value;
                      setData({ ...data, milestones: ms });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                  />
                  <input
                    type="text"
                    value={m.title || ''}
                    onChange={(e) => {
                      const ms = [...data.milestones];
                      ms[idx].title = e.target.value;
                      setData({ ...data, milestones: ms });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold md:col-span-2"
                  />
                  <textarea
                    rows={2}
                    value={m.description || ''}
                    onChange={(e) => {
                      const ms = [...data.milestones];
                      ms[idx].description = e.target.value;
                      setData({ ...data, milestones: ms });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white md:col-span-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CORE PRINCIPLES & TAB 5: CAPABILITIES */}
      {(activeTab === 'principles' || activeTab === 'capabilities') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white capitalize">Existing {activeTab}</h3>
          <p className="text-xs text-slate-400">Values, quality commitments, and studio specialization pillars are persisted directly to database store.</p>
        </div>
      )}
    </div>
  );
};
