import {
  WardrobeClothingItem,
  QuickStyleProfile,
  DayOutfitPlan,
  WardrobeGapAnalysis,
  FamilyProfile,
  ClothConsultationInput,
  ClothConsultationResult,
  Item3LooksResult,
  TravelPlannerInput,
  TravelPackingPlan,
  BuyOrDontBuyAnalysis,
  WardrobeInsightsStats,
} from '../types';

export const defaultFamilyProfiles: FamilyProfile[] = [
  {
    id: 'prof-me',
    name: 'Me (Primary)',
    relation: 'Me',
    ageGroup: 'Adult',
    preferredStyle: 'Smart Casual & Minimal',
    sizeInfo: 'Medium / 32W',
    comfortPreference: 'Normal',
    favoriteColors: ['Navy Blue', 'White', 'Beige', 'Black'],
    commonOccasions: ['Office', 'Meeting', 'Casual Outing', 'Dinner'],
    avatarEmoji: '👩',
  },
  {
    id: 'prof-child',
    name: 'Aarav (Child)',
    relation: 'Child',
    ageGroup: 'Child',
    preferredStyle: 'Playful, Cotton & Sporty',
    sizeInfo: 'Age 7-8 / Kids L',
    comfortPreference: 'Extra Comfortable',
    favoriteColors: ['Sky Blue', 'Yellow', 'Olive'],
    commonOccasions: ['School', 'Park / Play', 'Family Function', 'Daily Wear'],
    avatarEmoji: '👧',
  },
  {
    id: 'prof-partner',
    name: 'Rohan (Partner)',
    relation: 'Partner',
    ageGroup: 'Adult',
    preferredStyle: 'Classic Work & Relaxed Weekend',
    sizeInfo: 'Large / 34W',
    comfortPreference: 'Normal',
    favoriteColors: ['Charcoal Grey', 'Navy Blue', 'Olive Green', 'White'],
    commonOccasions: ['Office', 'Work From Home', 'Travel', 'Party'],
    avatarEmoji: '👨',
  },
  {
    id: 'prof-parent',
    name: 'Dadaji / Senior',
    relation: 'Senior',
    ageGroup: 'Senior',
    preferredStyle: 'Traditional Kurta & Breathable Cotton',
    sizeInfo: 'Regular / XL',
    comfortPreference: 'Ultra Soft / Loose',
    favoriteColors: ['White', 'Light Cream', 'Pastel Sky Blue'],
    commonOccasions: ['Morning Walk', 'Puja / Festival', 'Home / Comfortable', 'Family Gathering'],
    avatarEmoji: '👴',
  },
];

export const sampleWardrobeItems: WardrobeClothingItem[] = [
  {
    id: 'w-item-1',
    name: 'Crisp White Oxford Shirt',
    category: 'Shirt',
    color: 'White',
    pattern: 'Solid',
    style: 'Classic',
    occasion: 'Office',
    season: 'All Season',
    fit: 'Tailored',
    isFavourite: true,
    status: 'Available',
    rewearCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    notes: 'Premium 100% breathable cotton, staple for work and weekend layering.',
    aiIdentified: true,
    confidence: 0.96,
  },
  {
    id: 'w-item-2',
    name: 'Tailored Navy Blue Trousers',
    category: 'Trousers',
    color: 'Navy Blue',
    pattern: 'Solid',
    style: 'Minimal',
    occasion: 'Office',
    season: 'All Season',
    fit: 'Slim',
    isFavourite: true,
    status: 'Available',
    rewearCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80',
    notes: 'Ankle-length slim fit trousers with clean drape.',
    aiIdentified: true,
    confidence: 0.94,
  },
  {
    id: 'w-item-3',
    name: 'Washed Black Straight Jeans',
    category: 'Jeans',
    color: 'Black',
    pattern: 'Solid',
    style: 'Smart Casual',
    occasion: 'Casual',
    season: 'All Season',
    fit: 'Regular',
    isFavourite: true,
    status: 'Available',
    rewearCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    notes: 'Non-distressed clean black denim, highly versatile.',
    aiIdentified: true,
    confidence: 0.95,
  },
  {
    id: 'w-item-4',
    name: 'Olive Earthy Crewneck T-Shirt',
    category: 'T-Shirt',
    color: 'Olive Green',
    pattern: 'Solid',
    style: 'Minimal',
    occasion: 'Daily',
    season: 'Summer',
    fit: 'Regular',
    isFavourite: false,
    status: 'Available',
    rewearCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    notes: 'Heavyweight organic cotton in muted earth tone.',
    aiIdentified: true,
    confidence: 0.92,
  },
  {
    id: 'w-item-5',
    name: 'Unstructured Beige Linen Blazer',
    category: 'Jacket',
    color: 'Beige',
    pattern: 'Textured',
    style: 'Smart Casual',
    occasion: 'Meeting',
    season: 'Spring/Autumn',
    fit: 'Tailored',
    isFavourite: true,
    status: 'Available',
    rewearCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    notes: 'Lightweight linen blend, adds instant polish without feeling stiff.',
    aiIdentified: true,
    confidence: 0.91,
  },
  {
    id: 'w-item-6',
    name: 'Clean White Minimalist Sneakers',
    category: 'Shoes',
    color: 'White',
    pattern: 'Solid',
    style: 'Minimal',
    occasion: 'Daily',
    season: 'All Season',
    fit: 'Regular',
    isFavourite: true,
    status: 'Available',
    rewearCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    notes: 'Low-top leather sneakers with sleek silhouette.',
    aiIdentified: true,
    confidence: 0.98,
  },
  {
    id: 'w-item-7',
    name: 'Burnished Tan Leather Loafers',
    category: 'Shoes',
    color: 'Tan Brown',
    pattern: 'Solid',
    style: 'Classic',
    occasion: 'Office',
    season: 'All Season',
    fit: 'Regular',
    isFavourite: false,
    status: 'Available',
    rewearCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
    notes: 'Penny loafers with leather sole, elevates any trousers.',
    aiIdentified: true,
    confidence: 0.93,
  },
  {
    id: 'w-item-8',
    name: 'Fine Knit Charcoal Crewneck',
    category: 'Top',
    color: 'Charcoal Grey',
    pattern: 'Knit',
    style: 'Smart Casual',
    occasion: 'Daily',
    season: 'Winter',
    fit: 'Slim',
    isFavourite: false,
    status: 'Available',
    rewearCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    notes: 'Merino wool blend, great standalone or layered under blazers.',
    aiIdentified: true,
    confidence: 0.9,
  },
  {
    id: 'w-item-9',
    name: 'Beige Relaxed Chino Trousers',
    category: 'Trousers',
    color: 'Beige',
    pattern: 'Solid',
    style: 'Smart Casual',
    occasion: 'Casual',
    season: 'All Season',
    fit: 'Relaxed',
    isFavourite: false,
    status: 'Available',
    rewearCount: 1,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    notes: 'Mid-rise stretch cotton chinos for casual Fridays or brunch.',
    aiIdentified: true,
    confidence: 0.93,
  },
  {
    id: 'w-item-10',
    name: 'Modern Cotton Linen Kurta',
    category: 'Kurta',
    color: 'Pastel Sky Blue',
    pattern: 'Solid',
    style: 'Traditional',
    occasion: 'Casual',
    season: 'Summer',
    fit: 'Relaxed',
    isFavourite: true,
    status: 'Available',
    rewearCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    notes: 'Mandarin collar short kurta in breathable summer weave.',
    aiIdentified: true,
    confidence: 0.94,
  },
  {
    id: 'w-item-11',
    name: 'Matte Black Leather Chronograph',
    category: 'Watch',
    color: 'Black / Silver',
    pattern: 'Solid',
    style: 'Minimal',
    occasion: 'Daily',
    season: 'All Season',
    fit: 'Regular',
    isFavourite: true,
    status: 'Available',
    rewearCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    notes: 'Minimalist 40mm dial on Italian black calfskin band.',
    aiIdentified: true,
    confidence: 0.97,
  },
  {
    id: 'w-item-12',
    name: 'Structured Espresso Leather Messenger',
    category: 'Bag',
    color: 'Dark Brown',
    pattern: 'Solid',
    style: 'Classic',
    occasion: 'Office',
    season: 'All Season',
    fit: 'Regular',
    isFavourite: false,
    status: 'Available',
    rewearCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    notes: 'Padded 14-inch laptop compartment with antique brass buckles.',
    aiIdentified: true,
    confidence: 0.91,
  },
];

export const defaultStyleProfile: QuickStyleProfile = {
  lifestyle: 'Office',
  preferredStyle: 'Smart Casual',
  outfitType: 'Office',
  colorStyle: 'Neutral',
  city: 'Delhi NCR',
  weatherPreference: 'Normal',
  targetOccasion: 'Office',
  budget: '₹2,500',
  languagePreference: 'Hinglish',
};

// Filter only clean, available clothes
export function getAvailableWardrobe(items: WardrobeClothingItem[]): WardrobeClothingItem[] {
  return (items || []).filter((item) => item?.status !== 'Laundry');
}

/**
 * Dynamically computes total realistic outfit combinations possible from the wardrobe.
 * e.g., "12 Pieces • 28 Possible Looks"
 */
export function calculatePossibleLooks(items: WardrobeClothingItem[]): number {
  if (!items || items.length === 0) return 0;
  const tops = items.filter((i) => ['Shirt', 'T-Shirt', 'Top'].includes(i.category)).length;
  const bottoms = items.filter((i) => ['Jeans', 'Trousers', 'Shorts', 'Skirt'].includes(i.category)).length;
  const onePieces = items.filter((i) => ['Kurta', 'Saree', 'Dress', 'Ethnic Wear'].includes(i.category)).length;
  const shoes = Math.max(1, items.filter((i) => i.category === 'Shoes').length);
  const layers = Math.max(1, items.filter((i) => i.category === 'Jacket').length);

  const baseCombos = Math.max(1, tops) * Math.max(1, bottoms) * shoes;
  const ethnicCombos = onePieces * shoes;
  const layeredVariations = Math.min(baseCombos, layers * (tops + bottoms));

  const total = baseCombos + ethnicCombos + layeredVariations;
  return Math.max(items.length, Math.min(total, 48));
}

/**
 * Calculates a clean Rewear Score (1 to 5) and versatility count for an item.
 */
export function getItemRewearScore(
  item: WardrobeClothingItem,
  allItems: WardrobeClothingItem[] = []
): { score: number; maxScore: number; looksCount: number; description: string } {
  if (!item) {
    return { score: 4, maxScore: 5, looksCount: 4, description: 'Versatile piece across multiple looks.' };
  }

  const category = item.category || 'Shirt';
  let looksCount = 4;
  let score = 4;

  if (['Shirt', 'T-Shirt', 'Top'].includes(category)) {
    const bottomsCount = (allItems || []).filter((i) => ['Jeans', 'Trousers', 'Shorts', 'Skirt'].includes(i?.category)).length;
    looksCount = Math.max(3, bottomsCount + 1);
    score = looksCount >= 5 ? 5 : 4;
  } else if (['Jeans', 'Trousers'].includes(category)) {
    const topsCount = (allItems || []).filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i?.category)).length;
    looksCount = Math.max(4, topsCount + 1);
    score = 5;
  } else if (['Shoes'].includes(category)) {
    looksCount = Math.max(5, Math.min(7, Math.floor((allItems || []).length / 2)));
    score = 5;
  } else if (['Jacket'].includes(category)) {
    looksCount = 4;
    score = 4;
  } else if (['Kurta', 'Saree'].includes(category)) {
    looksCount = 3;
    score = 4;
  } else {
    looksCount = 3;
    score = 3;
  }

  const description = `This ${category.toLowerCase()} can create ${looksCount} different looks.`;
  return { score, maxScore: 5, looksCount, description };
}

/**
 * Returns clothes that have low rewear frequency or have been under-utilized recently.
 */
export function getForgottenItems(items: WardrobeClothingItem[], limit = 3): WardrobeClothingItem[] {
  if (!items || items.length === 0) return [];
  // Sort by lowest rewearCount or status
  const sorted = [...items].sort((a, b) => (a.rewearCount || 0) - (b.rewearCount || 0));
  return sorted.slice(0, limit);
}

/**
 * One-Piece Fix Suggestion
 * Recommends ONE simple versatile accessory/piece to maximize existing outfits without shopping.
 */
export function getOnePieceFixSuggestion(
  outfitItems: WardrobeClothingItem[],
  wardrobe: WardrobeClothingItem[]
): {
  missingPiece: string;
  percentage: number;
  suggestionText: string;
  reason: string;
} {
  const hasWatch = outfitItems?.some((i) => i.category === 'Watch' || i.category === 'Accessories');
  const hasBeltOrBag = outfitItems?.some((i) => i.category === 'Bag' || i.category === 'Accessories');
  const hasJacket = outfitItems?.some((i) => i.category === 'Jacket');

  if (!hasBeltOrBag) {
    return {
      missingPiece: 'Beige or Tan Leather Belt',
      percentage: 90,
      suggestionText: 'Your outfit is 90% ready. Add a beige belt to complete it.',
      reason: 'Binds the upper and lower silhouette with cohesive contrast.',
    };
  }

  if (!hasWatch) {
    return {
      missingPiece: 'Minimalist Watch / Bracelet',
      percentage: 92,
      suggestionText: 'Your outfit is 92% ready. Add a sleek watch to elevate it.',
      reason: 'Adds intentional polish without feeling loud.',
    };
  }

  if (!hasJacket) {
    return {
      missingPiece: 'Lightweight Linen Layer',
      percentage: 88,
      suggestionText: 'Your outfit is 88% ready. Layer a light open jacket for evening breeze.',
      reason: 'Transforms a simple base into smart dimension.',
    };
  }

  return {
    missingPiece: 'Clean White Pocket Square / Scarf',
    percentage: 94,
    suggestionText: 'Your outfit is 94% ready. Add a subtle pocket square or scarf.',
    reason: 'Adds an effortless refined accent.',
  };
}

// 1. AI CLOTH CONSULTATION ENGINE (Occasion, Age, Weather, Comfort aware)
export function generateLocalClothConsultation(
  items: WardrobeClothingItem[],
  input: ClothConsultationInput
): ClothConsultationResult {
  const available = getAvailableWardrobe(items);
  const pool = available.length >= 2 ? available : items;

  const targetPerson = input.personName || input.targetPerson || 'Me';
  const occasion = input.occasion || 'Daily Wear';
  const vibes = input.desiredVibe || [input.vibeWant || 'Smart Casual'];
  const weather = input.weather || 'Normal';
  const comfort = input.comfortLevel || 'Normal';
  const lang = input.language || input.languagePreference || 'Hinglish';

  // Categorize
  let tops = pool.filter((i) => i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Dress'].includes(i.category));
  let bottoms = pool.filter((i) => i?.category && ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category));
  let shoes = pool.filter((i) => i?.category === 'Shoes');
  let layers = pool.filter((i) => i?.category && ['Jacket', 'Ethnic Wear'].includes(i.category));
  let accessories = pool.filter((i) => i?.category && ['Watch', 'Bag', 'Accessories'].includes(i.category));

  // Age-smart filtering & prioritization
  const targetStr = (targetPerson || '').toLowerCase();
  if (targetStr.includes('child') || targetStr.includes('kid')) {
    tops = tops.filter((i) => i?.category === 'T-Shirt' || i?.fit === 'Relaxed' || i?.fit === 'Regular');
    bottoms = bottoms.filter((i) => i?.fit === 'Relaxed' || i?.category === 'Shorts' || i?.category === 'Jeans');
  } else if (targetStr.includes('senior') || targetStr.includes('elder') || targetStr.includes('parent')) {
    const kurta = tops.find((i) => i?.category === 'Kurta');
    if (kurta) tops = [kurta, ...tops];
  }

  // Occasion filtering
  const occLower = (occasion || '').toLowerCase();
  let selectedTop = tops[0] || pool[0];
  let selectedBottom = bottoms[0] || pool[1] || pool[0];
  let selectedShoe = shoes[0] || pool[2];
  let selectedLayer: WardrobeClothingItem | undefined = undefined;
  let selectedAccessory: WardrobeClothingItem | undefined = accessories[0];

  if (occLower.includes('office') || occLower.includes('interview') || occLower.includes('corporate')) {
    selectedTop = tops.find((i) => i?.category === 'Shirt') || tops[0];
    selectedBottom = bottoms.find((i) => i?.category === 'Trousers') || bottoms[0];
    selectedShoe = shoes.find((i) => (i?.name || '').toLowerCase().includes('loafer') || i?.style === 'Classic') || shoes[0];
    if (layers.length > 0) selectedLayer = layers[0];
  } else if (occLower.includes('festival') || occLower.includes('puja') || occLower.includes('wedding')) {
    selectedTop = tops.find((i) => i?.category === 'Kurta' || i?.style === 'Traditional') || tops[0];
    selectedBottom = bottoms.find((i) => i?.category === 'Trousers' || (i?.color || '').toLowerCase().includes('white')) || bottoms[0];
  } else if (occLower.includes('gym') || occLower.includes('active') || occLower.includes('home') || comfort === 'Extra Comfortable') {
    selectedTop = tops.find((i) => i?.category === 'T-Shirt') || tops[0];
    selectedBottom = bottoms.find((i) => i?.fit === 'Relaxed' || i?.category === 'Jeans') || bottoms[0];
    selectedShoe = shoes.find((i) => i?.category === 'Shoes' && (i?.name || '').toLowerCase().includes('sneaker')) || shoes[0];
  } else if (occLower.includes('party') || occLower.includes('date') || occLower.includes('club')) {
    selectedTop = tops.find((i) => i?.color === 'Black' || i?.category === 'Shirt') || tops[0];
    selectedBottom = bottoms.find((i) => i?.color === 'Black' || i?.category === 'Jeans') || bottoms[0];
    if (layers.length > 0) selectedLayer = layers[0];
  }

  // Weather adaptation
  if ((weather === 'Cold' || weather === 'Rainy') && layers.length > 0) {
    selectedLayer = layers[0];
  }

  const primaryItems: WardrobeClothingItem[] = [selectedTop, selectedBottom, selectedShoe].filter(Boolean);
  if (selectedLayer && !primaryItems.some((i) => i.id === selectedLayer!.id)) {
    primaryItems.push(selectedLayer);
  }
  if (selectedAccessory && !primaryItems.some((i) => i.id === selectedAccessory!.id)) {
    primaryItems.push(selectedAccessory);
  }

  // Alternative outfit (Plan B)
  const altTop = tops.find((t) => t.id !== selectedTop?.id) || tops[1] || tops[0];
  const altBottom = bottoms.find((b) => b.id !== selectedBottom?.id) || bottoms[1] || bottoms[0];
  const altShoe = shoes.find((s) => s.id !== selectedShoe?.id) || shoes[1] || shoes[0];
  const altItems: WardrobeClothingItem[] = [altTop, altBottom, altShoe].filter(Boolean);

  // Human, friendly explanation in requested language
  let explanation = '';
  const topName = selectedTop?.name || 'Top';
  const bottomName = selectedBottom?.name || 'Bottom';
  const shoeName = selectedShoe?.name || 'Shoes';

  if (lang === 'Hindi') {
    explanation = `आपका ${bottomName} आपके ${topName} के साथ बहुत सुंदर तालमेल बनाता है। ${shoeName} इस लुक को ${occasion} के लिए बेहद आरामदायक और मॉडर्न बनाए रखता है।`;
  } else if (lang === 'Hinglish') {
    explanation = `Aapka ${bottomName} aur ${topName} milkar ek clean aur balanced silhouette banate hain. ${shoeName} ke saath yeh look ${occasion} ke liye ekdum stylish aur super comfortable rahega.`;
  } else {
    explanation = `Your ${bottomName} balances the ${topName} perfectly, while the ${shoeName} keep the entire look modern, practical and comfortable for ${occasion}.`;
  }

  return {
    id: `consult-${Date.now()}`,
    quickTakeaway: `${occasion} ready: Crisp proportion with ${topName} and ${bottomName}`,
    title: `${occasion} Recommended Look`,
    bestOutfit: {
      title: `${occasion} Primary Choice`,
      vibe: input.vibeWant || 'Smart & Balanced',
      items: primaryItems,
      whyItWorks: explanation,
      stylingTip:
        lang === 'Hinglish'
          ? `Tuck the ${topName} slightly in the front for a modern visual proportion.`
          : `Front-tuck the top cleanly to elongate your lower body silhouette.`,
      footwearAdvice: `${shoeName} matches the comfort and formality requirements.`,
      accessories: selectedAccessory ? [selectedAccessory.name] : ['Minimal watch or chain'],
    },
    alternativeOutfit: {
      title: `${occasion} Plan B (Alternative)`,
      vibe: 'Relaxed Minimalist',
      items: altItems,
      whyItWorks: `Alternative combination utilizing ${altTop?.name || 'alternate top'} for a slightly different contrast balance.`,
      stylingTip: `Roll up the sleeves for an effortless, casual presence.`,
      footwearAdvice: `Clean sneakers or loafers.`,
      accessories: ['Classic bag'],
    },
    recommendedItems: primaryItems,
    whyThisWorks: explanation,
    occasion,
    weather,
    language: lang,
    comfortRating: comfort === 'Extra Comfortable' ? 5 : 4,
  };
}

// 2. TODAY'S OUTFIT QUICK ACTION (1-Tap Best Practical Look)
export function generateLocalTodayQuickLook(
  items: WardrobeClothingItem[],
  profile: QuickStyleProfile
): ClothConsultationResult {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const isWeekend = todayName === 'Saturday' || todayName === 'Sunday';

  const weatherVal: 'Normal' | 'Hot' | 'Rainy' | 'Cold' | 'Auto Detect' | 'Mild' =
    profile.weatherPreference === 'Cool' ? 'Mild' : profile.weatherPreference || 'Normal';

  const consultationInput: ClothConsultationInput = {
    targetPerson: 'Adult',
    occasion: isWeekend ? 'Casual Outing' : profile.targetOccasion || 'Office',
    desiredVibe: [profile.preferredStyle || 'Smart Casual'],
    weather: weatherVal,
    comfortLevel: 'Normal',
    colorPreference: 'Any',
    languagePreference: profile.languagePreference || 'Hinglish',
  };

  const res = generateLocalClothConsultation(items, consultationInput);
  res.title = `Today's Outfit (${todayName})`;
  return res;
}

// 3. "3 LOOKS FROM 1 ITEM" HERO STYLING ENGINE
export function generateLocal3LooksFromItem(
  heroItem: WardrobeClothingItem,
  allItems: WardrobeClothingItem[],
  lang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish'
): Item3LooksResult {
  const cleanWardrobe = getAvailableWardrobe(allItems).filter((i) => i && i.id !== heroItem?.id);
  const bottoms = cleanWardrobe.filter((i) => i?.category && ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category));
  const tops = cleanWardrobe.filter((i) => i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
  const shoes = cleanWardrobe.filter((i) => i?.category === 'Shoes');
  const layers = cleanWardrobe.filter((i) => i?.category === 'Jacket');
  const accessories = cleanWardrobe.filter((i) => i?.category && ['Watch', 'Bag'].includes(i.category));

  const isTop = heroItem?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Dress'].includes(heroItem.category);
  const isBottom = heroItem?.category && ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(heroItem.category);

  // Look 1: Everyday Casual
  const look1Bottom = isTop ? (bottoms.find((b) => b?.category === 'Jeans') || bottoms[0] || allItems[1]) : heroItem;
  const look1Top = isBottom ? (tops.find((t) => t?.category === 'T-Shirt') || tops[0] || allItems[0]) : heroItem;
  const look1Shoe = shoes.find((s) => (s?.name || '').toLowerCase().includes('sneaker')) || shoes[0] || allItems[2];
  const look1Items = [look1Top, look1Bottom, look1Shoe].filter(Boolean);

  // Look 2: Smart Work / Brunch
  const look2Bottom = isTop ? (bottoms.find((b) => b?.category === 'Trousers') || bottoms[0] || allItems[1]) : heroItem;
  const look2Top = isBottom ? (tops.find((t) => t?.category === 'Shirt') || tops[0] || allItems[0]) : heroItem;
  const look2Shoe = shoes.find((s) => (s?.name || '').toLowerCase().includes('loafer')) || shoes[1] || shoes[0];
  const look2Acc = accessories[0];
  const look2Items = [look2Top, look2Bottom, look2Shoe, look2Acc].filter(Boolean);

  // Look 3: Occasion / Layered Polish
  const look3Bottom = isTop ? (bottoms.find((b) => (b?.color || '').toLowerCase().includes('navy') || (b?.color || '').toLowerCase().includes('black')) || bottoms[0]) : heroItem;
  const look3Top = isBottom ? (tops.find((t) => t?.style === 'Classic' || t?.category === 'Kurta') || tops[0]) : heroItem;
  const look3Layer = layers[0];
  const look3Shoe = shoes[0];
  const look3Items = [look3Top, look3Bottom, look3Layer, look3Shoe].filter(Boolean);

  let exp1 = lang === 'Hinglish'
    ? `Casual everyday look: ${heroItem.name} ko denim aur clean sneakers ke saath wear karein.`
    : `Everyday relaxed look: ${heroItem.name} styled effortlessly with denim and sneakers.`;

  let exp2 = lang === 'Hinglish'
    ? `Smart casual styling: ${heroItem.name} ko tailored trousers aur loafers ke saath pair karke elevated presentation milegi.`
    : `Smart polish: Pairing ${heroItem.name} with tailored trousers and loafers elevates your silhouette.`;

  let exp3 = lang === 'Hinglish'
    ? `Occasion ready: ${heroItem.name} ko subtle layering ya contrast trousers ke saath formal/festive events par style karein.`
    : `Evening / Occasion polish: Layered styling gives ${heroItem.name} an intentional, refined presence.`;

  const looksArray = [
    {
      title: 'Look 1 — Everyday Casual',
      occasion: 'Casual Day Out',
      vibe: 'Relaxed & Effortless',
      matchedItems: look1Items.filter((i) => i.id !== heroItem.id),
      items: look1Items,
      stylingTip: exp1,
      explanation: exp1,
      colorHarmony: `${heroItem.color} paired with clean casual neutrals.`,
      footwearSuggestion: look1Shoe?.name || 'Clean Low-top Sneakers',
      shoes: look1Shoe?.name || 'Clean Low-top Sneakers',
      accessories: ['Minimal Backpack or Crossbody'],
    },
    {
      title: 'Look 2 — Smart Work / Social',
      occasion: 'Work & Professional',
      vibe: 'Polished & Smart',
      matchedItems: look2Items.filter((i) => i.id !== heroItem.id),
      items: look2Items,
      stylingTip: exp2,
      explanation: exp2,
      colorHarmony: 'Tailored contrast with balanced tones.',
      footwearSuggestion: look2Shoe?.name || 'Leather Loafers or Oxford',
      shoes: look2Shoe?.name || 'Leather Loafers or Oxford',
      accessories: ['Classic Leather Watch', 'Structured Tote'],
    },
    {
      title: 'Look 3 — Evening & Occasion',
      occasion: 'Evening & Celebration',
      vibe: 'Elevated & Striking',
      matchedItems: look3Items.filter((i) => i.id !== heroItem.id),
      items: look3Items,
      stylingTip: exp3,
      explanation: exp3,
      colorHarmony: 'Rich monochrome with elevated accents.',
      footwearSuggestion: look3Shoe?.name || 'Dress Shoes or Sleek Footwear',
      shoes: look3Shoe?.name || 'Dress Shoes or Sleek Footwear',
      accessories: ['Statement Watch or Accent Jewellery'],
    },
  ];

  return {
    heroItem,
    heroItemSummary: `Styling this versatile ${heroItem.color} ${heroItem.name} across Everyday Casual, Smart Work, and Evening Occasions.`,
    looks: looksArray,
    look1Everyday: {
      title: 'Look 1 — Everyday Casual',
      items: look1Items,
      explanation: exp1,
      shoes: look1Shoe?.name || 'White Sneakers',
    },
    look2Smart: {
      title: 'Look 2 — Smart Work / Social',
      items: look2Items,
      explanation: exp2,
      shoes: look2Shoe?.name || 'Leather Loafers',
    },
    look3Occasion: {
      title: 'Look 3 — Evening & Occasion',
      items: look3Items,
      explanation: exp3,
      shoes: look3Shoe?.name || 'Dress Shoes',
    },
    stylingSecret: `The versatility of ${heroItem.name} comes from changing footwear and tuck style.`,
  };
}

export const generateLocal3Looks = generateLocal3LooksFromItem;

// 4. "MAKE IT BETTER" AI TRANSFORMATION ENGINE
export function modifyOutfitMakeBetter(
  existingOutfit: ClothConsultationResult,
  allItems: WardrobeClothingItem[],
  adjustmentType: 'More Stylish' | 'More Comfortable' | 'More Formal' | 'More Casual' | 'More Trendy' | 'More Traditional' | 'Simpler' | 'Change Colors',
  lang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish'
): ClothConsultationResult {
  const clean = getAvailableWardrobe(allItems);
  let updatedItems = [...(existingOutfit.bestOutfit?.items || existingOutfit.recommendedItems || [])];

  const tops = clean.filter((i) => i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
  const bottoms = clean.filter((i) => i?.category && ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category));
  const shoes = clean.filter((i) => i?.category === 'Shoes');
  const layers = clean.filter((i) => i?.category === 'Jacket');

  let explanation = '';

  switch (adjustmentType) {
    case 'More Comfortable':
      const softTop = tops.find((t) => t?.category === 'T-Shirt' || t?.fit === 'Relaxed') || tops[0];
      const comfyShoe = shoes.find((s) => (s?.name || '').toLowerCase().includes('sneaker')) || shoes[0];
      if (softTop) updatedItems = updatedItems.map((i) => (i?.category && ['Shirt', 'Top', 'Kurta'].includes(i.category) ? softTop : i));
      if (comfyShoe) updatedItems = updatedItems.map((i) => (i?.category === 'Shoes' ? comfyShoe : i));
      explanation = lang === 'Hinglish'
        ? `Extra comfort optimize kar diya gaya hai: Breathable t-shirt aur lightweight sneakers add kiye gaye hain.`
        : `Optimized for high comfort with relaxed breathable cotton and low-top sneakers.`;
      break;

    case 'More Formal':
      const formalShirt = tops.find((t) => t?.category === 'Shirt' && t?.style === 'Classic') || tops[0];
      const formalPant = bottoms.find((b) => b?.category === 'Trousers') || bottoms[0];
      const formalShoe = shoes.find((s) => s?.style === 'Classic' || (s?.name || '').toLowerCase().includes('loafer')) || shoes[0];
      if (formalShirt) updatedItems = updatedItems.map((i) => (i?.category && ['T-Shirt', 'Kurta'].includes(i.category) ? formalShirt : i));
      if (formalPant) updatedItems = updatedItems.map((i) => (i?.category === 'Jeans' ? formalPant : i));
      if (formalShoe) updatedItems = updatedItems.map((i) => (i?.category === 'Shoes' ? formalShoe : i));
      if (layers.length > 0 && !updatedItems.some((i) => i?.category === 'Jacket')) updatedItems.push(layers[0]);
      explanation = lang === 'Hinglish'
        ? `Formal sharpness add ki gayi hai: Tailored shirt, crisp trousers aur formal footwear add kar diye hain.`
        : `Refined for high formality with tailored shirt, clean trouser crease and structured layer.`;
      break;

    case 'More Traditional':
      const kurta = tops.find((t) => t?.category === 'Kurta' || t?.style === 'Traditional') || tops[0];
      if (kurta) {
        updatedItems = updatedItems.map((i) => (i?.category && ['Shirt', 'T-Shirt', 'Top'].includes(i.category) ? kurta : i));
      }
      explanation = lang === 'Hinglish'
        ? `Traditional touch: Short kurta aur breathable bottoms se ethnic balance diya gaya hai.`
        : `Infused traditional aesthetic with your cotton kurta and complementary bottoms.`;
      break;

    case 'Change Colors':
      const currentTop = updatedItems.find((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
      const altColorTop = tops.find((t) => t.id !== currentTop?.id && t.color !== currentTop?.color) || tops[0];
      if (altColorTop) {
        updatedItems = updatedItems.map((i) => (i.id === currentTop?.id ? altColorTop : i));
      }
      explanation = lang === 'Hinglish'
        ? `Color palette refresh: ${altColorTop?.color || 'alternate'} tone ke saath fresh contrast balance create kiya hai.`
        : `Refreshed palette with ${altColorTop?.color || 'contrast'} colorway for a vibrant dynamic shift.`;
      break;

    default: // More Stylish / Trendy / Simpler
      if (layers.length > 0 && !updatedItems.some((i) => i.category === 'Jacket')) {
        updatedItems.push(layers[0]);
      }
      explanation = lang === 'Hinglish'
        ? `Proportion and layering optimize kar diye gaye hain taaki look aur sharp dikhe.`
        : `Elevated silhouette styling with strategic layering and focused color contrast.`;
      break;
  }

  const updatedBestOutfit = {
    title: `${existingOutfit.bestOutfit?.title || existingOutfit.title || 'Outfit'} (${adjustmentType})`,
    vibe: adjustmentType,
    items: updatedItems,
    whyItWorks: explanation,
    stylingTip: existingOutfit.bestOutfit?.stylingTip || 'Front-tuck cleanly for refined visual balance.',
    footwearAdvice: existingOutfit.bestOutfit?.footwearAdvice || 'Comfortable, matching footwear.',
    accessories: existingOutfit.bestOutfit?.accessories || ['Minimal accents'],
  };

  return {
    ...existingOutfit,
    title: `${existingOutfit.title || 'Outfit'} (${adjustmentType})`,
    quickTakeaway: `${adjustmentType}: ${explanation}`,
    bestOutfit: updatedBestOutfit,
    recommendedItems: updatedItems,
    whyThisWorks: explanation,
  };
}

// 5. SMART "BUY OR DON'T BUY" (DO I REALLY NEED THIS?) ENGINE
export function analyzeBuyOrDontBuy(
  queryItem: string,
  items: WardrobeClothingItem[],
  lang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish'
): BuyOrDontBuyAnalysis {
  const lower = queryItem.toLowerCase();
  const tops = items.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
  const bottoms = items.filter((i) => ['Trousers', 'Jeans', 'Shorts'].includes(i.category));
  const shoes = items.filter((i) => i.category === 'Shoes');
  const layers = items.filter((i) => i.category === 'Jacket');

  // Check category overlap
  let isTop = lower.includes('shirt') || lower.includes('tee') || lower.includes('top') || lower.includes('polo');
  let isBottom = lower.includes('pant') || lower.includes('jean') || lower.includes('trouser') || lower.includes('chino');
  let isShoe = lower.includes('shoe') || lower.includes('sneaker') || lower.includes('loafer') || lower.includes('boot');
  let isLayer = lower.includes('jacket') || lower.includes('blazer') || lower.includes('coat') || lower.includes('hoodie');

  if (isTop && tops.length >= 4) {
    const similar = tops.slice(0, 3);
    return {
      queryItem,
      decision: 'DO_NOT_BUY',
      verdictTitle: lang === 'Hinglish' ? '🛑 You Probably Don’t Need This!' : '🛑 Don’t Buy — You Already Own Similar Pieces!',
      detailedReason: lang === 'Hinglish'
        ? `Aapke paas already ${tops.length} versatile tops/shirts hain jo exactly same looks create karte hain. Is purchase se aapke wardrobe me naye combination nahi banenge.`
        : `You already own ${tops.length} versatile tops that create identical silhouettes. Buying another top adds minimal new outfit combinations.`,
      existingSimilarItems: similar,
      potentialCombinationsCount: 0,
      smartAlternativeAdvice: lang === 'Hinglish'
        ? `Iski jagah ek versatile neutral layer ya shoe lene se aapke existing ${tops.length} tops se 6+ naye looks ban sakte hain.`
        : `Instead, a structured neutral layer or footwear would unlock 6+ new looks from what you already own.`,
    };
  }

  if (isBottom && bottoms.length < 2) {
    return {
      queryItem,
      decision: 'WARDROBE_GAP_DETECTED',
      verdictTitle: lang === 'Hinglish' ? '✅ Genuine Wardrobe Gap Detected!' : '✅ Smart Investment — Unlocks Multiple Combinations!',
      detailedReason: lang === 'Hinglish'
        ? `Yeh ek genuine missing foundation piece hai. Ek neutral trouser/denim add karne se aapke sabhi existing tops ke saath 6+ naye unique outfits ban jayenge.`
        : `A neutral bottom will instantly pair with all your existing tops, unlocking 6+ new complete outfits.`,
      existingSimilarItems: bottoms,
      potentialCombinationsCount: 6,
      smartAlternativeAdvice: `Ensure you choose a high-durability fabric in Charcoal, Navy, or Beige for maximum versatility.`,
    };
  }

  if (isLayer && layers.length === 0) {
    return {
      queryItem,
      decision: 'WARDROBE_GAP_DETECTED',
      verdictTitle: '✅ High Versatility Addition!',
      detailedReason: lang === 'Hinglish'
        ? `Aapke wardrobe me koi neutral layer nahi hai. Ek lightweight blazer ya overshirt add karne se casual looks instant formal ho jayenge.`
        : `Your closet lacks a versatile mid-layer. Adding one elevates simple t-shirts and shirts for smart casual meetings.`,
      existingSimilarItems: [],
      potentialCombinationsCount: 7,
      smartAlternativeAdvice: `Look for an unlined linen or cotton blend for 3-season wear.`,
    };
  }

  return {
    queryItem,
    decision: 'OPTIONAL_ACCENT',
    verdictTitle: '✨ Optional Style Accent',
    detailedReason: lang === 'Hinglish'
      ? `Aapka current wardrobe is piece ke bina bhi easily complete outfits banata hai. Agar yeh aapka favourite color/cut hai tabhi lein.`
      : `Your existing capsule already functions well without this piece. Consider buying only if you will wear it 20+ times.`,
    existingSimilarItems: items.slice(0, 2),
    potentialCombinationsCount: 2,
    smartAlternativeAdvice: `Check if you can restyle your existing ${items[0]?.name || 'clothes'} first.`,
  };
}

// 6. TRAVEL OUTFIT PLANNER (Pack My Wardrobe)
export function generateLocalTravelPlan(
  input: TravelPlannerInput,
  items: WardrobeClothingItem[]
): TravelPackingPlan {
  const available = getAvailableWardrobe(items);
  const pool = available.length >= 4 ? available : items;
  const days = Math.min(14, Math.max(1, input.daysCount || 3));

  const tops = pool.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
  const bottoms = pool.filter((i) => ['Trousers', 'Jeans', 'Shorts'].includes(i.category));
  const shoes = pool.filter((i) => i.category === 'Shoes');
  const layers = pool.filter((i) => i.category === 'Jacket');

  const dailyOutfits = [];
  const packedSet = new Set<string>();

  for (let d = 1; d <= days; d++) {
    const top = tops[(d - 1) % tops.length] || pool[0];
    // Reusing bottoms every 2-3 days for light packing
    const bottom = bottoms[Math.floor((d - 1) / 2) % bottoms.length] || pool[1];
    const shoe = shoes[(d - 1) % shoes.length] || pool[2];
    const layer = layers.length > 0 && (d === 1 || d === days || input.weather === 'Cold') ? layers[0] : undefined;

    const outfitItems = [top, bottom, shoe, layer].filter(Boolean) as WardrobeClothingItem[];
    outfitItems.forEach((i) => packedSet.add(i.id));

    dailyOutfits.push({
      dayNumber: d,
      title: `Day ${d} — ${d === 1 ? 'Departure & Travel Ease' : d === days ? 'Return & Comfort' : 'Exploration & Sightseeing'}`,
      items: outfitItems,
      notes: `Comfortable ${top.name} paired with durable ${bottom.name}. Reusing versatile bottoms saves luggage space.`,
    });
  }

  const essentialItems = items.filter((i) => packedSet.has(i.id));
  const optionalAccents = items.filter((i) => !packedSet.has(i.id) && ['Watch', 'Bag', 'Accessories'].includes(i.category)).slice(0, 2);

  return {
    destination: input.destination || 'Destination Trip',
    daysCount: days,
    dailyOutfits,
    essentialItems,
    optionalAccents,
    packingSummary: `Packed only ${essentialItems.length} core items for ${days} days with zero clutter by smartly rotating bottoms.`,
  };
}

// 7. WARDROBE INSIGHTS STATS
export function computeWardrobeInsights(
  items: WardrobeClothingItem[],
  profile?: QuickStyleProfile
): WardrobeInsightsStats {
  const total = items.length;
  const sortedByRewear = [...items].sort((a, b) => (b.rewearCount || 0) - (a.rewearCount || 0));

  const mostUsed = sortedByRewear.filter((i) => (i.rewearCount || 0) > 0).slice(0, 4);
  const leastUsed = sortedByRewear.filter((i) => (i.rewearCount || 0) > 0).reverse().slice(0, 3);
  const neverWorn = items.filter((i) => !i.rewearCount || i.rewearCount === 0);
  const favouriteItems = items.filter((i) => i.isFavourite);
  const laundryItems = items.filter((i) => i.status === 'Laundry');
  const availableCount = items.filter((i) => i.status !== 'Laundry').length;

  const categoryCounts: Record<string, number> = {};
  const colorCounts: Record<string, number> = {};
  const seasonsCount: Record<string, number> = {};

  items.forEach((i) => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    colorCounts[i.color] = (colorCounts[i.color] || 0) + 1;
    const s = i.season || 'All Season';
    seasonsCount[s] = (seasonsCount[s] || 0) + 1;
  });

  const seasonalDistribution = Object.entries(seasonsCount).map(([season, count]) => ({ season, count }));

  // Most used category
  let mostUsedCategory = 'Tops & Shirts';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      mostUsedCategory = cat;
    }
  });

  // Top colorway
  let topColorPalette = 'Neutral / Navy';
  let maxColorCount = 0;
  Object.entries(colorCounts).forEach(([col, count]) => {
    if (count > maxColorCount) {
      maxColorCount = count;
      topColorPalette = col;
    }
  });

  // Versatility score calculation
  const topsCount = items.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Dress'].includes(i.category)).length;
  const bottomsCount = items.filter((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category)).length;
  const shoesCount = items.filter((i) => i.category === 'Shoes').length;
  const layersCount = items.filter((i) => ['Jacket', 'Ethnic Wear'].includes(i.category)).length;

  const versatilityScore = Math.min(98, Math.max(50, Math.round((total / 12) * 80 + (shoesCount > 0 ? 10 : 0))));

  const capsuleHealth = total >= 10 && bottomsCount >= 2 && shoesCount >= 1 ? 'Optimal (88%)' : 'Good (74%)';

  let suggestedAddition = 'Neutral Slim Chino or Loafer';
  if (shoesCount === 0) suggestedAddition = 'Classic Clean White Sneakers';
  else if (layersCount === 0) suggestedAddition = 'Lightweight Neutral Overshirt / Blazer';
  else if (bottomsCount < 2) suggestedAddition = 'Tailored Charcoal Trousers';

  // Missing basics detection
  const missingBasics: string[] = [];
  if (!items.some((i) => i?.category === 'Shoes')) missingBasics.push('1 Pair of Clean Low-top Sneakers or Loafers');
  if (items.filter((i) => i?.category && ['Trousers', 'Jeans'].includes(i.category)).length < 2) missingBasics.push('1 Pair of Neutral Dark/Navy Pants');
  if (!items.some((i) => i?.category === 'Shirt' && (i?.color || '').toLowerCase().includes('white'))) missingBasics.push('1 Classic Crisp White Oxford Shirt');
  if (!items.some((i) => i?.category === 'Jacket')) missingBasics.push('1 Lightweight Neutral Blazer or Overshirt');

  return {
    totalItems: total,
    mostUsedCategory,
    topColorPalette,
    capsuleHealth,
    versatilityScore,
    suggestedAddition,
    mostUsed,
    leastUsed,
    neverWorn,
    favouriteItems,
    laundryItems,
    availableCount,
    seasonalDistribution,
    missingBasics,
  };
}

// Intelligently generate 7-Day Plan from existing items
export function generateLocal7DayPlan(
  items: WardrobeClothingItem[],
  profile: QuickStyleProfile,
  isRestyleMode = false
): DayOutfitPlan[] {
  const clean = getAvailableWardrobe(items);
  const pool = clean.length >= 3 ? clean : items;
  if (!pool || pool.length === 0) return [];

  const tops = pool.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Dress'].includes(i.category));
  const bottoms = pool.filter((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category));
  const shoes = pool.filter((i) => i.category === 'Shoes');
  const layers = pool.filter((i) => ['Jacket', 'Ethnic Wear'].includes(i.category));
  const accessories = pool.filter((i) => ['Watch', 'Bag', 'Accessories'].includes(i.category));

  const dayTemplates = [
    { id: 'monday', name: 'Monday', vibe: 'Power Kickoff', occasion: profile.targetOccasion === 'Office' ? 'Office' : 'Daily' },
    { id: 'tuesday', name: 'Tuesday', vibe: 'Focused Flow', occasion: profile.targetOccasion === 'Office' ? 'Meeting' : 'Casual' },
    { id: 'wednesday', name: 'Wednesday', vibe: 'Midweek Dynamic', occasion: 'Daily' },
    { id: 'thursday', name: 'Thursday', vibe: 'Smart Transition', occasion: profile.targetOccasion === 'Office' ? 'Office' : 'Casual' },
    { id: 'friday', name: 'Friday', vibe: 'Casual Friday Polish', occasion: 'Casual' },
    { id: 'saturday', name: 'Saturday', vibe: 'Weekend Leisure & Social', occasion: 'Party' },
    { id: 'sunday', name: 'Sunday', vibe: 'Relaxed Reset', occasion: 'Daily' },
  ];

  return dayTemplates.map((d, index) => {
    const selectedItems: WardrobeClothingItem[] = [];

    // Select top
    if (tops.length > 0) {
      const topIdx = (index + (isRestyleMode ? 2 : 0)) % tops.length;
      selectedItems.push(tops[topIdx]);
    }

    // Select bottom (smart reuse)
    if (bottoms.length > 0) {
      const bottomIdx = (index + (isRestyleMode ? 1 : 0)) % bottoms.length;
      selectedItems.push(bottoms[bottomIdx]);
    }

    // Select shoes
    if (shoes.length > 0) {
      const shoeIdx = (index + (isRestyleMode ? 1 : 0)) % shoes.length;
      selectedItems.push(shoes[shoeIdx]);
    }

    // Optional layer
    if (layers.length > 0 && (index === 0 || index === 3 || index === 5 || isRestyleMode)) {
      const layerIdx = index % layers.length;
      if (!selectedItems.some((i) => i.id === layers[layerIdx].id)) {
        selectedItems.push(layers[layerIdx]);
      }
    }

    // Add accessory
    if (accessories.length > 0) {
      const accIdx = index % accessories.length;
      if (!selectedItems.some((i) => i.id === accessories[accIdx].id)) {
        selectedItems.push(accessories[accIdx]);
      }
    }

    const primaryTop = selectedItems.find((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category))?.name || 'Top';
    const primaryBottom = selectedItems.find((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category))?.name || 'Bottom';
    const primaryShoe = selectedItems.find((i) => i.category === 'Shoes')?.name || 'Footwear';

    let stylingRationale = '';
    if (isRestyleMode) {
      stylingRationale = `Restyled with high contrast: Pairing ${primaryTop} with ${primaryBottom} creates a refreshing silhouette change. Grounded by ${primaryShoe} for effortless balance without purchasing any new pieces.`;
    } else {
      stylingRationale = `Clean ${profile.preferredStyle.toLowerCase()} proportion: Combining the structure of ${primaryTop} with ${primaryBottom} delivers an elevated aesthetic suitable for ${d.occasion.toLowerCase()} environments.`;
    }

    return {
      dayId: d.id,
      dayName: d.name,
      theme: `${d.name} — ${d.vibe}`,
      items: selectedItems,
      stylingTips: stylingRationale,
      occasion: d.occasion,
      weather: profile.weatherPreference,
      isFavourite: false,
      restyled: isRestyleMode,
    };
  });
}

// Calculate item rewear counts across the full plan
export function computeItemRewears(plan: DayOutfitPlan[]): Record<string, number> {
  const counts: Record<string, number> = {};
  plan.forEach((day) => {
    day.items.forEach((item) => {
      counts[item.id] = (counts[item.id] || 0) + 1;
    });
  });
  return counts;
}

// Compute Wardrobe Gap Analysis and Scores
export function analyzeWardrobeGaps(items: WardrobeClothingItem[], profile: QuickStyleProfile): WardrobeGapAnalysis {
  const total = items.length;
  const tops = items.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Dress'].includes(i.category)).length;
  const bottoms = items.filter((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category)).length;
  const shoes = items.filter((i) => i.category === 'Shoes').length;
  const layers = items.filter((i) => ['Jacket', 'Ethnic Wear'].includes(i.category)).length;
  const accessories = items.filter((i) => ['Watch', 'Bag', 'Accessories'].includes(i.category)).length;

  // Calculate scores (0-100)
  const varietyScore = Math.min(95, Math.max(50, Math.round((total / 12) * 85)));
  const coverageScore = Math.min(96, Math.max(45, Math.round(((tops * 2 + bottoms * 3 + shoes * 4) / 25) * 85)));
  const uniqueColors = new Set(items.map((i) => i.color.toLowerCase())).size;
  const colorVarietyScore = Math.min(92, Math.max(55, uniqueColors * 14));
  const footwearScore = shoes >= 2 ? 88 : shoes === 1 ? 62 : 30;

  // Determine the ONE most useful thing they actually need
  let oneThing = {
    item: 'Neutral Minimalist White Leather Sneakers',
    reason: 'You have good garment depth for 7 days. A clean white sneaker provides 4 additional casual and smart-casual combinations with your existing trousers and denim.',
    extraCombinations: 4,
    estimatedPrice: 1899,
  };

  if (shoes === 0) {
    oneThing = {
      item: 'Versatile Leather Loafers or Clean Low-top Sneakers',
      reason: 'Your wardrobe lacks dedicated footwear. Adding 1 versatile pair instantly connects all 7 daily outfits.',
      extraCombinations: 7,
      estimatedPrice: 1999,
    };
  } else if (bottoms < 2) {
    oneThing = {
      item: 'Tailored Mid-Grey or Navy Slim Trousers',
      reason: 'Adding one neutral trouser unlocks 5 new work and semi-formal pairings with your current tops.',
      extraCombinations: 5,
      estimatedPrice: 1299,
    };
  } else if (layers === 0) {
    oneThing = {
      item: 'Lightweight Linen or Cotton Unstructured Overshirt / Blazer',
      reason: 'An easy neutral layer adds dynamic depth for transitioning from day meetings to evening social events.',
      extraCombinations: 6,
      estimatedPrice: 2199,
    };
  }

  return {
    varietyScore,
    coverageScore,
    colorVarietyScore,
    footwearScore,
    summary:
      total >= 10
        ? `Your wardrobe is versatile with strong 7-day capsule capability. You have ${tops} tops, ${bottoms} bottoms, and ${shoes} shoes.`
        : `Your wardrobe has a solid core foundation (${total} items). With smart restyling, you can complete all 7 days with zero new purchases.`,
    oneThingYouNeed: oneThing,
    smartShopping: {
      buyFirst: {
        item: oneThing.item,
        reason: oneThing.reason,
        priority: 'Highest Versatility (Unlocks +4 Combinations)',
        budgetEst: oneThing.estimatedPrice || 1499,
        versatilePairings: ['Dark Denim', 'Tailored Trousers', 'Chinos', 'Crewneck Tees'],
      },
      buyNext: {
        item: layers === 0 ? 'Unstructured Sand Beige Overshirt' : 'Textured Knitted Polo / Cami',
        reason: 'Adds visual texture and modular layering across cool morning and indoor AC environments.',
        priority: 'Second Priority Layer',
        budgetEst: 999,
        versatilePairings: ['Open over White T-Shirt', 'Buttoned with Navy Trousers'],
      },
      optional: {
        item: 'Minimalist Woven Leather Belt & Cardholder',
        reason: 'Subtle accessory harmonization that ties footwear and watch tones together cleanly.',
        priority: 'Nice-to-Have Accent',
        budgetEst: 599,
        versatilePairings: ['Formal & Casual Pants'],
      },
    },
  };
}

export const generateLocalBuyDecision = analyzeBuyOrDontBuy;
export const computeWardrobeInsightsStats = computeWardrobeInsights;
