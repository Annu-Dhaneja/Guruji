import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  ShoppingBag,
  CheckCircle2,
  Filter,
  Search,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SalesLead, SalesAnalyticsStats } from '../../types';
import { adminFetch } from '../../utils/adminApi';

export const SalesLeadsCMS: React.FC = () => {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        adminFetch('/api/sales-agent/leads').then((r) => (r.ok ? r.json() : null)),
        adminFetch('/api/sales-agent/analytics').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (leadsRes && leadsRes.leads) {
        setLeads(leadsRes.leads);
      }
      if (statsRes) {
        setAnalytics(statsRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await adminFetch(`/api/sales-agent/leads/${leadId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customerPhone.includes(searchTerm) ||
      lead.serviceInterested.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-purple-500/20 p-5 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 via-amber-500 to-teal-400 rounded-2xl text-slate-950">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">AI Sales Assistant Leads & Conversion</h2>
            <p className="text-xs text-slate-400">
              Real-time qualified enquiries, conversion funnel metrics, and client transcripts
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-bold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Conversations</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">{analytics.conversationsCount}</div>
            <div className="text-[10px] text-purple-300 mt-1">
              Voice: {analytics.voiceSessionsCount} | Opened: {analytics.aiOpenedCount}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Qualified Leads</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{analytics.leadsCaptured}</div>
            <div className="text-[10px] text-amber-200 mt-1">
              Recommendations: {analytics.recommendationsGiven}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Checkout Starts</span>
              <ShoppingBag className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-400">{analytics.checkoutStarts}</div>
            <div className="text-[10px] text-teal-200 mt-1">
              Completed: {analytics.completedOrders} orders
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Funnel Conversion</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {Math.min(100, Math.round(((analytics.leadsCaptured + analytics.completedOrders) / (analytics.conversationsCount || 1)) * 100))}%
            </div>
            <div className="text-[10px] text-emerald-200 mt-1">
              Visitor to Lead/Order
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, phone, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['all', 'New', 'Contacted', 'Converted', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Leads' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">WhatsApp / Contact</th>
                <th className="p-4">Interested Service</th>
                <th className="p-4">Budget / Deadline</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No sales leads match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{lead.customerName}</div>
                      <div className="text-[10px] text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        AI Qualified Lead
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-teal-300 font-semibold">{lead.customerPhone}</div>
                      {lead.customerEmail && (
                        <div className="text-[10px] text-slate-400">{lead.customerEmail}</div>
                      )}
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">{lead.serviceInterested}</div>
                      <div className="text-[10px] text-slate-400 truncate">{lead.requirementDetails}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-amber-400 font-bold">{lead.budgetEstimate || 'Standard'}</div>
                      <div className="text-[10px] text-slate-400">{lead.deadline || 'Flexible'}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border outline-none cursor-pointer ${
                          lead.status === 'New'
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                            : lead.status === 'Contacted'
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                            : lead.status === 'Converted'
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <option value="New" className="bg-slate-900 text-amber-400">New</option>
                        <option value="Contacted" className="bg-slate-900 text-indigo-300">Contacted</option>
                        <option value="Converted" className="bg-slate-900 text-emerald-400">Converted</option>
                        <option value="Closed" className="bg-slate-900 text-slate-400">Closed</option>
                      </select>
                    </td>

                    <td className="p-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Direct Call/Chat */}
                        <a
                          href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${lead.customerName}, this is Annu Dhaneja from GurucraftPro. We received your requirement for ${lead.serviceInterested}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 rounded-xl transition-all"
                          title="Open WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* View Details / Transcript */}
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-900 rounded-xl text-[11px] font-bold transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase">AI Sales Lead Details</span>
                <h3 className="text-lg font-bold text-white">{selectedLead.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Phone / WhatsApp:</span>
                <span className="font-mono text-teal-300 font-bold">{selectedLead.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email:</span>
                <span className="text-slate-300">{selectedLead.customerEmail || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Budget:</span>
                <span className="text-amber-400 font-bold">{selectedLead.budgetEstimate || 'Standard'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Timeline:</span>
                <span className="text-slate-300">{selectedLead.deadline || 'Standard'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-purple-300 mb-1">Service & Requirement:</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                <span className="font-bold text-white block mb-1">{selectedLead.serviceInterested}</span>
                {selectedLead.requirementDetails}
              </p>
            </div>

            {/* Chat Transcript */}
            {selectedLead.chatTranscript && selectedLead.chatTranscript.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-purple-300 mb-2">AI Conversation Transcript:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
                  {selectedLead.chatTranscript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg ${
                        t.sender === 'user'
                          ? 'bg-purple-900/30 text-purple-200 border border-purple-800/40 ml-4'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 mr-4'
                      }`}
                    >
                      <span className="font-bold block text-[10px] text-slate-400 mb-0.5 capitalize">
                        {t.sender}:
                      </span>
                      {t.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href={`https://wa.me/${selectedLead.customerPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
