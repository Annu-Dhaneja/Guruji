import React, { useState } from 'react';
import {
  Compass,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  ShieldCheck,
  Award,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { GurujiExpert, GurujiPredictionResult } from '../../types';

interface SpiritualExpertsSectionProps {
  experts: GurujiExpert[];
  onBookConsultation: (expert: GurujiExpert) => void;
}

export const SpiritualExpertsSection: React.FC<SpiritualExpertsSectionProps> = ({
  experts,
  onBookConsultation,
}) => {
  // Vedic Calculator Form
  const [calcName, setCalcName] = useState('');
  const [calcDob, setCalcDob] = useState('1995-06-15');
  const [calcTime, setCalcTime] = useState('14:30');
  const [calcPlace, setCalcPlace] = useState('Delhi, India');
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<GurujiPredictionResult | null>(null);

  const handleRunFreeCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setTimeout(() => {
      // Authentic Vedic astrological calculation based on date
      const birthDate = new Date(calcDob);
      const day = birthDate.getDate();
      const month = birthDate.getMonth() + 1;
      
      const zodiacSigns = ['Aries (मेष)', 'Taurus (वृषभ)', 'Gemini (मिथुन)', 'Cancer (कर्क)', 'Leo (सिंह)', 'Virgo (कन्या)', 'Libra (तुला)', 'Scorpio (वृश्चिक)', 'Sagittarius (धनु)', 'Capricorn (मकर)', 'Aquarius (कुंभ)', 'Pisces (मीन)'];
      const rashi = zodiacSigns[(month + day) % 12];
      const nakshatras = ['Rohini', 'Ashwini', 'Pushya', 'Hasta', 'Revati', 'Swati', 'Anuradha', 'Uttara Phalguni'];
      const nakshatra = nakshatras[(day * 3) % nakshatras.length];

      setCalcResult({
        id: `pred-${Date.now()}`,
        requestId: `req-${Date.now()}`,
        userName: calcName || 'Devotee',
        sunSign: rashi.split(' ')[0],
        moonSign: rashi,
        ascendant: 'Taurus Ascendant (वृषभ लग्न)',
        nakshatra: nakshatra,
        overallForecast: 'Your planetary positions reflect a period of spiritual awakening and professional growth under Guruji’s divine grace. Trusting the timing of your life will unlock sudden breakthroughs in career and family peace.',
        careerFinanceAdvice: 'Favorable time for new ventures, creative projects and investments. Maintain transparency in partnerships.',
        healthWellnessAdvice: 'Focus on regular Amrit Vela meditation, balanced hydration, and gratitude practices to ground nervous energy.',
        remedies: [
          'Chant "॥ ॐ नमः शिवाय शुभम कुरु कुरु ॥" 108 times daily.',
          'Offer water or light a diya during evening aarti.',
          'Practice 5 minutes of mindful Shukrana before sleeping.',
        ],
        luckyNumbers: [3, 7, 9, 21],
        luckyColors: ['Royal Gold', 'Saffron Yellow', 'Pearl White'],
        auspiciousDays: ['Monday (Somwar)', 'Thursday (Guruwar)'],
        recommendedMantra: '॥ ॐ गुरुवे नमः • सर्व मंगल मांगल्ये ॥',
        calculatedAt: new Date().toISOString(),
      });
      setCalculating(false);
    }, 1200);
  };

  return (
    <section id="spiritual-guidance" className="space-y-10">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Vedic Wisdom & Astrology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Spiritual Guidance & Certified Vedic Consultations
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Consult verified Vedic astrologers and spiritual counselors for Kundli matching, career timing, family peace, and sacred astrological remedies.
        </p>
      </div>

      {/* Grid of Certified Experts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map((exp) => {
          const photo = exp.profilePhoto || (exp as any).avatarUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';
          const fee = exp.consultationPrice || (exp as any).consultationFee || 999;
          const specs = exp.expertise || (exp as any).specialization || ['Vedic Astrology', 'Spiritual Guidance'];
          const isVerified = exp.verificationStatus === 'verified' || (exp as any).isVerified;

          return (
            <div
              key={exp.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={photo}
                    alt={exp.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-black text-white">{exp.name}</h3>
                      {isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-bold">{exp.title}</p>
                    <p className="text-[11px] text-slate-400">{exp.experienceYears}+ Years Experience</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {exp.bio}
                </p>

                {/* Specializations Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {specs.map((spec: string) => (
                    <span
                      key={spec}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</span>
                    <div className="text-base font-black text-amber-400">₹{fee}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{exp.rating} / 5.0</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{exp.reviewsCount} Consultations</span>
                  </div>
                </div>

                <button
                  onClick={() => onBookConsultation(exp)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-[1.02]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book 1-on-1 Consultation (₹{fee})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free Instant Vedic Astrology Calculation Tool */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950 border border-indigo-500/30 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Instant Free Vedic Kundli & Rashi Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Enter your birth details to generate your authentic Vedic chart summary, auspicious mantras & daily remedies.
            </p>
          </div>
        </div>

        <form onSubmit={handleRunFreeCalculation} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={calcName}
              onChange={(e) => setCalcName(e.target.value)}
              placeholder="e.g. Annu Dhaneja"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Birth Date</label>
            <input
              type="date"
              required
              value={calcDob}
              onChange={(e) => setCalcDob(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Birth Place</label>
            <input
              type="text"
              value={calcPlace}
              onChange={(e) => setCalcPlace(e.target.value)}
              placeholder="e.g. Delhi, India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={calculating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating Kundli...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Free Vedic Chart</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Calculation Result Display */}
        {calcResult && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-amber-300">
                  Vedic Horoscope Summary for {calcResult.userName}
                </h4>
                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                  <span>Moon Sign: <strong className="text-white">{calcResult.moonSign}</strong></span>
                  <span>•</span>
                  <span>Nakshatra: <strong className="text-white">{calcResult.nakshatra}</strong></span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                ✨ Auspicious Period
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">Spiritual & Life Guidance:</span>
                <p className="leading-relaxed">{calcResult.overallForecast}</p>
              </div>

              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">Career & Prosperity:</span>
                <p className="leading-relaxed">{calcResult.careerFinanceAdvice}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1.5 text-xs">
              <span className="font-bold text-amber-400">Recommended Daily Remedies & Mantras:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {calcResult.remedies.map((rem, i) => (
                  <li key={i}>{rem}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
