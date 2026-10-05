import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, BookOpen, Check, RefreshCw, FileText, Layers, CheckCircle2 } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const BookCoverCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'form-fields' | 'packages' | 'projects' | 'revisions'>('services');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cms = await getCMSData();
      if (cms.pageContents && cms.pageContents['book-cover']) {
        setData(cms.pageContents['book-cover']);
      } else {
        const resPage = await fetch('/api/page-content/book-cover');
        if (resPage.ok) {
          const json = await resPage.json();
          setData(json);
        }
      }

      const resProj = await fetch('/api/book-covers/projects');
      if (resProj.ok) {
        const projs = await resProj.json();
        setProjects(projs);
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
        'book-cover': data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      // Server sync
      fetch('/api/page-content/book-cover', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn(e));

      setMessage('Book Cover Design Page features updated and saved in Firestore!');
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
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
        <p>Loading Book Cover Design CMS...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load Book Cover data.</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Publishing Design CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white">Book Cover Design Page Management</h2>
          <p className="text-sm text-slate-400">Manage cover services, KDP brief form fields, pricing packages, author project pipelines, and proof revisions.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-900/30 flex items-center space-x-2 transition-all"
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
          { id: 'services', label: 'Cover Services' },
          { id: 'form-fields', label: 'Brief Form Fields' },
          { id: 'packages', label: 'Pricing Packages' },
          { id: 'projects', label: 'Active Projects Pipeline' },
          { id: 'revisions', label: 'Revision Requests' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SERVICES */}
      {activeTab === 'services' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Book Cover Services</h3>
            <button
              onClick={() => {
                const svcs = [...(data.servicesList || [])];
                svcs.push({
                  id: 'bcs-' + Date.now(),
                  name: 'New Cover Service',
                  price: 1999,
                  deliveryTime: '2 Days',
                  visible: true,
                });
                setData({ ...data, servicesList: svcs });
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.servicesList || []).map((s: any, idx: number) => (
              <div key={s.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400">Service #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const svcs = data.servicesList.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, servicesList: svcs });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={s.name || ''}
                      onChange={(e) => {
                        const svcs = [...data.servicesList];
                        svcs[idx].name = e.target.value;
                        setData({ ...data, servicesList: svcs });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={s.price || 0}
                      onChange={(e) => {
                        const svcs = [...data.servicesList];
                        svcs[idx].price = Number(e.target.value);
                        setData({ ...data, servicesList: svcs });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      value={s.deliveryTime || ''}
                      onChange={(e) => {
                        const svcs = [...data.servicesList];
                        svcs[idx].deliveryTime = e.target.value;
                        setData({ ...data, servicesList: svcs });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Sample Image URL</label>
                    <input
                      type="text"
                      value={s.imageUrl || s.image || ''}
                      onChange={(e) => {
                        const svcs = [...data.servicesList];
                        svcs[idx].imageUrl = e.target.value;
                        svcs[idx].image = e.target.value;
                        setData({ ...data, servicesList: svcs });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  {(s.imageUrl || s.image) && (
                    <div className="h-16 rounded-lg overflow-hidden border border-slate-800">
                      <img src={s.imageUrl || s.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={s.description || ''}
                    onChange={(e) => {
                      const svcs = [...data.servicesList];
                      svcs[idx].description = e.target.value;
                      setData({ ...data, servicesList: svcs });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Provide details about this cover design service..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BRIEF FORM FIELDS */}
      {activeTab === 'form-fields' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Book Cover Brief Questionnaire Fields</h3>
          <p className="text-xs text-slate-400">Front cover, back cover, spine, trim size, page count, paper type, interior type, ISBN barcode, typography, mood, and creative freedom choices.</p>

          <div className="space-y-4">
            {(data.questions || []).map((q: any, idx: number) => (
              <div key={q.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400">Field #{idx + 1}: {q.label}</span>
                </div>
                <input
                  type="text"
                  value={Array.isArray(q.options) ? q.options.join(', ') : ''}
                  onChange={(e) => {
                    const qs = [...data.questions];
                    qs[idx].options = e.target.value.split(',').map((s) => s.trim());
                    setData({ ...data, questions: qs });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Options comma separated"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Book Cover Packages</h3>

          <div className="space-y-4">
            {(data.packages || []).map((pkg: any, idx: number) => (
              <div key={pkg.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={pkg.name || ''}
                    onChange={(e) => {
                      const pkgs = [...data.packages];
                      pkgs[idx].name = e.target.value;
                      setData({ ...data, packages: pkgs });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                  <input
                    type="number"
                    value={pkg.price || 0}
                    onChange={(e) => {
                      const pkgs = [...data.packages];
                      pkgs[idx].price = Number(e.target.value);
                      setData({ ...data, packages: pkgs });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={pkg.deliveryTime || ''}
                    onChange={(e) => {
                      const pkgs = [...data.packages];
                      pkgs[idx].deliveryTime = e.target.value;
                      setData({ ...data, packages: pkgs });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROJECTS PIPELINE */}
      {activeTab === 'projects' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Active Author Book Projects ({projects.length})</h3>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">{proj.bookTitle}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">{proj.status}</span>
                </div>
                <p className="text-xs text-slate-400">Author: {proj.authorName || proj.customerName} • {proj.customerEmail} • {proj.publishingPlatform}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVISIONS */}
      {activeTab === 'revisions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Book Cover Revision Requests</h3>
          <p className="text-xs text-slate-400">All customer revision requests, proof updates, and designer notes are managed directly with active project IDs.</p>
        </div>
      )}
    </div>
  );
};
