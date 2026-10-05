import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  MoveUp,
  MoveDown,
  Save,
  Check,
  Globe,
  Layers,
  Sparkles,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { PageItem, PageSection, SectionBlockType } from '../../types';

export const PageBuilderCMS: React.FC = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Page Form
  const [newPageName, setNewPageName] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = () => {
    setLoading(true);
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName) return;

    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageName: newPageName,
        pageTitle: newPageTitle || newPageName,
        slug: newPageSlug || newPageName.toLowerCase().replace(/\s+/g, '-'),
        sections: [
          {
            id: 'sec-' + Date.now(),
            type: 'hero',
            title: 'Hero Header Block',
            content: { headline: `Welcome to ${newPageName}`, subtext: 'Custom content block created with GurucraftPro Page Builder' },
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((created) => {
        setPages([created, ...pages]);
        setSelectedPage(created);
        setIsCreatingNew(false);
        setNewPageName('');
        setNewPageTitle('');
        setNewPageSlug('');
      });
  };

  const handleSavePage = () => {
    if (!selectedPage) return;

    fetch(`/api/pages/${selectedPage.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPage),
    })
      .then((res) => res.json())
      .then((updated) => {
        setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
        setSelectedPage(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      });
  };

  const handleDeletePage = (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    fetch(`/api/pages/${id}`, { method: 'DELETE' }).then(() => {
      setPages(pages.filter((p) => p.id !== id));
      if (selectedPage?.id === id) setSelectedPage(null);
    });
  };

  const addSectionBlock = (type: SectionBlockType) => {
    if (!selectedPage) return;
    const newSec: PageSection = {
      id: 'sec-' + Date.now(),
      type,
      title: `${type.toUpperCase()} Section`,
      content: { headline: 'Section Headline', bodyText: 'Sample text block.' },
    };
    setSelectedPage({
      ...selectedPage,
      sections: [...selectedPage.sections, newSec],
    });
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    if (!selectedPage) return;
    const secs = [...selectedPage.sections];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= secs.length) return;
    const temp = secs[idx];
    secs[idx] = secs[targetIdx];
    secs[targetIdx] = temp;
    setSelectedPage({ ...selectedPage, sections: secs });
  };

  const toggleHideSection = (idx: number) => {
    if (!selectedPage) return;
    const secs = [...selectedPage.sections];
    secs[idx].hidden = !secs[idx].hidden;
    setSelectedPage({ ...selectedPage, sections: secs });
  };

  const removeSection = (idx: number) => {
    if (!selectedPage) return;
    const secs = [...selectedPage.sections];
    secs.splice(idx, 1);
    setSelectedPage({ ...selectedPage, sections: secs });
  };

  if (loading) {
    return <div className="text-purple-400 p-8">Loading Page Builder CMS...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" /> Page Builder & Content CMS
          </h2>
          <p className="text-xs text-slate-400">
            Create custom landing pages, edit section layout blocks, and configure page-specific SEO.
          </p>
        </div>
        <button
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      {/* New Page Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Page</h3>
            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Page Name (e.g. Graphic Services)</label>
                <input
                  type="text"
                  required
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Page Title (H1 Header)</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">URL Slug (e.g. /graphic-services)</label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="auto-generated"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main CMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            Website Pages ({pages.length})
          </div>
          <div className="space-y-2">
            {pages.map((p) => {
              const isSelected = selectedPage?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPage(p)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-900/30 border-purple-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-purple-400" /> {p.pageName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === 'Published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(p.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Page Block Editor */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPage ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Page Settings Form */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Editing Page: <span className="text-purple-400">{selectedPage.pageName}</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    URL: https://gurucraftpro.com/{selectedPage.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSavePage}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
                  >
                    {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saveSuccess ? 'Saved Live!' : 'Save Page'}
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Page Display Name</label>
                  <input
                    type="text"
                    value={selectedPage.pageName}
                    onChange={(e) => setSelectedPage({ ...selectedPage, pageName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">H1 Heading Title</label>
                  <input
                    type="text"
                    value={selectedPage.pageTitle}
                    onChange={(e) => setSelectedPage({ ...selectedPage, pageTitle: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={selectedPage.slug}
                    onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Publication Status</label>
                  <select
                    value={selectedPage.status}
                    onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Block Builder Toolbar */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Page Layout Blocks ({selectedPage.sections.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['hero', 'text', 'image', 'service-grid', 'product-grid', 'pricing', 'faq', 'cta'] as SectionBlockType[]).map((blk) => (
                      <button
                        key={blk}
                        onClick={() => addSectionBlock(blk)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-700 rounded-lg text-[10px] text-slate-300 font-medium capitalize transition-all"
                      >
                        + {blk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section List Editor */}
                <div className="space-y-3 pt-2">
                  {selectedPage.sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className={`p-4 rounded-xl border transition-all ${
                        sec.hidden ? 'opacity-50 bg-slate-900 border-slate-800' : 'bg-slate-800/60 border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-500/20 text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                            {sec.type}
                          </span>
                          <input
                            type="text"
                            value={sec.title || ''}
                            onChange={(e) => {
                              const secs = [...selectedPage.sections];
                              secs[idx].title = e.target.value;
                              setSelectedPage({ ...selectedPage, sections: secs });
                            }}
                            placeholder="Block Title"
                            className="bg-transparent border-b border-slate-700 text-white font-semibold text-xs focus:border-purple-400 outline-none px-1 py-0.5"
                          />
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <button onClick={() => moveSection(idx, 'up')} className="p-1 hover:text-white">
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveSection(idx, 'down')} className="p-1 hover:text-white">
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleHideSection(idx)} className="p-1 hover:text-white">
                            {sec.hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => removeSection(idx)} className="p-1 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content JSON or Quick Editable Text */}
                      <div className="text-xs space-y-2 mt-2">
                        <div>
                          <label className="block text-[10px] text-slate-400">Headline Text</label>
                          <input
                            type="text"
                            value={sec.content?.headline || ''}
                            onChange={(e) => {
                              const secs = [...selectedPage.sections];
                              secs[idx].content = { ...secs[idx].content, headline: e.target.value };
                              setSelectedPage({ ...selectedPage, sections: secs });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
              <p className="text-sm">Select a page from the left list or create a new page to edit block layouts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
