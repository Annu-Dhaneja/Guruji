import { GoogleGenAI } from '@google/genai';
import {
  WardrobeClothingItem,
  QuickStyleProfile,
  DayOutfitPlan,
  ClothConsultationInput,
  ClothConsultationResult,
  Item3LooksResult,
  BuyOrDontBuyAnalysis,
  TravelPlannerInput,
  TravelPackingPlan,
} from '../src/types';
import {
  generateLocal7DayPlan,
  generateLocalClothConsultation,
  generateLocal3LooksFromItem,
  analyzeBuyOrDontBuy,
  generateLocalTravelPlan,
  getAvailableWardrobe,
} from '../src/data/wardrobeData';

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || 'MOCK_KEY';
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// 1. Identify clothing item from image or metadata
export async function identifyClothingItem(
  imageUrl: string,
  filename?: string,
  userHint?: string
): Promise<{
  name: string;
  category: string;
  color: string;
  pattern: string;
  style: string;
  occasion: string;
  season: string;
  fit: string;
  confidence: number;
  aiIdentified: boolean;
  notes: string;
}> {
  const allowedCategories = [
    'T-Shirt',
    'Shirt',
    'Top',
    'Jeans',
    'Trousers',
    'Shorts',
    'Skirt',
    'Dress',
    'Jacket',
    'Kurta',
    'Ethnic Wear',
    'Shoes',
    'Bag',
    'Watch',
    'Accessories',
    'Other',
  ];

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      // Check if imageUrl is base64
      let contents: any[] = [];
      if (imageUrl.startsWith('data:image/')) {
        const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const data = matches[2];
          contents = [
            {
              inlineData: {
                data,
                mimeType,
              },
            },
            {
              text: `You are a fashion stylist item tagger. Analyze this clothing image carefully.
Allowed categories: ${allowedCategories.join(', ')}.
Extract the exact garment attributes in JSON format:
{
  "name": "Concise Descriptive Item Name (e.g. Crisp White Cotton Shirt)",
  "category": "One of allowed categories exactly",
  "color": "Primary Color (e.g. White, Navy Blue, Olive, Black, Beige)",
  "pattern": "Solid | Striped | Checked | Floral | Printed | Textured | Knit",
  "style": "Minimal | Classic | Smart Casual | Trendy | Streetwear | Traditional | Mix",
  "occasion": "Daily | Office | Casual | Party | Travel | Mixed | Wedding",
  "season": "All Season | Summer | Winter | Monsoon | Spring/Autumn",
  "fit": "Slim | Regular | Relaxed | Oversized | Tailored",
  "confidence": number between 0.0 and 1.0 (if blurry or ambiguous, use < 0.75),
  "notes": "Short observation on fabric, texture, or styling utility"
}
If unclear, set confidence to 0.6 and state that the user should verify the category.`,
            },
          ];
        }
      }

      if (contents.length === 0) {
        contents = [
          {
            text: `Identify clothing item attributes based on filename: "${filename || 'cloth.jpg'}" and user hint: "${userHint || 'everyday wear'}".
Allowed categories: ${allowedCategories.join(', ')}.
Return valid JSON:
{
  "name": "string",
  "category": "string from allowed categories",
  "color": "string",
  "pattern": "Solid | Striped | Checked | Floral | Printed | Textured",
  "style": "Minimal | Classic | Smart Casual | Trendy | Streetwear | Traditional | Mix",
  "occasion": "Daily | Office | Casual | Party | Travel | Mixed",
  "season": "All Season | Summer | Winter | Monsoon | Spring/Autumn",
  "fit": "Slim | Regular | Relaxed | Oversized | Tailored",
  "confidence": 0.88,
  "notes": "string"
}`,
          },
        ];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.name && parsed.category) {
        return {
          name: parsed.name,
          category: allowedCategories.includes(parsed.category) ? parsed.category : 'Other',
          color: parsed.color || 'Neutral',
          pattern: parsed.pattern || 'Solid',
          style: parsed.style || 'Smart Casual',
          occasion: parsed.occasion || 'Daily',
          season: parsed.season || 'All Season',
          fit: parsed.fit || 'Regular',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
          aiIdentified: true,
          notes: parsed.notes || 'Identified via AI Vision',
        };
      }
    }
  } catch (e) {
    console.warn('AI clothing identification fallback:', e);
  }

  // Heuristic rule fallback
  const cleanName = (filename || 'Garment Item').replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  let inferredCategory = 'Other';
  const lower = cleanName.toLowerCase();
  if (lower.includes('shirt')) inferredCategory = 'Shirt';
  else if (lower.includes('tshirt') || lower.includes('tee')) inferredCategory = 'T-Shirt';
  else if (lower.includes('jean') || lower.includes('denim')) inferredCategory = 'Jeans';
  else if (lower.includes('trouser') || lower.includes('pant')) inferredCategory = 'Trousers';
  else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('loafer')) inferredCategory = 'Shoes';
  else if (lower.includes('jacket') || lower.includes('blazer')) inferredCategory = 'Jacket';
  else if (lower.includes('kurta')) inferredCategory = 'Kurta';
  else if (lower.includes('watch')) inferredCategory = 'Watch';
  else if (lower.includes('bag')) inferredCategory = 'Bag';

  return {
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    category: inferredCategory,
    color: 'Neutral',
    pattern: 'Solid',
    style: 'Smart Casual',
    occasion: 'Daily',
    season: 'All Season',
    fit: 'Regular',
    confidence: 0.7,
    aiIdentified: true,
    notes: 'Please review and verify the item attributes.',
  };
}

// 2. Generate 7-Day Plan with Gemini 3.7
export async function generateGemini7DayPlan(
  items: WardrobeClothingItem[],
  profile: QuickStyleProfile,
  isRestyleMode = false
): Promise<DayOutfitPlan[]> {
  if (!items || items.length === 0) return [];

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const itemsSummary = items.map((i, idx) => ({
        index: idx,
        id: i.id,
        name: i.name,
        category: i.category,
        color: i.color,
        pattern: i.pattern,
        style: i.style,
        fit: i.fit,
      }));

      const prompt = `You are celebrity fashion stylist Annu Dhaneja at GurucraftPro.
Generate a realistic, high-taste 7-Day Capsule Wardrobe outfit plan (Monday through Sunday) using ONLY the client's existing uploaded clothes listed below.

CLIENT STYLE PROFILE:
- Usual Lifestyle: ${profile.lifestyle}
- Preferred Aesthetic: ${profile.preferredStyle}
- Target Occasion: ${profile.targetOccasion}
- Outfit Needs: ${profile.outfitType}
- Color Palette Preference: ${profile.colorStyle}
- Weather Condition: ${profile.weatherPreference}
${isRestyleMode ? '*** UNIQUE DIRECTIVE: RESTYLE MODE (DON\'T BUY, RESTYLE MY WARDROBE) *** Prioritize unexpected, creative yet wearable combinations from existing pieces without repeating identical outfits.' : ''}

AVAILABLE WARDROBE INVENTORY (MUST USE ONLY THESE ITEM IDs):
${JSON.stringify(itemsSummary, null, 2)}

REQUIREMENTS:
1. Return a JSON array with 7 daily plans: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
2. For each day, include:
   - "dayId": "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
   - "dayName": "Monday", "Tuesday", etc.
   - "theme": "Crisp Title (e.g. Power Presentation, Smart Flow, Weekend Casual)",
   - "itemIds": array of exact string IDs from the inventory used for this outfit (1 top, 1 bottom, 1 footwear, optional jacket/accessory).
   - "stylingTips": "2-3 sentences explaining why this outfit works (color harmony, silhouette balance, layering, aesthetic logic). Be practical and encouraging.",
   - "occasion": "${profile.targetOccasion}",
   - "weather": "${profile.weatherPreference}"

JSON FORMAT:
[
  {
    "dayId": "monday",
    "dayName": "Monday",
    "theme": "Power Kickoff & Executive Polish",
    "itemIds": ["w-item-1", "w-item-2", "w-item-7", "w-item-5"],
    "stylingTips": "Crisp contrast between the white shirt and navy trousers gives structure. Grounded with tan loafers for understated elegance.",
    "occasion": "Office",
    "weather": "Normal"
  },
  ...
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '[]';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (Array.isArray(parsed) && parsed.length >= 7) {
        const itemMap = new Map<string, WardrobeClothingItem>();
        items.forEach((i) => itemMap.set(i.id, i));

        return parsed.map((d: any) => {
          const mappedItems: WardrobeClothingItem[] = (d.itemIds || [])
            .map((id: string) => itemMap.get(id))
            .filter((item: WardrobeClothingItem | undefined): item is WardrobeClothingItem => Boolean(item));

          // If some items failed mapping, fallback to local picker
          const finalItems = mappedItems.length > 0 ? mappedItems : items.slice(0, 3);

          return {
            dayId: d.dayId || d.dayName?.toLowerCase() || 'monday',
            dayName: d.dayName || 'Day',
            theme: d.theme || `${d.dayName} Style Plan`,
            items: finalItems,
            stylingTips: d.stylingTips || 'Balanced color harmony with clean silhouette pairing.',
            occasion: d.occasion || profile.targetOccasion,
            weather: d.weather || profile.weatherPreference,
            isFavourite: false,
            restyled: isRestyleMode,
          };
        });
      }
    }
  } catch (e) {
    console.warn('Gemini 7-day wardrobe generation fallback:', e);
  }

  // Local rule-based styling engine
  return generateLocal7DayPlan(items, profile, isRestyleMode);
}

// 3. Regenerate single day with Gemini
export async function regenerateSingleDay(
  dayName: string,
  existingDay: DayOutfitPlan,
  items: WardrobeClothingItem[],
  profile: QuickStyleProfile
): Promise<DayOutfitPlan> {
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();
      const itemsSummary = items.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        color: i.color,
        style: i.style,
      }));

      const prompt = `You are stylist Annu Dhaneja at GurucraftPro.
Regenerate a FRESH, ALTERNATIVE outfit for "${dayName}" using ONLY the client's existing wardrobe items below.
Previous outfit items used: ${existingDay.items.map((i) => i.name).join(', ')}.
Target occasion: ${profile.targetOccasion}, Weather: ${profile.weatherPreference}, Style: ${profile.preferredStyle}.

WARDROBE INVENTORY:
${JSON.stringify(itemsSummary, null, 2)}

Return single JSON object:
{
  "dayId": "${existingDay.dayId}",
  "dayName": "${dayName}",
  "theme": "New Crisp Theme for ${dayName}",
  "itemIds": ["id1", "id2", "id3"],
  "stylingTips": "2 sentences explaining why this new alternative combination works.",
  "occasion": "${profile.targetOccasion}",
  "weather": "${profile.weatherPreference}"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.itemIds && Array.isArray(parsed.itemIds)) {
        const itemMap = new Map<string, WardrobeClothingItem>();
        items.forEach((i) => itemMap.set(i.id, i));

        const mappedItems: WardrobeClothingItem[] = parsed.itemIds
          .map((id: string) => itemMap.get(id))
          .filter((item: WardrobeClothingItem | undefined): item is WardrobeClothingItem => Boolean(item));

        if (mappedItems.length >= 2) {
          return {
            dayId: existingDay.dayId,
            dayName: dayName,
            theme: parsed.theme || `${dayName} Fresh Alternative`,
            items: mappedItems,
            stylingTips: parsed.stylingTips || 'Refreshed pairing with versatile pieces from your wardrobe.',
            occasion: parsed.occasion || profile.targetOccasion,
            weather: parsed.weather || profile.weatherPreference,
            isFavourite: existingDay.isFavourite,
            restyled: true,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Gemini regenerate single day fallback:', e);
  }

  // Local fallback: pick alternative tops and bottoms
  const tops = items.filter((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category));
  const bottoms = items.filter((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category));
  const shoes = items.filter((i) => i.category === 'Shoes');

  const currentTopId = existingDay.items.find((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category))?.id;
  const currentBottomId = existingDay.items.find((i) => ['Trousers', 'Jeans', 'Shorts', 'Skirt'].includes(i.category))?.id;

  const altTop = tops.find((t) => t.id !== currentTopId) || tops[0] || items[0];
  const altBottom = bottoms.find((b) => b.id !== currentBottomId) || bottoms[0] || items[1] || items[0];
  const shoe = shoes[0] || items[2];

  const newItems = [altTop, altBottom, shoe].filter(Boolean);

  return {
    ...existingDay,
    theme: `${dayName} — Restyled Alternative`,
    items: newItems,
    stylingTips: `Swapped to ${altTop.name} paired with ${altBottom.name} for an effortlessly fresh silhouette balance.`,
    restyled: true,
  };
}

// 4. Stylist Chat grounded in user wardrobe
export async function chatWithWardrobeStylist(
  message: string,
  history: { sender: 'user' | 'ai'; text: string }[],
  items: WardrobeClothingItem[],
  profile: QuickStyleProfile,
  currentPlan?: DayOutfitPlan[]
): Promise<{ text: string; suggestedItemIds?: string[]; outfitTip?: string }> {
  if (!message) return { text: 'How can I assist your wardrobe styling today?' };

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const itemsSummary = items.map((i) => `${i.id}: "${i.name}" (${i.category}, ${i.color}, ${i.style})`).join('\n');

      const systemInstruction = `You are Annu Dhaneja, founder of GurucraftPro and senior celebrity capsule wardrobe stylist.
Your goal is to answer the user's styling question based PRIMARILY on their EXISTING uploaded wardrobe items listed below.

CLIENT WARDROBE ITEMS:
${itemsSummary}

CLIENT PROFILE:
- Preferred Style: ${profile.preferredStyle}
- Lifestyle: ${profile.lifestyle}
- Weather: ${profile.weatherPreference}

RULES:
1. ALWAYS prioritize their existing clothes. Recommend exact combinations from their items by name.
2. Do NOT urge them to buy new items unless they specifically ask "what should I buy next?".
3. Explain the aesthetic reason why the combination works (color balance, proportions, texture contrast).
4. Be polite, encouraging, constructive, and avoid any negative body or appearance judgments.
5. If the user asks about an item they haven't uploaded (e.g. "I have a green blazer"), provide styling advice and mention how it could pair with their current items.
6. Keep answers concise, actionable, and formatted nicely with bullet points if suggesting an outfit.

Return JSON:
{
  "text": "Your helpful stylist answer in warm conversational tone.",
  "suggestedItemIds": ["array of exact item IDs mentioned from their wardrobe"],
  "outfitTip": "One crisp takeaway styling rule or tip"
}`;

      const chatPrompt = `User question: "${message}"\nRecent conversation: ${JSON.stringify(history.slice(-4))}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `${systemInstruction}\n\n${chatPrompt}`,
      });

      const resText = response.text || '{}';
      const cleanJson = resText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.text) {
        return {
          text: parsed.text,
          suggestedItemIds: parsed.suggestedItemIds || [],
          outfitTip: parsed.outfitTip,
        };
      }
    }
  } catch (e) {
    console.warn('Gemini wardrobe stylist chat fallback:', e);
  }

  // Intelligent conversational fallback grounded in items
  const firstTop = items.find((i) => ['Shirt', 'T-Shirt', 'Top', 'Kurta'].includes(i.category))?.name || 'your crisp shirt';
  const firstBottom = items.find((i) => ['Trousers', 'Jeans', 'Shorts'].includes(i.category))?.name || 'your dark denim';
  const firstShoe = items.find((i) => i.category === 'Shoes')?.name || 'clean footwear';

  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('tomorrow') || lowerMsg.includes('wear')) {
    return {
      text: `For a sharp, effortless look tomorrow, I recommend pairing your **${firstTop}** with **${firstBottom}**, anchored by **${firstShoe}**. This keeps the aesthetic balanced and comfortable for ${profile.lifestyle} while maintaining clean proportions.`,
      outfitTip: 'Cuff the sleeves slightly for a modern, relaxed touch.',
    };
  }

  if (lowerMsg.includes('stylish') || lowerMsg.includes('more stylish')) {
    return {
      text: `To elevate any look using what you already own:
1. **Rule of Thirds**: Tuck in ${firstTop} into ${firstBottom} to elongate leg lines.
2. **Accessory Focus**: Add your watch or minimalist jewelry to add intentional focal points.
3. **Footwear Contrast**: Ensure your shoes contrast cleanly with your trousers.`,
      outfitTip: 'Small adjustments like tucking and sleeve rolling transform basic pieces into curated looks.',
    };
  }

  return {
    text: `Based on your wardrobe, pairing your **${firstTop}** with **${firstBottom}** gives you maximum versatility for ${profile.targetOccasion}. Your existing collection already has great color harmony!`,
    outfitTip: 'Stick to monochromatic or complementary neutral tones for effortless elegance.',
  };
}

// 5. Gemini AI Cloth Consultation (Occasion, Age, Weather, Comfort aware)
export async function generateGeminiClothConsultation(
  items: WardrobeClothingItem[],
  input: ClothConsultationInput
): Promise<ClothConsultationResult> {
  const cleanWardrobe = getAvailableWardrobe(items);
  const pool = cleanWardrobe.length >= 2 ? cleanWardrobe : items;

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const itemsSummary = pool.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        color: i.color,
        pattern: i.pattern,
        style: i.style,
        fit: i.fit,
        season: i.season,
      }));

      const lang = input.languagePreference || 'Hinglish';
      const prompt = `You are celebrity fashion stylist Annu Dhaneja at GurucraftPro.
The client needs an immediate, highly tailored outfit recommendation for a specific occasion using ONLY their clean, uploaded wardrobe items.

CONSULTATION BRIEF:
- Who is this for: ${input.targetPerson || 'Adult'}
- Occasion / Destination: ${input.occasion}
- Desired Vibe: ${input.desiredVibe?.join(', ') || 'Smart Casual'}
- Weather: ${input.weather || 'Normal'}
- Comfort Level: ${input.comfortLevel || 'Normal'}
- Color Preference: ${input.colorPreference || 'Any'}
- Avoid: ${input.avoidItems || 'None'}
- Language for explanation: ${lang}

AVAILABLE CLEAN WARDROBE ITEMS (Must use only these IDs):
${JSON.stringify(itemsSummary, null, 2)}

REQUIREMENTS:
1. Select 2-5 item IDs from the list (1 top, 1 bottom, 1 footwear, optional jacket/accessory).
2. Write "whyThisWorks": A warm, human, non-robotic explanation in ${lang} explaining why this combination works (color harmony, silhouette balance, weather comfort, age suitability, and zero-shopping empowerment).
3. Return valid JSON:
{
  "title": "Crisp Descriptive Outfit Title (e.g. Sharp Presentation & All-Day Ease)",
  "itemIds": ["id1", "id2", "id3"],
  "whyThisWorks": "Human-friendly explanation in ${lang}",
  "comfortRating": 5
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.itemIds && Array.isArray(parsed.itemIds)) {
        const itemMap = new Map<string, WardrobeClothingItem>();
        pool.forEach((i) => itemMap.set(i.id, i));

        const mappedItems: WardrobeClothingItem[] = parsed.itemIds
          .map((id: string) => itemMap.get(id))
          .filter((item: WardrobeClothingItem | undefined): item is WardrobeClothingItem => Boolean(item));

        if (mappedItems.length >= 2) {
          const whyText = parsed.whyThisWorks || 'Clean styling proportion matching your occasion and weather.';
          const outfitTitle = parsed.title || `${input.occasion || 'Smart'} Styled Outfit`;
          const vibeName = (input.desiredVibe && input.desiredVibe[0]) || (input as any).vibeWant || 'Smart & Balanced';

          return {
            id: `consult-${Date.now()}`,
            quickTakeaway: `${input.occasion || 'Occasion'} ready: ${outfitTitle}`,
            bestOutfit: {
              title: outfitTitle,
              vibe: vibeName,
              items: mappedItems,
              whyItWorks: whyText,
              stylingTip:
                lang === 'Hinglish'
                  ? 'Is outfit ko clean posture aur minimal tuck ke saath carry karein.'
                  : 'Maintain clean visual proportion with balanced accessories.',
              footwearAdvice: 'Low-top clean footwear or loafers.',
              accessories: ['Subtle watch or minimal jewellery'],
            },
            alternativeOutfit: {
              title: `${input.occasion || 'Occasion'} Alternative Plan B`,
              vibe: 'Relaxed Minimalist',
              items: mappedItems.slice(0, 2),
              whyItWorks: 'Alternative balance utilizing your existing wardrobe.',
              stylingTip: 'Roll up sleeves for an effortless relaxed feel.',
            },
            title: outfitTitle,
            recommendedItems: mappedItems,
            whyThisWorks: whyText,
            occasion: input.occasion,
            weather: input.weather,
            language: (input.languagePreference as any) || 'Hinglish',
            comfortRating: parsed.comfortRating || 5,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Gemini cloth consultation fallback:', e);
  }

  return generateLocalClothConsultation(items, input);
}

// 6. Gemini 3 Looks From 1 Item
export async function generateGemini3Looks(
  heroItem: WardrobeClothingItem,
  allItems: WardrobeClothingItem[],
  lang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish'
): Promise<Item3LooksResult> {
  const cleanWardrobe = getAvailableWardrobe(allItems);

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const otherItems = cleanWardrobe
        .filter((i) => i.id !== heroItem.id)
        .map((i) => ({ id: i.id, name: i.name, category: i.category, color: i.color, style: i.style }));

      const prompt = `You are celebrity fashion stylist Annu Dhaneja.
Generate "3 Looks From 1 Item" for hero piece: "${heroItem.name}" (${heroItem.category}, ${heroItem.color}, ${heroItem.style}).
Use ONLY the client's existing items below:
${JSON.stringify(otherItems, null, 2)}

Provide 3 distinct looks:
1. Everyday Casual (effortless daily vibe)
2. Smart Work/Social (clean, polished, elevated)
3. Evening / Occasion (statement, layered, sharp)

Language: ${lang}.

Return JSON:
{
  "look1Everyday": {
    "title": "Look 1 — Everyday Casual",
    "itemIds": ["id1", "id2"],
    "explanation": "Short 1-2 sentence stylist note in ${lang}"
  },
  "look2Smart": {
    "title": "Look 2 — Smart Work & Social",
    "itemIds": ["id3", "id4"],
    "explanation": "Short 1-2 sentence stylist note in ${lang}"
  },
  "look3Occasion": {
    "title": "Look 3 — Evening & Occasion",
    "itemIds": ["id5", "id6"],
    "explanation": "Short 1-2 sentence stylist note in ${lang}"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const itemMap = new Map<string, WardrobeClothingItem>();
      cleanWardrobe.forEach((i) => itemMap.set(i.id, i));

      const mapLook = (look: any, defaultTitle: string) => {
        const extra = (look?.itemIds || [])
          .map((id: string) => itemMap.get(id))
          .filter(Boolean) as WardrobeClothingItem[];
        return {
          title: look?.title || defaultTitle,
          items: [heroItem, ...extra],
          matchedItems: extra,
          explanation: look?.explanation || 'Versatile styling pairing using your existing closet.',
        };
      };

      if (parsed.look1Everyday && parsed.look2Smart && parsed.look3Occasion) {
        const l1 = mapLook(parsed.look1Everyday, 'Look 1 — Everyday Casual');
        const l2 = mapLook(parsed.look2Smart, 'Look 2 — Smart Work / Social');
        const l3 = mapLook(parsed.look3Occasion, 'Look 3 — Evening & Occasion');

        const looksArray = [
          {
            title: l1.title,
            occasion: 'Casual Day Out',
            vibe: 'Relaxed & Effortless',
            matchedItems: l1.matchedItems,
            items: l1.items,
            stylingTip: l1.explanation,
            explanation: l1.explanation,
            colorHarmony: `${heroItem.color} with everyday casual staples.`,
            footwearSuggestion: 'Low-top clean sneakers',
            accessories: ['Casual bag'],
          },
          {
            title: l2.title,
            occasion: 'Work & Professional',
            vibe: 'Polished & Smart',
            matchedItems: l2.matchedItems,
            items: l2.items,
            stylingTip: l2.explanation,
            explanation: l2.explanation,
            colorHarmony: 'Tailored neutral contrast.',
            footwearSuggestion: 'Loafers or clean dress shoes',
            accessories: ['Classic watch'],
          },
          {
            title: l3.title,
            occasion: 'Evening & Occasion',
            vibe: 'Elevated & Striking',
            matchedItems: l3.matchedItems,
            items: l3.items,
            stylingTip: l3.explanation,
            explanation: l3.explanation,
            colorHarmony: 'Monochrome or sharp accent pairing.',
            footwearSuggestion: 'Dress shoes or formal footwear',
            accessories: ['Evening accessories'],
          },
        ];

        return {
          heroItem,
          heroItemSummary: `Styling ${heroItem.name} across Everyday Casual, Smart Work, and Evening Occasions.`,
          looks: looksArray,
          look1Everyday: l1,
          look2Smart: l2,
          look3Occasion: l3,
          stylingSecret: `Changing companion items and shoes transforms ${heroItem.name} completely.`,
        };
      }
    }
  } catch (e) {
    console.warn('Gemini 3 looks fallback:', e);
  }

  return generateLocal3LooksFromItem(heroItem, allItems, lang);
}

// 7. Gemini Buy or Don't Buy Decision Analysis
export async function generateGeminiBuyDecision(
  queryItem: string,
  items: WardrobeClothingItem[],
  lang: 'English' | 'Hindi' | 'Hinglish' = 'Hinglish'
): Promise<BuyOrDontBuyAnalysis> {
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const itemsSummary = items.map((i) => `${i.name} (${i.category}, ${i.color}, ${i.style})`).join(', ');

      const prompt = `You are celebrity fashion stylist and sustainable shopping advisor Annu Dhaneja at GurucraftPro.
The client is considering purchasing: "${queryItem}".

CURRENT CLIENT WARDROBE:
${itemsSummary}

YOUR MISSION:
Analyze if this purchase is genuinely needed or redundant.
Prioritize: "Shop your own closet first before spending money."

Language: ${lang}.

Return JSON:
{
  "decision": "DO_NOT_BUY" | "WARDROBE_GAP_DETECTED" | "OPTIONAL_ACCENT",
  "verdictTitle": "Crisp Headline (e.g. 🛑 Don't Buy — You Own 4 Similar Tops! or ✅ Genuine Wardrobe Gap)",
  "detailedReason": "2-3 sentences explaining in ${lang} why they should or should not buy.",
  "potentialCombinationsCount": number of new outfits this piece would unlock,
  "smartAlternativeAdvice": "Actionable restyling advice in ${lang}"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.decision && parsed.verdictTitle) {
        return {
          queryItem,
          decision: parsed.decision,
          verdictTitle: parsed.verdictTitle,
          detailedReason: parsed.detailedReason,
          existingSimilarItems: items.slice(0, 3),
          potentialCombinationsCount: parsed.potentialCombinationsCount || 0,
          smartAlternativeAdvice: parsed.smartAlternativeAdvice || 'Try restyling what you have first.',
        };
      }
    }
  } catch (e) {
    console.warn('Gemini buy decision fallback:', e);
  }

  return analyzeBuyOrDontBuy(queryItem, items, lang);
}

// 8. Gemini Travel Packing Planner
export async function generateGeminiTravelPlan(
  input: TravelPlannerInput,
  items: WardrobeClothingItem[]
): Promise<TravelPackingPlan> {
  const cleanWardrobe = getAvailableWardrobe(items);
  const pool = cleanWardrobe.length >= 3 ? cleanWardrobe : items;

  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
      const ai = getGemini();

      const itemsSummary = pool.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        color: i.color,
      }));

      const prompt = `You are celebrity fashion stylist Annu Dhaneja.
Create a compact, ultra-efficient Travel Outfit Packing Plan for:
- Destination: ${input.destination}
- Duration: ${input.daysCount} days
- Weather: ${input.weather}
- Occasion: ${input.occasion}

CLIENT WARDROBE ITEMS (MUST ONLY USE THESE IDs):
${JSON.stringify(itemsSummary, null, 2)}

RULE: Maximize bottom/footwear reuse across days to minimize luggage weight.

Return JSON:
{
  "dailyOutfits": [
    {
      "dayNumber": 1,
      "title": "Day 1 — Travel & Airport Comfort",
      "itemIds": ["id1", "id2", "id3"],
      "notes": "Lightweight breathable pairing for transit."
    },
    ... up to ${input.daysCount} days
  ],
  "packingSummary": "1-2 sentence packing strategy note"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.dailyOutfits && Array.isArray(parsed.dailyOutfits)) {
        const itemMap = new Map<string, WardrobeClothingItem>();
        pool.forEach((i) => itemMap.set(i.id, i));

        const packedSet = new Set<string>();

        const dailyOutfits = parsed.dailyOutfits.map((d: any) => {
          const outfitItems = (d.itemIds || [])
            .map((id: string) => itemMap.get(id))
            .filter(Boolean) as WardrobeClothingItem[];
          outfitItems.forEach((i) => packedSet.add(i.id));
          return {
            dayNumber: d.dayNumber,
            title: d.title || `Day ${d.dayNumber}`,
            items: outfitItems.length > 0 ? outfitItems : pool.slice(0, 3),
            notes: d.notes || 'Versatile daily travel pairing.',
          };
        });

        const essentialItems = pool.filter((i) => packedSet.has(i.id));
        const optionalAccents = pool.filter((i) => !packedSet.has(i.id) && ['Watch', 'Bag', 'Accessories'].includes(i.category)).slice(0, 2);

        return {
          destination: input.destination,
          daysCount: input.daysCount,
          dailyOutfits,
          essentialItems,
          optionalAccents,
          packingSummary: parsed.packingSummary || `Smart travel capsule packed in ${essentialItems.length} core pieces.`,
        };
      }
    }
  } catch (e) {
    console.warn('Gemini travel plan fallback:', e);
  }

  return generateLocalTravelPlan(input, items);
}

