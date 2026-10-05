import React, { useState } from 'react';
import { X, User, Mail, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, name, phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] space-y-6 shadow-2xl relative animate-in fade-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#2A3C40] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#DDF3F4]/50 dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] mx-auto flex items-center justify-center text-[#0799A6] dark:text-[#25B4BD] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">Sign In to GurucraftPro</h3>
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">Access your digital downloads, orders, and design files.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1.5">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#52636A] dark:text-[#B7C6C8] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Annu Dhaneja"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#52636A] dark:text-[#B7C6C8] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1.5">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#52636A] dark:text-[#B7C6C8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="8527837527"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl btn-primary-cta font-bold text-xs shadow-md transition-all active:scale-98"
          >
            Continue to Account
          </button>
        </form>

      </div>
    </div>
  );
};
