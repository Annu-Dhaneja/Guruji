import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, User, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { SalesLead } from '../../types';

interface LeadCaptureInlineProps {
  initialService?: string;
  initialRequirement?: string;
  chatTranscript?: { sender: string; text: string }[];
  onSuccess?: (lead: SalesLead) => void;
  onCancel?: () => void;
}

export const LeadCaptureInline: React.FC<LeadCaptureInlineProps> = ({
  initialService = 'General Consultation',
  initialRequirement = '',
  chatTranscript,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService);
  const [details, setDetails] = useState(initialRequirement);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('Standard (2-3 Days)');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please provide a valid WhatsApp / Phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sales-agent/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          serviceInterested: service,
          requirementDetails: details || 'Requirement discussed with AI Sales Assistant.',
          budgetEstimate: budget || undefined,
          deadline,
          chatTranscript,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess(data.lead);
      } else {
        setError(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-center my-3 backdrop-blur-sm animate-fadeIn">
        <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Enquiry Confirmed!</h4>
        <p className="text-xs text-emerald-200 mt-1">
          Thank you, <span className="font-semibold">{name}</span>! Annu Dhaneja and the design team will contact you on WhatsApp ({phone}) shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 border border-purple-500/30 rounded-2xl p-4 my-3 text-slate-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Quick Enquiry & Quote Request</span>
        </div>
        <span className="text-[10px] text-amber-400 font-medium">100% Free & No Spam</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {error && (
          <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg p-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-purple-400" />
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <Phone className="w-3 h-3 text-teal-400" />
              WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <Mail className="w-3 h-3 text-indigo-400" />
              Email (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Preferred Deadline
            </label>
            <select
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Urgent (Today / 24 hrs)">Urgent (Today / 24 hrs)</option>
              <option value="Standard (2-3 Days)">Standard (2-3 Days)</option>
              <option value="Flexible (1 Week)">Flexible (1 Week)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400 mb-1 block">
            Specific Requirement / Note
          </label>
          <textarea
            rows={2}
            placeholder="Describe what you need..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="flex items-center text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <span>Encrypted & private</span>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-amber-500 to-teal-400 text-white font-bold text-xs shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Enquiry</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
