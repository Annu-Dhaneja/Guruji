import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, CornerDownRight, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { WardrobeClothingItem, QuickStyleProfile, DayOutfitPlan, WardrobeChatMessage } from '../../types';

interface AskWardrobeAiChatProps {
  wardrobe: WardrobeClothingItem[];
  profile: QuickStyleProfile;
  currentPlan?: DayOutfitPlan[];
}

export const AskWardrobeAiChat: React.FC<AskWardrobeAiChatProps> = ({
  wardrobe,
  profile,
  currentPlan,
}) => {
  const [messages, setMessages] = useState<WardrobeChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I'm Annu Dhaneja's AI Capsule Stylist. I have full knowledge of the ${wardrobe.length} clothing items in your wardrobe inventory. Ask me anything about what to wear, how to restyle an item, or how to elevate tomorrow's look!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outfitTip: 'Tip: You can ask about specific items like your shirts or trousers to see fresh combinations.',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'What should I wear tomorrow?',
    'Make my Monday outfit more stylish',
    'I have black jeans, what can I wear with it?',
    'I have a casual weekend event',
    'How can I use my white shirt differently?',
    'What should I buy next to maximize outfits?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: WardrobeChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/wardrobe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          items: wardrobe,
          profile,
          currentPlan,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg: WardrobeChatMessage = {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          outfitTip: data.outfitTip,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Chat failed');
      }
    } catch (err) {
      const fallbackMsg: WardrobeChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: `Based on your wardrobe inventory, pairing your crisp top with neutral trousers creates an immediate balanced silhouette for ${profile.lifestyle}. You have versatile pieces that pair effortlessly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        outfitTip: 'Roll the cuffs and ensure your belt or footwear provides clean visual grounding.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-amber-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>Ask Your Wardrobe AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Stylist advice customized specifically to your {wardrobe.length} uploaded clothes
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Capsule AI Active</span>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-6 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 shrink-0">Try asking:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:border-amber-500 hover:text-amber-500 border border-slate-200 dark:border-slate-700 shrink-0 transition-colors whitespace-nowrap shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold rounded-tr-none shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{m.text}</div>

              {m.outfitTip && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-amber-500 flex items-start space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{m.outfitTip}</span>
                </div>
              )}

              <div
                className={`text-[9px] font-medium text-right ${
                  m.sender === 'user' ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-amber-500 bg-amber-500/10 p-3 rounded-2xl w-fit border border-amber-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-semibold">Stylist Annu is curating pairings from your wardrobe...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about tomorrow's look, restyling, or occasion pairings..."
            className="flex-1 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-amber-400 transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
