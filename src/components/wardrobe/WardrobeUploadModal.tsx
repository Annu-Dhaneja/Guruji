import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, AlertCircle, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { WardrobeClothingItem, ClothingCategory } from '../../types';

interface WardrobeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: WardrobeClothingItem) => void;
  editingItem?: WardrobeClothingItem | null;
}

const CATEGORIES: ClothingCategory[] = [
  'Shirt',
  'T-Shirt',
  'Top',
  'Jeans',
  'Trousers',
  'Kurta',
  'Saree',
  'Jacket',
  'Shoes',
  'Accessories',
  'Other',
];

const PATTERNS = ['Solid', 'Striped', 'Checked', 'Floral', 'Printed', 'Textured', 'Knit', 'Embroidered'];
const STYLES = ['Minimal', 'Classic', 'Smart Casual', 'Trendy', 'Streetwear', 'Traditional', 'Mix'];
const OCCASIONS = ['Daily', 'Office', 'Casual', 'Party', 'Meeting', 'Travel', 'Wedding', 'Mixed'];
const SEASONS = ['All Season', 'Summer', 'Winter', 'Monsoon', 'Spring/Autumn'];
const FITS = ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Tailored'];

export const WardrobeUploadModal: React.FC<WardrobeUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(editingItem?.name || '');
  const [category, setCategory] = useState<ClothingCategory>(editingItem?.category || 'Shirt');
  const [color, setColor] = useState(editingItem?.color || 'White');
  const [pattern, setPattern] = useState(editingItem?.pattern || 'Solid');
  const [style, setStyle] = useState(editingItem?.style || 'Smart Casual');
  const [occasion, setOccasion] = useState(editingItem?.occasion || 'Office');
  const [season, setSeason] = useState(editingItem?.season || 'All Season');
  const [fit, setFit] = useState(editingItem?.fit || 'Regular');
  const [isFavourite, setIsFavourite] = useState(editingItem?.isFavourite || false);
  const [imageUrl, setImageUrl] = useState(
    editingItem?.imageUrl ||
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80'
  );
  const [notes, setNotes] = useState(editingItem?.notes || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number>(editingItem?.confidence || 0.95);
  const [aiClarificationNeeded, setAiClarificationNeeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setColor(editingItem.color);
      setPattern(editingItem.pattern);
      setStyle(editingItem.style);
      setOccasion(editingItem.occasion);
      setSeason(editingItem.season);
      setFit(editingItem.fit);
      setIsFavourite(editingItem.isFavourite);
      setImageUrl(editingItem.imageUrl);
      setNotes(editingItem.notes || '');
      setConfidence(editingItem.confidence || 0.95);
      setAiClarificationNeeded(false);
    } else {
      setName('');
      setCategory('Shirt');
      setColor('White');
      setPattern('Solid');
      setStyle('Smart Casual');
      setOccasion('Office');
      setSeason('All Season');
      setFit('Regular');
      setIsFavourite(false);
      setImageUrl('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80');
      setNotes('');
      setConfidence(0.95);
      setAiClarificationNeeded(false);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP). Executables are forbidden.');
      return;
    }
    // Validate file size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file is too large. Please select a photo under 10MB.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageUrl(dataUrl);

      // Trigger AI Analysis
      setIsAnalyzing(true);
      setAiClarificationNeeded(false);

      try {
        const res = await fetch('/api/wardrobe/analyze-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: dataUrl,
            filename: file.name,
          }),
        });

        const data = await res.json();
        if (data.success && data.item) {
          const item = data.item;
          setName(item.name || file.name.replace(/\.[^/.]+$/, ''));
          if (item.category && CATEGORIES.includes(item.category as ClothingCategory)) {
            setCategory(item.category as ClothingCategory);
          }
          if (item.color) setColor(item.color);
          if (item.pattern) setPattern(item.pattern);
          if (item.style) setStyle(item.style);
          if (item.occasion) setOccasion(item.occasion);
          if (item.season) setSeason(item.season);
          if (item.fit) setFit(item.fit);
          if (item.notes) setNotes(item.notes);
          setConfidence(item.confidence || 0.85);

          if (item.confidence < 0.75) {
            setAiClarificationNeeded(true);
          }
        }
      } catch (err) {
        console.error('Error analyzing image:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please provide an item name.');
      return;
    }

    const item: WardrobeClothingItem = {
      id: editingItem?.id || 'w-item-' + Date.now(),
      name: name.trim(),
      category,
      color: color.trim() || 'Neutral',
      pattern,
      style,
      occasion,
      season,
      fit,
      isFavourite,
      imageUrl,
      notes: notes.trim(),
      confidence,
      aiIdentified: true,
      addedAt: editingItem?.addedAt || new Date().toISOString(),
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Wardrobe Piece' : 'Add Clothes to Wardrobe'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI detects item attributes. You can review and adjust any field.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 p-5 text-center transition-all hover:border-amber-500/60"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-amber-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-1" />
                    <span className="text-[10px] font-bold">Analyzing...</span>
                  </div>
                )}
              </div>

              {/* Upload CTA */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Upload Garment Photo
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Drag & drop your shirt, dress, trousers or shoe photo (JPG, PNG, max 10MB)
                </p>
                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors inline-flex items-center space-x-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                  </button>
                  {isAnalyzing && (
                    <span className="text-[11px] text-amber-500 font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 animate-spin" />
                      <span>AI Detecting Garment...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Clarification Notice if Confidence is Lower */}
          {aiClarificationNeeded && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Clothing recognition has multiple possible matches. Please verify the category and color below.
              </span>
            </div>
          )}

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crisp White Linen Oxford Shirt"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Category Quick Select Chips */}
            <div className="sm:col-span-2 space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Select Category *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      category === cat
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Primary Colour
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue, Olive, White, Black"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Pattern */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Pattern
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              >
                {PATTERNS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Style Vibe
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Fit */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Silhouette / Fit
              </label>
              <select
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              >
                {FITS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Favourite Toggle */}
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="fav-check"
                checked={isFavourite}
                onChange={(e) => setIsFavourite(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="fav-check" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Mark as Go-to Wardrobe Favourite
              </label>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Styling Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Looks great when layered or tucked into high-rise pants"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 transition-opacity flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? 'Save Changes' : 'Add to My Wardrobe'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
