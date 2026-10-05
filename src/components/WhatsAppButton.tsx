import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(
    'Hello Annu Dhaneja! I came from GurucraftPro website and I am interested in your design / e-commerce / spiritual artwork services.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2 group cursor-pointer"
      title="Chat with Annu Dhaneja on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366] group-hover:scale-105 transition-transform" />
      <span className="hidden md:inline text-xs font-bold pr-1">WhatsApp Studio</span>
    </a>
  );
};
