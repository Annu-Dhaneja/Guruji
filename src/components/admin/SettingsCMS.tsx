import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, MapPin, Phone, Mail, AlertTriangle, Download, Upload, RefreshCw } from 'lucide-react';
import { SiteSettings } from '../../types';
import { getCMSData, saveCMSSection } from '../../utils';

export const SettingsCMS: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const cms = await getCMSData().catch(() => null);
      if (cms && cms.siteSettings) {
        setSettings(cms.siteSettings);
      } else {
        fetch('/api/site-settings')
          .then((res) => res.json())
          .then((data) => setSettings(data))
          .catch(() => {});
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      // 1. Primary write to Firestore
      await saveCMSSection('siteSettings', settings);

      // 2. Sync server
      fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).catch(() => {});

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Firestore save failed: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `gurucraftpro_backup_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  if (!settings) return <div className="text-purple-400 p-8">Loading Global Settings...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" /> Global Business & Studio Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure contact info, Rohini studio location, Google Maps, maintenance mode, and backups.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4 text-purple-400" /> Backup Database JSON
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Studio Info Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3">Contact & Address Info</h3>

          <div>
            <label className="block text-slate-400 mb-1">Creative Director Name</label>
            <input
              type="text"
              value={settings.contactName}
              onChange={(e) => setSettings({ ...settings, contactName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Studio Location</label>
            <input
              type="text"
              value={settings.contactLocation}
              onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Google Maps Embed URL</label>
            <textarea
              rows={3}
              value={settings.googleMapsEmbedUrl}
              onChange={(e) => setSettings({ ...settings, googleMapsEmbedUrl: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/30"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saveSuccess ? 'Settings Saved Live!' : 'Save Business Settings'}
          </button>
        </div>

        {/* Maintenance Mode & Operational Safety */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Maintenance Mode & Safety
          </h3>

          <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Maintenance Mode Status</div>
                <div className="text-[11px] text-slate-400">When enabled, public visitors see a maintenance page.</div>
              </div>

              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="rounded text-purple-600 w-5 h-5"
              />
            </div>

            {settings.maintenanceMode && (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <div>
                  <label className="block text-slate-400 mb-1">Maintenance Headline</label>
                  <input
                    type="text"
                    value={settings.maintenanceTitle || ''}
                    onChange={(e) => setSettings({ ...settings, maintenanceTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Maintenance Description</label>
                  <input
                    type="text"
                    value={settings.maintenanceDescription || ''}
                    onChange={(e) => setSettings({ ...settings, maintenanceDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
