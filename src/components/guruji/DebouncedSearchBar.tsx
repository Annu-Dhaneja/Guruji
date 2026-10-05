import React, { useState, useEffect } from 'react';
import { Search, X, Tag, Sparkles, Filter } from 'lucide-react';

interface DebouncedSearchBarProps {
  value: string;
  onChange: (debouncedValue: string) => void;
  placeholder?: string;
  totalCount: number;
  filteredCount: number;
  activeTags?: string[];
  onTagSelect?: (tag: string) => void;
  debounceMs?: number;
}

const POPULAR_SUGGESTIONS = [
  'Bracelet',
  'Rudraksha',
  'Wallpaper 4K',
  'WhatsApp Stickers',
  'Daily Vachan',
  'Donation',
  'Shukrana Quote',
  'Bookmark',
  'Story Graphic',
  'Golden Lotus',
];

export const DebouncedSearchBar: React.FC<DebouncedSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search products by title, category, tags, mantra, or quotes...',
  totalCount,
  filteredCount,
  activeTags = [],
  onTagSelect,
  debounceMs = 250,
}) => {
  const [localInput, setLocalInput] = useState(value);

  // Sync internal state when external value changes
  useEffect(() => {
    setLocalInput(value);
  }, [value]);

  // Debounce the input propagation
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localInput);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localInput, debounceMs, onChange]);

  const handleClear = () => {
    setLocalInput('');
    onChange('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalInput(suggestion);
    onChange(suggestion);
    if (onTagSelect) {
      onTagSelect(suggestion);
    }
  };

  return (
    <div className="w-full space-y-3" id="guruji-debounced-search-container">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400/80">
          <Search className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-28 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition shadow-inner backdrop-blur-md"
          id="guruji-search-input"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Right side tools */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {localInput ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="Clear search"
              id="clear-search-btn"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          <div className="hidden sm:flex items-center px-2 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-semibold text-neutral-400">
            <span>
              {filteredCount} / {totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-neutral-500 flex items-center gap-1 shrink-0 font-medium pl-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Popular:
        </span>
        {POPULAR_SUGGESTIONS.map((tag) => {
          const isSelected = localInput.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
