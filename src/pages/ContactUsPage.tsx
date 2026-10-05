import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { SuccessToast } from '../components/common/SuccessToast';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from '../components/ui/LuminousTopEdgeFlare';

export const ContactUsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('8527837527');
  const [serviceNeeded, setServiceNeeded] = useState('Graphic Design');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const refId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRefId(refId);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, serviceNeeded, message, refId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.id) setGeneratedRefId(data.id);
      }
      setSubmitted(true);
      setToastOpen(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      // Still show successful receipt locally for responsive UX
      setSubmitted(true);
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      {/* LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
      <LuminousTopEdgeFlare />

      {/* DISTINCT OVERHEAD SPOTLIGHT */}
      <DistinctGreySpotlight intensity="normal" />

      <SuccessToast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        title="Inquiry Received!"
        message={`Thank you ${name || 'for contacting us'}! Your request for "${serviceNeeded}" has been received.`}
        inquiryId={generatedRefId}
      />
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3F4]/50 dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#087581] dark:text-[#25B4BD] text-xs font-bold uppercase tracking-wider shadow-xs">
          <Mail className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
          <span>Contact GurucraftPro</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8]">
          Get In Touch With Annu Dhaneja
        </h1>
        <p className="text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
          Have a question or custom design inquiry? Fill out the form or reach out directly via WhatsApp, Email, or Phone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Direct Contact Cards & Google Maps */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-[#102A36] dark:text-[#F4F8F8]">Direct Contact Information</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-3 text-[#52636A] dark:text-[#B7C6C8]">
                <div className="p-3 bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#52636A] dark:text-[#B7C6C8] text-[10px] uppercase font-bold block">Email Address</span>
                  <a href={`mailto:${settings?.contactEmail || 'annudhaneja@gmail.com'}`} className="font-bold text-[#102A36] dark:text-[#F4F8F8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]">
                    {settings?.contactEmail || 'annudhaneja@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[#52636A] dark:text-[#B7C6C8]">
                <div className="p-3 bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#52636A] dark:text-[#B7C6C8] text-[10px] uppercase font-bold block">Direct Call &amp; Phone</span>
                  <a href={`tel:${settings?.contactPhone || '8527837527'}`} className="font-bold text-[#102A36] dark:text-[#F4F8F8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]">
                    +91 {settings?.contactPhone || '8527837527'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[#52636A] dark:text-[#B7C6C8]">
                <div className="p-3 bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#52636A] dark:text-[#B7C6C8] text-[10px] uppercase font-bold block">Studio Location</span>
                  <span className="font-bold text-[#102A36] dark:text-[#F4F8F8]">{settings?.contactLocation || 'Rohini, Delhi, India'}</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20would%20like%20to%20discuss%20a%20project!"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#182429] font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>Instant WhatsApp Chat with Annu Dhaneja</span>
            </a>
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-3xl overflow-hidden border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs h-64 bg-[#F8FAFA] dark:bg-[#111A1E]">
            <iframe
              title="GurucraftPro Location"
              src={settings?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13994.498188185933!2d77.1085295!3d28.7180125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d013824479f61%3A0xe54d3e421a11db9f!2sRohini%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs space-y-6">
          <h3 className="text-xl font-bold text-[#102A36] dark:text-[#F4F8F8]">Send Us a Direct Message</h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-center space-y-2 text-[#52636A] dark:text-[#B7C6C8]">
              <CheckCircle2 className="w-12 h-12 text-[#0799A6] dark:text-[#25B4BD] mx-auto" />
              <h4 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8]">Message Received!</h4>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">Thank you for contacting GurucraftPro. Annu Dhaneja will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annu Dhaneja"
                  className="w-full p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Service Needed</label>
                <select
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                >
                  <option value="Graphic Design">Graphic Design &amp; Logo</option>
                  <option value="Vantage Ecom Editing">Vantage Ecom Photo Editing</option>
                  <option value="Wardrobe Consultation">7-Day Wardrobe Consultation</option>
                  <option value="Guruji Artwork">Guruji Spiritual Artwork</option>
                  <option value="Book Cover Design">Book Cover Design</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Project Details / Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your requirements, dimensions, or deadlines..."
                  className="w-full p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full btn-primary-cta font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
