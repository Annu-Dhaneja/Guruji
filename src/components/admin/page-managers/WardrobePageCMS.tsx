import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Shirt, Calendar, Check, RefreshCw, FileText, Sparkles, User, Clock } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const WardrobePageCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'service' | 'seven-days' | 'categories' | 'questionnaire' | 'wear-today' | 'digital-wardrobe' | 'bookings'>('service');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // 1. Primary Load: Firestore
      const [cms, resSubs] = await Promise.all([
        getCMSData().catch(() => null),
        fetch('/api/wardrobe/submissions').catch(() => null),
      ]);

      if (cms && cms.pageContents && cms.pageContents.wardrobe) {
        setData(cms.pageContents.wardrobe);
      } else {
        const resPage = await fetch('/api/page-content/wardrobe');
        if (resPage.ok) {
          const json = await resPage.json();
          setData(json);
        }
      }

      if (resSubs && resSubs.ok) {
        const subs = await resSubs.json();
        setSubmissions(subs);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(`Failed to load wardrobe CMS: ${e?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      // 1. Primary Write: Firebase Firestore cms/main
      const currentCMS = await getCMSData();
      const updatedPageContents = {
        ...(currentCMS.pageContents || {}),
        wardrobe: data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      // 2. Server sync
      fetch('/api/page-content/wardrobe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn('Server cache sync warning:', e));

      setMessage('Cloth Consultation Page saved and permanently published to Firestore!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(`Firestore Save Failed: ${e?.message || 'Permission denied or network failure'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Loading Cloth Consultation CMS...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load Cloth Consultation data.</div>;

  const daysList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-2">
            <Shirt className="w-3.5 h-3.5" />
            <span>Consultation CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white">Cloth Consultation Page Management</h2>
          <p className="text-sm text-slate-400">Manage 7-day capsule wardrobe outfit builder, questionnaire, style categories, and consultation bookings.</p>
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
          { id: 'service', label: 'Consultation Service' },
          { id: 'seven-days', label: '7-Day Outfit System' },
          { id: 'categories', label: 'Style Categories' },
          { id: 'questionnaire', label: 'Questionnaire Form' },
          { id: 'wear-today', label: 'What Should I Wear?' },
          { id: 'digital-wardrobe', label: 'Digital Wardrobe' },
          { id: 'bookings', label: 'Client Bookings' },
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

      {/* TAB 1: CONSULTATION SERVICE SETTINGS */}
      {activeTab === 'service' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Consultation Service Attributes</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Service Title</label>
              <input
                type="text"
                value={data.serviceSettings?.title || ''}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Price (₹)</label>
              <input
                type="number"
                value={data.serviceSettings?.price || 1499}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, price: Number(e.target.value) } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Discount %</label>
              <input
                type="number"
                value={data.serviceSettings?.discount || 0}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, discount: Number(e.target.value) } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Duration / Turnaround</label>
              <input
                type="text"
                value={data.serviceSettings?.duration || '48-72 Hours'}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, duration: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Availability</label>
              <input
                type="text"
                value={data.serviceSettings?.availability || 'Available Daily'}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, availability: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
              <select
                value={data.serviceSettings?.status || 'Active'}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, status: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Booking Full">Booking Full</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Service Image URL</label>
              <input
                type="text"
                value={data.serviceSettings?.image || ''}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, image: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                placeholder="https://images.unsplash.com/..."
              />
              {data.serviceSettings?.image && (
                <div className="h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={data.serviceSettings.image} alt="Service Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={data.serviceSettings?.description || ''}
                onChange={(e) => setData({ ...data, serviceSettings: { ...data.serviceSettings, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 7-DAY OUTFIT SYSTEM */}
      {activeTab === 'seven-days' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing 7-Day Wardrobe Feature Configuration</h3>
          <p className="text-xs text-slate-400">Configure outfits, tops, bottoms, footwear, accessories, color harmony, and styling tips for Monday through Sunday.</p>

          <div className="space-y-6">
            {daysList.map((dayKey) => {
              const dayData = data.sevenDaySystem?.days?.[dayKey] || {};
              return (
                <div key={dayKey} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-sm font-black text-amber-400 capitalize">{dayKey} Outfit Configuration</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Outfit Title</label>
                      <input
                        type="text"
                        value={dayData.title || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], title: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Top / Shirt / Kurti</label>
                      <input
                        type="text"
                        value={dayData.top || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], top: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Bottom / Trousers / Denim</label>
                      <input
                        type="text"
                        value={dayData.bottom || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], bottom: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Footwear</label>
                      <input
                        type="text"
                        value={dayData.footwear || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], footwear: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Accessories</label>
                      <input
                        type="text"
                        value={dayData.accessories || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], accessories: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Color Palette</label>
                      <input
                        type="text"
                        value={dayData.color || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], color: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Styling Tip</label>
                      <input
                        type="text"
                        value={dayData.stylingTip || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], stylingTip: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={dayData.image || ''}
                        onChange={(e) => {
                          const days = { ...data.sevenDaySystem.days };
                          days[dayKey] = { ...days[dayKey], image: e.target.value };
                          setData({ ...data, sevenDaySystem: { ...data.sevenDaySystem, days } });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STYLE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Style Categories</h3>
            <p className="text-xs text-slate-400">Office, College, Casual, Party, Wedding, Travel, Traditional, Festive, Smart Casual, Date, Business.</p>
          </div>

          <div className="space-y-4">
            {(data.styleCategories || []).map((cat: any, idx: number) => (
              <div key={cat.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={cat.name || ''}
                    onChange={(e) => {
                      const cats = [...data.styleCategories];
                      cats[idx].name = e.target.value;
                      setData({ ...data, styleCategories: cats });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={cat.description || ''}
                    onChange={(e) => {
                      const cats = [...data.styleCategories];
                      cats[idx].description = e.target.value;
                      setData({ ...data, styleCategories: cats });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300"
                  />
                </div>
                <div className="w-full md:w-64">
                  <input
                    type="text"
                    value={cat.image || ''}
                    onChange={(e) => {
                      const cats = [...data.styleCategories];
                      cats[idx].image = e.target.value;
                      setData({ ...data, styleCategories: cats });
                    }}
                    placeholder="Image URL"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUESTIONNAIRE FORM */}
      {activeTab === 'questionnaire' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Wardrobe Brief Questionnaire Fields</h3>
          <p className="text-xs text-slate-400">Manage labels, field options, required status, order, and visibility for client brief form.</p>

          <div className="space-y-4">
            {(data.questionnaire || []).map((f: any, idx: number) => (
              <div key={f.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-400">Field #{idx + 1}: {f.fieldKey}</span>
                  <label className="flex items-center space-x-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={f.required ?? true}
                      onChange={(e) => {
                        const q = [...data.questionnaire];
                        q[idx].required = e.target.checked;
                        setData({ ...data, questionnaire: q });
                      }}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600"
                    />
                    <span>Required</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Field Label</label>
                    <input
                      type="text"
                      value={f.label || ''}
                      onChange={(e) => {
                        const q = [...data.questionnaire];
                        q[idx].label = e.target.value;
                        setData({ ...data, questionnaire: q });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Options (Comma Separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(f.options) ? f.options.join(', ') : ''}
                      onChange={(e) => {
                        const q = [...data.questionnaire];
                        q[idx].options = e.target.value.split(',').map((s) => s.trim());
                        setData({ ...data, questionnaire: q });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WHAT SHOULD I WEAR TODAY */}
      {activeTab === 'wear-today' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">"What Should I Wear Today?" Recommendation Engine</h3>

          <div className="space-y-4">
            {(data.whatShouldIWear?.recommendations || []).map((rec: any, idx: number) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Occasion</label>
                    <input
                      type="text"
                      value={rec.occasion || ''}
                      onChange={(e) => {
                        const recs = [...data.whatShouldIWear.recommendations];
                        recs[idx].occasion = e.target.value;
                        setData({ ...data, whatShouldIWear: { ...data.whatShouldIWear, recommendations: recs } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Weather</label>
                    <input
                      type="text"
                      value={rec.weather || ''}
                      onChange={(e) => {
                        const recs = [...data.whatShouldIWear.recommendations];
                        recs[idx].weather = e.target.value;
                        setData({ ...data, whatShouldIWear: { ...data.whatShouldIWear, recommendations: recs } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={rec.image || ''}
                      onChange={(e) => {
                        const recs = [...data.whatShouldIWear.recommendations];
                        recs[idx].image = e.target.value;
                        setData({ ...data, whatShouldIWear: { ...data.whatShouldIWear, recommendations: recs } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Stylist Recommendation</label>
                    <textarea
                      rows={2}
                      value={rec.suggestion || ''}
                      onChange={(e) => {
                        const recs = [...data.whatShouldIWear.recommendations];
                        recs[idx].suggestion = e.target.value;
                        setData({ ...data, whatShouldIWear: { ...data.whatShouldIWear, recommendations: recs } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DIGITAL WARDROBE */}
      {activeTab === 'digital-wardrobe' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Digital Wardrobe Upload Settings</h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Supported Digital Wardrobe Categories (Comma Separated)</label>
            <input
              type="text"
              value={(data.digitalWardrobeConfig?.categories || []).join(', ')}
              onChange={(e) => {
                const cats = e.target.value.split(',').map((s) => s.trim());
                setData({ ...data, digitalWardrobeConfig: { ...data.digitalWardrobeConfig, categories: cats } });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      )}

      {/* TAB 7: CLIENT BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Client Consultation Bookings</h3>

          <div className="space-y-4">
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No client consultation submissions yet.</p>
            ) : (
              submissions.map((sub, idx) => (
                <div key={sub.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{sub.clientName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">{sub.status || 'Active'}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{sub.clientPhone} • {sub.clientEmail} • {sub.occasion}</p>
                    <p className="text-xs text-amber-400 mt-0.5">Budget: {sub.budgetRange} | Style: {sub.preferredStyle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
