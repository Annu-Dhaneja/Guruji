import { GoogleGenAI } from '@google/genai';
import {
  servicesData,
  vantageServicesData,
  quickServicesData,
  productsData,
  bookCoverPackages,
} from './db';
import { SalesRecommendation } from '../src/types';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || 'MOCK_KEY';
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessageParam {
  sender: 'user' | 'agent' | 'system';
  text: string;
}

export interface ProcessSalesChatResult {
  reply: string;
  languageDetected: 'Hindi' | 'Hinglish' | 'English';
  intent: 'discovery' | 'recommendation' | 'objection_handling' | 'high_intent' | 'lead_captured' | 'checkout';
  recommendedServices: SalesRecommendation[];
  leadCapturePrompt: boolean;
  actionType?: 'add_to_cart' | 'view_service' | 'checkout' | 'inquiry_form' | 'whatsapp';
  actionPayload?: {
    serviceId?: string;
    title?: string;
    price?: number;
    slug?: string;
    category?: string;
  };
}

/**
 * Builds real catalog summary from DB
 */
function buildCatalogContext(): string {
  const catalogLines: string[] = [];

  catalogLines.push('--- REAL SERVICES & PACKAGES CATALOG (DO NOT INVENT PRICING OR SERVICES) ---');

  // Graphic Design & Brand Services
  catalogLines.push('\n[CATEGORY: Graphic Design & Branding]');
  servicesData.forEach((s) => {
    catalogLines.push(
      `- Service ID: "${s.id}" | Title: "${s.title}" | Starting Price: ₹${s.startingPrice} | Category: ${s.categoryName} | Features: ${s.features.join(', ')} | Description: ${s.description}`
    );
  });

  // Vantage E-Commerce Photo Editing Services
  catalogLines.push('\n[CATEGORY: Vantage E-Commerce Product Image Editing & Amazon Standards]');
  vantageServicesData.forEach((v) => {
    const pkgs = v.packages.map((p) => `${p.name}: ₹${p.price}/${p.unit} (${p.features.slice(0, 2).join(';')})`).join(' | ');
    catalogLines.push(
      `- Service ID: "${v.id}" | Slug: "${v.slug}" | Title: "${v.title}" | Starting Price: ₹${v.startingPrice} | Delivery: ${v.deliveryTime} | Packages: [${pkgs}] | Description: ${v.shortDescription}`
    );
  });

  // Quick 30-60 Min Fix Services
  catalogLines.push('\n[CATEGORY: Quick Digital Fixes (Instant 30-60 Min Turnaround)]');
  quickServicesData.forEach((q) => {
    catalogLines.push(
      `- Service ID: "${q.id}" | Title: "${q.name}" | Price: ₹${q.price} | Delivery: ${q.deliveryTime} | Common Fixes: ${q.commonProblems.join(', ')}`
    );
  });

  // Book Cover Design Packages
  catalogLines.push('\n[CATEGORY: Book Cover & Publishing Design]');
  bookCoverPackages.forEach((b) => {
    catalogLines.push(
      `- Package: "${b.name}" | Price: ₹${b.price} | Turnaround: ${b.turnaround} | Includes: ${b.features.join(', ')}`
    );
  });

  // Wardrobe Style Consultation
  catalogLines.push('\n[CATEGORY: Wardrobe Style Consultation]');
  catalogLines.push(
    `- 7-Day Capsule Wardrobe Consultation: ₹1,499 (7 Complete Outfits, Color Harmony Matrix, Jewelry & Shoe Pairing by Annu Dhaneja)`
  );
  catalogLines.push(
    `- Occasion & Event Styling Package: ₹1,999 (3 Event Lookbooks for weddings/festivals/corporate with shopping links)`
  );

  return catalogLines.join('\n');
}

/**
 * Intelligent local catalog matcher (Used for instant matching & fallback)
 */
export function matchCatalogHeuristically(userQuery: string): SalesRecommendation[] {
  const query = userQuery.toLowerCase();
  const matched: SalesRecommendation[] = [];

  // 1. Logo / Branding / Business Card
  if (query.includes('logo') || query.includes('brand') || query.includes('identity') || query.includes('visiting card') || query.includes('business card')) {
    const logoSrv = servicesData.find((s) => s.id === 'srv-gd-1');
    const cardSrv = servicesData.find((s) => s.id === 'srv-gd-5');
    if (logoSrv) {
      matched.push({
        id: logoSrv.id,
        title: logoSrv.title,
        category: logoSrv.category,
        categoryName: logoSrv.categoryName,
        startingPrice: logoSrv.startingPrice,
        description: logoSrv.description,
        imageUrl: logoSrv.imageUrl,
        features: logoSrv.features,
        bestFor: 'New businesses, startups & luxury rebranding',
      });
    }
    if (cardSrv && !matched.find((m) => m.id === cardSrv.id)) {
      matched.push({
        id: cardSrv.id,
        title: cardSrv.title,
        category: cardSrv.category,
        categoryName: cardSrv.categoryName,
        startingPrice: cardSrv.startingPrice,
        description: cardSrv.description,
        imageUrl: cardSrv.imageUrl,
        features: cardSrv.features,
        bestFor: 'Print-ready double sided luxury embossed visiting cards',
      });
    }
  }

  // 2. Social Media / Instagram / YouTube Banner / Thumbnail
  if (query.includes('social media') || query.includes('instagram') || query.includes('banner') || query.includes('thumbnail') || query.includes('youtube') || query.includes('post')) {
    const socialSrv = servicesData.find((s) => s.id === 'srv-gd-2');
    if (socialSrv) {
      matched.push({
        id: socialSrv.id,
        title: socialSrv.title,
        category: socialSrv.category,
        categoryName: socialSrv.categoryName,
        startingPrice: socialSrv.startingPrice,
        description: socialSrv.description,
        imageUrl: socialSrv.imageUrl,
        features: socialSrv.features,
        bestFor: 'Creators, influencers & digital marketing campaigns',
      });
    }
  }

  // 3. E-commerce / Amazon / Flipkart / Background Removal / Ghost Mannequin
  if (query.includes('amazon') || query.includes('flipkart') || query.includes('background') || query.includes('bg removal') || query.includes('product photo') || query.includes('ecom') || query.includes('ghost mannequin') || query.includes('photo edit')) {
    const amazonSrv = vantageServicesData.find((v) => v.slug === 'amazon-pure-white-background' || v.id === 'v-srv-1');
    const ghostSrv = vantageServicesData.find((v) => v.slug === 'ghost-mannequin-apparel' || v.id === 'v-srv-3');
    if (amazonSrv) {
      matched.push({
        id: amazonSrv.id,
        title: amazonSrv.title,
        category: 'vantage-marketplace',
        categoryName: 'Vantage E-Commerce',
        startingPrice: amazonSrv.startingPrice,
        description: amazonSrv.shortDescription,
        imageUrl: amazonSrv.imageUrl,
        slug: amazonSrv.slug,
        features: amazonSrv.features.slice(0, 4),
        packages: amazonSrv.packages.map((p) => ({
          name: p.name,
          price: p.price,
          deliveryTime: p.deliveryTime,
          features: p.features,
          bestFor: p.popular ? 'Most Popular for Amazon/Flipkart' : undefined,
        })),
        bestFor: 'Amazon RGB 255 White Background compliance',
      });
    }
    if (ghostSrv && matched.length < 3) {
      matched.push({
        id: ghostSrv.id,
        title: ghostSrv.title,
        category: 'vantage-marketplace',
        categoryName: 'Vantage E-Commerce',
        startingPrice: ghostSrv.startingPrice,
        description: ghostSrv.shortDescription,
        imageUrl: ghostSrv.imageUrl,
        slug: ghostSrv.slug,
        features: ghostSrv.features.slice(0, 3),
        bestFor: 'Apparel, sarees, lehengas & hollow mannequin listing',
      });
    }
  }

  // 4. Wardrobe / Clothes / Styling / Capsule Outfit
  if (query.includes('wardrobe') || query.includes('kapde') || query.includes('styling') || query.includes('dress') || query.includes('outfit') || query.includes('capsule') || query.includes('wedding')) {
    const wardrobeSrv = servicesData.find((s) => s.id === 'srv-ws-1');
    if (wardrobeSrv) {
      matched.push({
        id: wardrobeSrv.id,
        title: wardrobeSrv.title,
        category: wardrobeSrv.category,
        categoryName: wardrobeSrv.categoryName,
        startingPrice: wardrobeSrv.startingPrice,
        description: wardrobeSrv.description,
        imageUrl: wardrobeSrv.imageUrl,
        features: wardrobeSrv.features,
        bestFor: 'Personalized 7-day capsule outfit styling with shoes & accessory guide',
      });
    }
  }

  // 5. Book Cover / Novel / Kindle / Amazon KDP
  if (query.includes('book') || query.includes('cover') || query.includes('kindle') || query.includes('kdp') || query.includes('novel') || query.includes('author') || query.includes('paperback')) {
    const bookSrv = servicesData.find((s) => s.id === 'srv-bc-1');
    if (bookSrv) {
      matched.push({
        id: bookSrv.id,
        title: bookSrv.title,
        category: bookSrv.category,
        categoryName: bookSrv.categoryName,
        startingPrice: bookSrv.startingPrice,
        description: bookSrv.description,
        imageUrl: bookSrv.imageUrl,
        features: bookSrv.features,
        bestFor: 'Amazon KDP Paperback, Kindle and 3D photorealistic mockups',
      });
    }
  }

  // 6. Quick Urgent Fix (30-60 mins)
  if (query.includes('urgent') || query.includes('jaldi') || query.includes('quick') || query.includes('blur') || query.includes('low res') || query.includes('vector') || query.includes('fix')) {
    const quickVector = quickServicesData.find((q) => q.id === 'qfix-vectorize');
    const quickBlur = quickServicesData.find((q) => q.id === 'qfix-unblur');
    if (quickVector && matched.length < 3) {
      matched.push({
        id: quickVector.id,
        title: quickVector.name,
        category: 'quick-services',
        categoryName: 'Quick Digital Fix (30 Mins)',
        startingPrice: quickVector.price,
        description: quickVector.description,
        imageUrl: quickVector.thumbnailUrl,
        features: quickVector.commonProblems.slice(0, 3),
        bestFor: 'Instant 30-min vectorization & print readiness',
      });
    } else if (quickBlur && matched.length < 3) {
      matched.push({
        id: quickBlur.id,
        title: quickBlur.name,
        category: 'quick-services',
        categoryName: 'Quick Digital Fix (30 Mins)',
        startingPrice: quickBlur.price,
        description: quickBlur.description,
        imageUrl: quickBlur.thumbnailUrl,
        features: quickBlur.commonProblems.slice(0, 3),
        bestFor: 'AI HD unblurring and photo sharpening',
      });
    }
  }

  // Default fallback recommendation if nothing matched yet
  if (matched.length === 0) {
    const featuredLogo = servicesData[0];
    const featuredWardrobe = servicesData.find((s) => s.id === 'srv-ws-1') || servicesData[1];
    if (featuredLogo) {
      matched.push({
        id: featuredLogo.id,
        title: featuredLogo.title,
        category: featuredLogo.category,
        categoryName: featuredLogo.categoryName,
        startingPrice: featuredLogo.startingPrice,
        description: featuredLogo.description,
        imageUrl: featuredLogo.imageUrl,
        features: featuredLogo.features,
        bestFor: 'Professional Brand Identity & Vector Design',
      });
    }
    if (featuredWardrobe) {
      matched.push({
        id: featuredWardrobe.id,
        title: featuredWardrobe.title,
        category: featuredWardrobe.category,
        categoryName: featuredWardrobe.categoryName,
        startingPrice: featuredWardrobe.startingPrice,
        description: featuredWardrobe.description,
        imageUrl: featuredWardrobe.imageUrl,
        features: featuredWardrobe.features,
        bestFor: 'Curated 7-Day Capsule Wardrobe Consultation',
      });
    }
  }

  return matched;
}

/**
 * Main AI Sales Agent processing handler
 */
export async function processSalesChat(
  userMessage: string,
  history: ChatMessageParam[] = []
): Promise<ProcessSalesChatResult> {
  const query = userMessage.trim();
  const catalogContext = buildCatalogContext();

  // Detect high intent signals
  const lowerQuery = query.toLowerCase();
  const isHighIntent =
    lowerQuery.includes('order') ||
    lowerQuery.includes('buy') ||
    lowerQuery.includes('checkout') ||
    lowerQuery.includes('payment') ||
    lowerQuery.includes('lena hai') ||
    lowerQuery.includes('kharidna') ||
    lowerQuery.includes('price batao abhi') ||
    lowerQuery.includes('book karo') ||
    lowerQuery.includes('cart');

  // Detect language hint
  let languageHint: 'Hindi' | 'Hinglish' | 'English' = 'Hinglish';
  const hindiChars = /[\u0900-\u097F]/;
  if (hindiChars.test(query)) {
    languageHint = 'Hindi';
  } else if (
    lowerQuery.includes('kya') ||
    lowerQuery.includes('hai') ||
    lowerQuery.includes('mujhe') ||
    lowerQuery.includes('kaise') ||
    lowerQuery.includes('chahiye') ||
    lowerQuery.includes('hoga') ||
    lowerQuery.includes('karna') ||
    lowerQuery.includes('batao')
  ) {
    languageHint = 'Hinglish';
  } else {
    languageHint = 'English';
  }

  // System Prompt for Gemini 3.7 Flash
  const systemInstruction = `
You are the "GurucraftPro AI Sales Assistant" for GurucraftPro (Founded by Annu Dhaneja in Rohini, Delhi).
Tagline: "Tell me what you need — I'll help you find the right solution."

OBJECTIVE:
You are an expert digital sales consultant, NOT a generic chatbot. Your goal is to guide visitors smoothly:
Visitor -> Understand requirement -> Recommend right service/product from live catalog -> Explain real benefits -> Handle objections honestly -> Show existing options -> Create qualified enquiry/lead -> Guide toward checkout/contact.

STRICT RULES:
1. ALWAYS respond in the SAME language used by the customer (${languageHint}). Support Hindi, Hinglish, and English fluently.
2. NEVER invent fake services, fake prices, or fake scarcity ("only 2 slots left", "discount ending in 5 mins").
3. Use the REAL website catalog provided below as your absolute source of truth.
4. Keep replies concise, friendly, professional, confident, and conversational (2-4 sentences max per response). Avoid robotic lists unless comparing packages.
5. SALES DISCOVERY: Ask only 1 or 2 relevant discovery questions at a time (e.g. business type, style, timeline, or quantity).
6. ETHICAL CROSS-SELLING / BUNDLES: Suggest complementary items only when genuinely helpful (e.g. Logo + Business Card + Social Media kit, or Amazon White BG + Ghost Mannequin).
7. OBJECTION HANDLING:
   - "Price zyada hai": Respectfully acknowledge, explain quality/source files included, and recommend lighter entry packages (e.g. Quick Fix starting ₹299 or visiting card ₹999).
   - "Kitne time mein milega": Quote exact delivery times (e.g. Quick Fix 30-60 mins, Logos 24-48 hrs, Wardrobe lookbook 2-3 days).
   - "Mujhe sochna hai": Offer a short summary or offer to save an enquiry for easy follow-up on WhatsApp.
8. HIGH-INTENT SIGNALS: When user says "order kaise karu", "checkout kahan hai", "abhi lena hai", guide them immediately to Add to Cart / Checkout / WhatsApp link.

REAL CATALOG CONTEXT:
${catalogContext}

OUTPUT FORMAT:
Provide your response strictly in valid JSON format with the following JSON schema:
{
  "reply": "Your natural conversational response in customer language",
  "languageDetected": "Hindi" | "Hinglish" | "English",
  "intent": "discovery" | "recommendation" | "objection_handling" | "high_intent" | "lead_captured" | "checkout",
  "leadCapturePrompt": true | false,
  "actionType": "add_to_cart" | "view_service" | "checkout" | "inquiry_form" | "whatsapp" | null,
  "matchedServiceIds": ["srv-gd-1", "srv-gd-5"]
}
`;

  try {
    const ai = getGeminiClient();
    const contents: any[] = [];

    // Append conversation history
    history.slice(-6).forEach((h) => {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    });

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: query }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsed: any = null;

    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      // Fallback JSON clean up
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    if (parsed && parsed.reply) {
      // Find matching recommendation objects from real catalog
      const matchedIds: string[] = Array.isArray(parsed.matchedServiceIds) ? parsed.matchedServiceIds : [];
      let recommendations: SalesRecommendation[] = [];

      matchedIds.forEach((id) => {
        const srv = servicesData.find((s) => s.id === id);
        if (srv) {
          recommendations.push({
            id: srv.id,
            title: srv.title,
            category: srv.category,
            categoryName: srv.categoryName,
            startingPrice: srv.startingPrice,
            description: srv.description,
            imageUrl: srv.imageUrl,
            features: srv.features,
          });
        }
        const vantage = vantageServicesData.find((v) => v.id === id || v.slug === id);
        if (vantage) {
          recommendations.push({
            id: vantage.id,
            title: vantage.title,
            category: 'vantage-marketplace',
            categoryName: 'Vantage E-Commerce',
            startingPrice: vantage.startingPrice,
            description: vantage.shortDescription,
            imageUrl: vantage.imageUrl,
            slug: vantage.slug,
            features: vantage.features.slice(0, 3),
            packages: vantage.packages.map((p) => ({
              name: p.name,
              price: p.price,
              deliveryTime: p.deliveryTime,
              features: p.features,
            })),
          });
        }
        const quick = quickServicesData.find((q) => q.id === id);
        if (quick) {
          recommendations.push({
            id: quick.id,
            title: quick.name,
            category: 'quick-services',
            categoryName: 'Quick Digital Fix',
            startingPrice: quick.price,
            description: quick.description,
            imageUrl: quick.thumbnailUrl,
            features: quick.commonProblems.slice(0, 3),
          });
        }
      });

      // If model didn't return matches or returned empty, supplement with heuristic matcher
      if (recommendations.length === 0) {
        recommendations = matchCatalogHeuristically(query);
      }

      // Determine primary action
      let actionPayload: any = undefined;
      if (recommendations.length > 0) {
        const primary = recommendations[0];
        actionPayload = {
          serviceId: primary.id,
          title: primary.title,
          price: primary.startingPrice,
          slug: primary.slug,
          category: primary.category,
        };
      }

      return {
        reply: parsed.reply,
        languageDetected: parsed.languageDetected || languageHint,
        intent: parsed.intent || (isHighIntent ? 'high_intent' : 'recommendation'),
        recommendedServices: recommendations.slice(0, 3),
        leadCapturePrompt: !!parsed.leadCapturePrompt,
        actionType: parsed.actionType || (isHighIntent ? 'checkout' : 'add_to_cart'),
        actionPayload,
      };
    }
  } catch (err) {
    console.warn('[SalesAgent] Gemini API fallback triggered:', err);
  }

  // ==================== ROBUST CLIENT-SAFE FALLBACK ====================
  // Generates natural bilingual response if API key is in development or offline
  const fallbackRecs = matchCatalogHeuristically(query);
  const primaryRec = fallbackRecs[0];

  let fallbackReply = '';
  if (languageHint === 'Hindi') {
    if (isHighIntent) {
      fallbackReply = `बिल्कुल! आप GurucraftPro पर "${primaryRec.title}" (शुरुआती कीमत ₹${primaryRec.startingPrice}) के लिए तुरंत कार्ट में ऐड करके चेकआउट जारी रख सकते हैं। क्या आप अभी ऑर्डर प्रोसेस शुरू करना चाहेंगे?`;
    } else {
      fallbackReply = `नमस्ते! आपकी आवश्यकता के अनुसार hamare pass "${primaryRec.title}" उपलब्ध है (शुरुआती कीमत ₹${primaryRec.startingPrice})। इसमें आपको उच्च गुणवत्ता के सोर्स फाइल्स और रिविजन्स मिलते हैं। क्या आप इसके बारे में और जानना चाहते हैं?`;
    }
  } else if (languageHint === 'Hinglish') {
    if (isHighIntent) {
      fallbackReply = `Bilkul! Aap GurucraftPro par "${primaryRec.title}" (Starting ₹${primaryRec.startingPrice}) ko direct Cart mein add karke checkout proceed kar sakte hain. Main aapko checkout par guide kar doon?`;
    } else {
      fallbackReply = `Namaste! Aapke requirement ke according hamara "${primaryRec.title}" (Starting ₹${primaryRec.startingPrice}) best option hai. Isme aapko professional source files aur customized layouts milenge. Aapka business kis category mein hai?`;
    }
  } else {
    if (isHighIntent) {
      fallbackReply = `Certainly! You can add "${primaryRec.title}" (starting at ₹${primaryRec.startingPrice}) directly to your cart and proceed to secure checkout. Would you like to proceed now?`;
    } else {
      fallbackReply = `Hello! Based on your requirement, our "${primaryRec.title}" (starting at ₹${primaryRec.startingPrice}) is a great fit. It includes high-resolution print/web source files and fast delivery. May I know a little more about your preferred style or deadline?`;
    }
  }

  return {
    reply: fallbackReply,
    languageDetected: languageHint,
    intent: isHighIntent ? 'high_intent' : 'recommendation',
    recommendedServices: fallbackRecs.slice(0, 3),
    leadCapturePrompt: isHighIntent,
    actionType: isHighIntent ? 'checkout' : 'add_to_cart',
    actionPayload: {
      serviceId: primaryRec.id,
      title: primaryRec.title,
      price: primaryRec.startingPrice,
      slug: primaryRec.slug,
      category: primaryRec.category,
    },
  };
}
