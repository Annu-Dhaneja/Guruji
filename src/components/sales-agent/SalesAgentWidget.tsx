import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  PhoneCall,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { SalesChatMessage, SalesRecommendation } from '../../types';
import { SalesRecommendationCard } from './SalesRecommendationCard';
import { VoiceVisualizer } from './VoiceVisualizer';
import { LeadCaptureInline } from './LeadCaptureInline';

interface SalesAgentWidgetProps {
  onNavigate?: (page: string, slug?: string) => void;
  onProceedToCheckout?: () => void;
}

export const SalesAgentWidget: React.FC<SalesAgentWidgetProps> = ({
  onNavigate,
  onProceedToCheckout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'Hindi' | 'Hinglish' | 'English'>('Hinglish');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const initialWelcome: SalesChatMessage = {
    id: 'msg-welcome-1',
    sender: 'agent',
    text: 'Namaste! Welcome to GurucraftPro. Main aapka AI Sales Consultant hoon. Aap apne business, wardrobe styling, ya creative design requirement ke baare mein bata sakte hain — I will help you find the best solution.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    languageDetected: 'Hinglish',
    intent: 'discovery',
  };

  const [messages, setMessages] = useState<SalesChatMessage[]>([initialWelcome]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, showLeadForm]);

  // Initialize Speech Recognition (Free-First Browser API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeLanguage]);

  // Text-To-Speech Output
  const speakText = (text: string, lang: 'Hindi' | 'Hinglish' | 'English' = 'Hinglish') => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Strip emojis and code symbols for cleaner pronunciation
    const cleanText = text.replace(/[*_~`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best available Indian / Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'Hindi') {
      const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const indVoice = voices.find(
        (v) => v.lang.startsWith('en-IN') || v.name.includes('India') || v.name.includes('Google UK')
      );
      if (indVoice) utterance.voice = indVoice;
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    setHasUnread(false);
    // Track open analytics
    fetch('/api/sales-agent/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: 'ai_opened' }),
    }).catch(() => {});
  };

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      if (liveTranscript.trim()) {
        handleSendMessage(liveTranscript);
        setLiveTranscript('');
      }
    } else {
      setIsVoiceMode(true);
      setLiveTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = activeLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
          fetch('/api/sales-agent/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName: 'voice_started' }),
          }).catch(() => {});
        } catch (e) {
          console.warn('Speech start error:', e);
        }
      }
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    handleStopSpeaking();
    setInputMessage('');
    setLiveTranscript('');

    const userMsg: SalesChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/sales-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const agentMsg: SalesChatMessage = {
          id: 'agt-' + Date.now(),
          sender: 'agent',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          languageDetected: data.languageDetected,
          recommendedServices: data.recommendedServices,
          leadCapturePrompt: data.leadCapturePrompt,
          actionType: data.actionType,
          actionPayload: data.actionPayload,
          intent: data.intent,
        };

        if (data.languageDetected) {
          setActiveLanguage(data.languageDetected);
        }

        setMessages((prev) => [...prev, agentMsg]);

        // Auto trigger speech in voice mode
        if (isVoiceMode || !isMuted) {
          speakText(data.reply, data.languageDetected);
        }

        // If lead capture was explicitly triggered
        if (data.leadCapturePrompt || data.intent === 'high_intent') {
          setShowLeadForm(true);
        }
      } else {
        throw new Error(data.error || 'Failed to process response');
      }
    } catch (err) {
      const fallbackMsg: SalesChatMessage = {
        id: 'agt-err-' + Date.now(),
        sender: 'agent',
        text: 'Samajh gaya! Aap GurucraftPro par custom logo, Amazon product editing, ya capsule wardrobe plan kar sakte hain. Aap direct WhatsApp par bhi Annu Dhaneja ji se connect kar sakte hain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        languageDetected: 'Hinglish',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleResetChat = () => {
    handleStopSpeaking();
    setMessages([initialWelcome]);
    setShowLeadForm(false);
    setInputMessage('');
    setLiveTranscript('');
  };

  const handleInstantCheckout = (rec: SalesRecommendation, pkg?: any) => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER PILL ================= */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
        >
          {/* Quick Voice Shortcut */}
          <button
            type="button"
            onClick={() => {
              handleOpenWidget();
              setTimeout(() => handleToggleVoice(), 300);
            }}
            className="w-12 h-12 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:border-[#F5A39A] dark:hover:border-[#F2A39A] flex items-center justify-center shadow-lg transition-all hover:scale-105 group backdrop-blur-xs"
            title="Start Voice Consultation"
          >
            <Mic className="w-5 h-5 group-hover:scale-110 text-[#F5A39A] dark:text-[#F2A39A] transition-transform" />
          </button>

          {/* Main Launcher Button */}
          <button
            type="button"
            onClick={handleOpenWidget}
            className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-[#102A36] dark:text-[#F4F8F8] font-bold shadow-xl transition-all hover:scale-103 active:scale-95 border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] group"
          >
            <div className="relative w-7 h-7 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] flex items-center justify-center shadow-xs overflow-hidden">
              <img
                src="/favicon.png"
                alt="AI Sales"
                className="w-5 h-5 object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0799A6] dark:bg-[#25B4BD] rounded-full animate-ping" />
              )}
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                <span>AI Sales Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] text-[#52636A] dark:text-[#B7C6C8] font-medium">
                Find Service • Instant Quote • Hindi / Eng
              </div>
            </div>

            <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] hidden sm:block" />
          </button>
        </motion.div>
      )}

      {/* ================= MAIN EXPANDABLE SALES AGENT MODAL / DRAWER ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 bg-[#FFFFFF] dark:bg-[#0B1114] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl shadow-2xl flex flex-col text-[#102A36] dark:text-[#F4F8F8] overflow-hidden ${
              isExpanded
                ? 'inset-4 sm:inset-10 max-w-5xl mx-auto h-[90vh]'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh]'
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#182429] border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] p-0.5 shadow-xs shrink-0">
                  <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#111A1E] rounded-[14px] flex items-center justify-center overflow-hidden">
                    <img
                      src="/favicon.png"
                      alt="AI Sales Agent"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#102A36] dark:text-[#F4F8F8] flex items-center gap-1.5">
                      GurucraftPro AI Assistant
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52636A] dark:text-[#B7C6C8] truncate">
                    Tell me what you need — I'll help you find the right solution.
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                {/* Voice Mute Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    handleStopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  className={`p-1.5 rounded-xl border text-xs transition-colors ${
                    isMuted
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : 'bg-[#F8FAFA] dark:bg-[#111A1E] border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8]'
                  }`}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio Output'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Reset Conversation */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors"
                  title="New Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Expand / Shrink */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors hidden sm:block"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    handleStopSpeaking();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language & Voice State Indicator Strip */}
            <div className="bg-[#F8FAFA] dark:bg-[#0B1114] px-4 py-1.5 border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between text-[11px] text-[#52636A] dark:text-[#B7C6C8] shrink-0">
              <div className="flex items-center gap-1.5">
                <span>Languages:</span>
                <span className="font-semibold text-[#0799A6] dark:text-[#25B4BD]">Hindi • Hinglish • English</span>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeaking}
                    className="text-[10px] text-amber-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Speaking... (Stop)</span>
                  </button>
                )}
                <span className="text-[10px] text-[#52636A] dark:text-[#B7C6C8]">100% Free &amp; Real Prices</span>
              </div>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#F5A39A] dark:bg-[#F2A39A] text-[#102A36] dark:text-[#0B1114] font-medium rounded-br-xs'
                        : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#102A36] dark:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Language Badge */}
                    {msg.languageDetected && msg.sender === 'agent' && (
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#52636A] dark:text-[#B7C6C8]">
                        <span className="text-[#0799A6] dark:text-[#25B4BD] font-medium">
                          {msg.languageDetected}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* Render Recommended Services Card */}
                  {msg.recommendedServices && msg.recommendedServices.length > 0 && (
                    <div className="w-full max-w-full space-y-2 mt-2">
                      {msg.recommendedServices.map((rec) => (
                        <SalesRecommendationCard
                          key={rec.id}
                          recommendation={rec}
                          onNavigate={onNavigate}
                          onInstantCheckout={handleInstantCheckout}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Inline Lead Capture Form */}
              {showLeadForm && (
                <LeadCaptureInline
                  chatTranscript={messages.map((m) => ({ sender: m.sender, text: m.text }))}
                  onSuccess={() => setShowLeadForm(false)}
                  onCancel={() => setShowLeadForm(false)}
                />
              )}

              {/* AI Typing / Thinking State */}
              {isLoading && (
                <div className="flex items-center space-x-2 bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl px-4 py-3 w-fit shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0799A6] dark:bg-[#25B4BD] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#F5A39A] dark:bg-[#F2A39A] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#52636A] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[#52636A] dark:text-[#B7C6C8] ml-2 font-medium">Finding best options...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-[#F8FAFA] dark:bg-[#111A1E] border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => handleQuickPrompt('Mujhe business ke liye Logo aur Visiting Card chahiye')}
                className="text-[11px] whitespace-nowrap bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] px-3 py-1 rounded-full transition-all"
              >
                🎨 Logo &amp; Visiting Cards
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Amazon ke liye product white background removal price kya hai?')}
                className="text-[11px] whitespace-nowrap bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] px-3 py-1 rounded-full transition-all"
              >
                📦 Amazon White BG (₹499)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('7-Day Capsule Wardrobe Consultation ke baare mein batao')}
                className="text-[11px] whitespace-nowrap bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] px-3 py-1 rounded-full transition-all"
              >
                👗 Capsule Wardrobe (₹1,499)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Amazon KDP Paperback & Kindle Book Cover details')}
                className="text-[11px] whitespace-nowrap bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] px-3 py-1 rounded-full transition-all"
              >
                📖 Book Cover (₹1,299)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Main direct checkout kahan se kar sakta hoon?')}
                className="text-[11px] whitespace-nowrap bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] px-3 py-1 rounded-full transition-all"
              >
                🛒 Checkout Kaise Karein?
              </button>
            </div>

            {/* Voice Waveform Visualizer & Live Transcript */}
            {(isListening || liveTranscript) && (
              <div className="px-4 py-2.5 bg-[#F8FAFA] dark:bg-[#0B1114] border-t border-[#DCE7E7] dark:border-[#2A3C40] flex flex-col items-center gap-2 shrink-0">
                <VoiceVisualizer isListening={isListening} isSpeaking={isSpeaking} muted={isMuted} />
                {liveTranscript && (
                  <p className="text-xs text-[#0799A6] dark:text-[#25B4BD] font-medium italic text-center max-w-md line-clamp-2">
                    "{liveTranscript}"
                  </p>
                )}
              </div>
            )}

            {/* Input Form & Tactile Voice Button */}
            <div className="p-3 bg-[#FFFFFF] dark:bg-[#182429] border-t border-[#DCE7E7] dark:border-[#2A3C40] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Tactile Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`relative p-3 rounded-2xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-lg ring-4 ring-rose-500/20 scale-105 animate-pulse'
                      : 'btn-primary-cta shadow-xs hover:brightness-105'
                  }`}
                  title={isListening ? 'Stop Listening & Send' : 'Speak with AI Sales Consultant'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  placeholder="Type or speak (e.g. 'Mujhe logo aur card chahiye')..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#102A36] dark:text-[#F4F8F8] placeholder-[#52636A]/60 focus:outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 rounded-2xl btn-primary-cta disabled:opacity-40 font-bold transition-all shadow-xs"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
