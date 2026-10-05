import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Mail, Check, RefreshCw, Phone, MapPin, Clock, MessageSquare, Download, Filter } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const ContactUsCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'form-fields' | 'inbox' | 'faq'>('info');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cms, resMsgs] = await Promise.all([
        getCMSData(),
        fetch('/api/contact-messages').catch(() => null),
      ]);
      if (cms.pageContents && cms.pageContents['contact-us']) {
        setData(cms.pageContents['contact-us']);
      } else {
        const resPage = await fetch('/api/page-content/contact-us');
        if (resPage.ok) {
          const json = await resPage.json();
          setData(json);
        }
      }
      if (resMsgs && resMsgs.ok) {
        const msgs = await resMsgs.json();
        setMessages(msgs);
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
        'contact-us': data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      fetch('/api/page-content/contact-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});

      setMessage('Contact Us Page settings updated and permanently saved in Firestore!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error('Error saving Contact Us to Firestore:', e);
      setMessage('Failed to save to Firestore. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Loading Contact Us CMS...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load Contact Us data.</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-2">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Communication CMS</span>
          </div>
          <h2 className="text-2xl font-black text-white">Contact Us Page Management</h2>
          <p className="text-sm text-slate-400">Manage phone, email, address, business hours, WhatsApp link, map embed, contact form fields, customer inbox & FAQs.</p>
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
          { id: 'info', label: 'Contact Info & Map' },
          { id: 'form-fields', label: 'Contact Form Configuration' },
          { id: 'inbox', label: 'Customer Messages Inbox (' + messages.length + ')' },
          { id: 'faq', label: 'Contact FAQs' },
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

      {/* TAB 1: CONTACT INFO & MAP */}
      {activeTab === 'info' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Contact Channels & Map Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={data.contactInfo?.phone || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, phone: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={data.contactInfo?.whatsapp || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, whatsapp: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
              <input
                type="text"
                value={data.contactInfo?.email || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, email: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Business Hours</label>
              <input
                type="text"
                value={data.contactInfo?.businessHours || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, businessHours: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Physical Address</label>
              <textarea
                rows={2}
                value={data.contactInfo?.address || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, address: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Google Maps Embed URL</label>
              <input
                type="text"
                value={data.contactInfo?.mapEmbedUrl || ''}
                onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, mapEmbedUrl: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORM FIELDS */}
      {activeTab === 'form-fields' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Contact Form Configuration</h3>

          <div className="space-y-4">
            {(data.formFields || []).map((f: any, idx: number) => (
              <div key={f.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={f.label || ''}
                    onChange={(e) => {
                      const fields = [...data.formFields];
                      fields[idx].label = e.target.value;
                      setData({ ...data, formFields: fields });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={f.placeholder || ''}
                    onChange={(e) => {
                      const fields = [...data.formFields];
                      fields[idx].placeholder = e.target.value;
                      setData({ ...data, formFields: fields });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INBOX */}
      {activeTab === 'inbox' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Received Customer Inquiries ({messages.length})</h3>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No customer inquiries received yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{msg.name}</span>
                    <span className="text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-500/20">{msg.status || 'New'}</span>
                  </div>
                  <p className="text-xs text-slate-400">{msg.email} • Phone: {msg.phone || 'N/A'} • Service: <span className="text-amber-400 font-bold">{msg.service || 'General'}</span></p>
                  <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800 mt-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Contact Page FAQs</h3>
          <p className="text-xs text-slate-400">Response time expectations, revision policies, and consultation process FAQs are synchronized with the database.</p>
        </div>
      )}
    </div>
  );
};
