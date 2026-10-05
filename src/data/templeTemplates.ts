export interface TempleCategory {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  bgGradient: string;
}

export interface TempleTemplate {
  id: string;
  name: string;
  hindiName: string;
  categoryId: string;
  categoryLabel: string;
  imageUrl: string;
  frameStyle: 'golden-filigree' | 'temple-arch' | 'lotus-glow' | 'velvet-royal' | 'sacred-aura' | 'diya-floral';
  frameColor: string;
  borderWidth: string;
  mantra: string;
  defaultHindiVachan: string;
  defaultEnglishBlessing: string;
  themeAura: 'gold' | 'rose' | 'amber' | 'cyan' | 'ruby';
  attribution: string;
  aspectRatio: string;
}

export const TEMPLE_CATEGORIES: TempleCategory[] = [
  {
    id: 'all',
    name: 'All Temple Mandirs',
    hindiName: 'सभी मंदिर धाम',
    icon: '🏛️',
    description: 'Explore all sacred sanctums and temple altar templates',
    bgGradient: 'from-amber-900/40 via-slate-900 to-slate-950',
  },
  {
    id: 'bade-mandir',
    name: 'Bade Mandir Shivalik Darbar',
    hindiName: 'बड़े मंदिर दरबार',
    icon: '🕉️',
    description: 'Iconic Shivalik holy sanctum with royal chandeliers and fragrant marigold festoons',
    bgGradient: 'from-amber-950/60 via-slate-950 to-slate-900',
  },
  {
    id: 'golden-lotus',
    name: 'Golden Lotus Mandir',
    hindiName: 'स्वर्ण कमल मंदिर',
    icon: '🪷',
    description: 'Divine golden lotus altar with celestial radiant aura and floating petals',
    bgGradient: 'from-yellow-950/60 via-slate-950 to-slate-900',
  },
  {
    id: 'royal-sinhasan',
    name: 'Royal Velvet Sinhasan',
    hindiName: 'शाही सिंहासन दरबार',
    icon: '👑',
    description: 'Majestic crimson velvet throne surrounded by hand-carved pure gold filigree arches',
    bgGradient: 'from-rose-950/60 via-slate-950 to-slate-900',
  },
  {
    id: 'amrit-vela',
    name: 'Amrit Vela Sacred Sanctum',
    hindiName: 'अमृत वेला धाम',
    icon: '🌅',
    description: 'Spiritual early morning dawn with golden mist, sacred kalash & celestial tranquility',
    bgGradient: 'from-orange-950/60 via-slate-950 to-slate-900',
  },
  {
    id: 'himalayan-kailash',
    name: 'Himalayan Kailash Temple',
    hindiName: 'कैलाश धाम',
    icon: '🏔️',
    description: 'Sacred snow-capped spiritual peaks with eternal Shivling and cosmic peace',
    bgGradient: 'from-sky-950/60 via-slate-950 to-slate-900',
  },
  {
    id: 'auspicious-jyot',
    name: 'Auspicious Jyot & Diya Mandir',
    hindiName: 'शुभ दीप ज्योति मंदिर',
    icon: '🪔',
    description: 'Glowing sacred brass oil lamps, red roses, and auspicious evening aarti ambience',
    bgGradient: 'from-amber-950/70 via-slate-950 to-slate-900',
  },
  {
    id: 'ashram-sanctum',
    name: 'Gurugram Ashram Shrine',
    hindiName: 'पवित्र आश्रम दरबार',
    icon: '🌸',
    description: 'Serene white marble sanctum with peaceful spiritual fragrance and rose garden aura',
    bgGradient: 'from-purple-950/60 via-slate-950 to-slate-900',
  },
];

export const INITIAL_TEMPLE_TEMPLATES: TempleTemplate[] = [
  {
    id: 'tmpl-bade-mandir-1',
    name: 'Bade Mandir Royal Darshan Shrine',
    hindiName: 'बड़े मंदिर दिव्य दर्शन दरबार',
    categoryId: 'bade-mandir',
    categoryLabel: 'Bade Mandir Shivalik Darbar',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'temple-arch',
    frameColor: 'border-amber-400',
    borderWidth: 'border-4',
    mantra: '॥ ॐ नमः शिवाय शुभ संध्या • बड़े मंदिर दरबार ॥',
    defaultHindiVachan: 'कल्याण किता, सब दुःख दूर किते। जिसपे गुरु की मेहर होवे, ओदी हर मुराद पूरी होवे।',
    defaultEnglishBlessing: 'May Guruji’s divine grace protect and elevate your home and family with eternal peace.',
    themeAura: 'gold',
    attribution: 'Bade Mandir Shivalik Heritage Art • Studio Catalog Ref #BM-01',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-golden-lotus-1',
    name: 'Svarn Kamal Divine Aura Throne',
    hindiName: 'स्वर्ण कमल दिव्य आभा सिंहासन',
    categoryId: 'golden-lotus',
    categoryLabel: 'Golden Lotus Mandir',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'lotus-glow',
    frameColor: 'border-yellow-400',
    borderWidth: 'border-4',
    mantra: '॥ ॐ श्री गुरुवे नमः • स्वर्ण कमल धाम ॥',
    defaultHindiVachan: 'सच्चे मन से जो भी मांगे, गुरुजी उसकी झोली भर देते हैं। अनंत शुकराना।',
    defaultEnglishBlessing: 'Bask in the golden light of the Lotus Throne. Endless gratitude for boundless blessings.',
    themeAura: 'amber',
    attribution: 'Original Golden Lotus Studio Art by Annu Dhaneja',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-royal-sinhasan-1',
    name: 'Imperial Velvet Floral Sinhasan',
    hindiName: 'शाही मखमली पुष्प सिंहासन',
    categoryId: 'royal-sinhasan',
    categoryLabel: 'Royal Velvet Sinhasan',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'velvet-royal',
    frameColor: 'border-rose-400',
    borderWidth: 'border-4',
    mantra: '॥ गुरुजी सदा सहाय • शाही दरबार ॥',
    defaultHindiVachan: 'तू चिंता ना कर, मैं तेरे नाल हाँ। हर पल तेरी रखवाली करदा हाँ।',
    defaultEnglishBlessing: 'Do not worry, Guruji holds your hand in every trial and celebration of life.',
    themeAura: 'ruby',
    attribution: 'Royal Court Devotional Series #RC-03',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-amrit-vela-1',
    name: 'Amrit Vela Celestial Dawn Altar',
    hindiName: 'अमृत वेला पावन ब्रह्म मुहूर्त',
    categoryId: 'amrit-vela',
    categoryLabel: 'Amrit Vela Sacred Sanctum',
    imageUrl: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'sacred-aura',
    frameColor: 'border-orange-400',
    borderWidth: 'border-4',
    mantra: '॥ अमृत वेला सचु नाउ वडिआई वीचारु ॥',
    defaultHindiVachan: 'अमृत वेले उठ के सिमरन करो, सारे कष्ट मिट जान गे।',
    defaultEnglishBlessing: 'Early morning meditation connects the soul directly to the cosmic fountain of grace.',
    themeAura: 'gold',
    attribution: 'Amrit Vela Meditation Collection Ref #AV-07',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-himalayan-kailash-1',
    name: 'Kailash Peak Spiritual Sanctuary',
    hindiName: 'कैलाश पर्वत शिव ज्योति धाम',
    categoryId: 'himalayan-kailash',
    categoryLabel: 'Himalayan Kailash Temple',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'golden-filigree',
    frameColor: 'border-cyan-300',
    borderWidth: 'border-4',
    mantra: '॥ कर्पूरगौरं करुणावतारं संसारसारम् ॥',
    defaultHindiVachan: 'शिव रूप गुरु, गुरु रूप शिव। जो शरण आया सो पार लगाया।',
    defaultEnglishBlessing: 'Supreme consciousness manifests to deliver peace and absolute spiritual liberation.',
    themeAura: 'cyan',
    attribution: 'Himalayan Holy Peaks Series #HP-11',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-auspicious-jyot-1',
    name: 'Deepavali Jyot & Red Rose Mandir',
    hindiName: 'शुभ दीप व गुलाब पावन मंदिर',
    categoryId: 'auspicious-jyot',
    categoryLabel: 'Auspicious Jyot & Diya Mandir',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'diya-floral',
    frameColor: 'border-amber-500',
    borderWidth: 'border-4',
    mantra: '॥ तमसो मा ज्योतिर्गमय • दीप दर्शन ॥',
    defaultHindiVachan: 'अज्ञान के अंधेरे मिट जाएं, गुरुजी की ज्योति घर-घर में जगमगाए।',
    defaultEnglishBlessing: 'Let the divine flame of Guruji’s love illuminate every corner of your heart and home.',
    themeAura: 'rose',
    attribution: 'Sacred Aarti Collection Ref #DJ-05',
    aspectRatio: '3:4',
  },
  {
    id: 'tmpl-ashram-sanctum-1',
    name: 'White Marble Garden Sanctum',
    hindiName: 'श्वेत संगमरमर आश्रम धाम',
    categoryId: 'ashram-sanctum',
    categoryLabel: 'Gurugram Ashram Shrine',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1200&q=90',
    frameStyle: 'temple-arch',
    frameColor: 'border-purple-300',
    borderWidth: 'border-4',
    mantra: '॥ ॐ नमः शिवाय शिवजी सदा सहाय ॥',
    defaultHindiVachan: 'गुरु के चरणों में ही असली सुकून है। सदा शुकराना करदे रहो।',
    defaultEnglishBlessing: 'True peace resides at the lotus feet of the Guru. Sing praises of gratitude always.',
    themeAura: 'gold',
    attribution: 'Ashram Heritage Sanctuary Series #AS-09',
    aspectRatio: '3:4',
  },
];
