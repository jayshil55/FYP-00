import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, CheckCircle2, Stethoscope, AlertTriangle, 
  Utensils, Salad, Egg, Beef, ArrowRight, HeartPulse, 
  MessageSquare, ShieldCheck, Info, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BiomarkersGrid from './BiomarkersGrid';
import MealPlanCard from './MealPlanCard';
import PDFExportButton from './PDFExportButton';

const DIET_OPTIONS = [
  { id: 'veg', label: 'Vegetarian', icon: <Salad className="w-5 h-5" />, desc: 'Plant-rich meals with legumes, grains, and dairy' },
  { id: 'egg', label: 'Eggetarian', icon: <Egg className="w-5 h-5" />, desc: 'Plant-based diet including egg whites and healthy proteins' },
  { id: 'non-veg', label: 'Non-Vegetarian', icon: <Beef className="w-5 h-5" />, desc: 'Includes lean meats, fish, seafood, and poultry' },
];

export default function AIConsultationFlow({ 
  analysisResult, 
  uploadedFile, 
  bloodParams = [],
  nutrients = [],
  allFoodsEat = [],
  foodsAvoid = [],
  lifestyle = [],
  summary = '',
  disease = 'General Analysis',
  confidence = null,
  disclaimer = ''
}) {
  const navigate = useNavigate();
  const [underDoctorCare, setUnderDoctorCare] = useState(null);
  const [activeDiet, setActiveDiet] = useState('veg');
  const [currentStep, setCurrentStep] = useState(1);

  const abnormalParams = bloodParams.filter(p => (p.status || '').toLowerCase() !== 'normal');

  const handleDoctorResponse = (underCare) => {
    setUnderDoctorCare(underCare);
    if (currentStep === 2) setCurrentStep(3);
  };

  const handleDietSelect = (dietId) => {
    setActiveDiet(dietId);
    if (currentStep === 3) setCurrentStep(4);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pt-2 pb-12">
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-4 shadow-[var(--nc-shadow-sm)] sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-md shadow-[var(--nc-green)]/15">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>Report overview</h2>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nc-green-light)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--nc-green)]" />
              </span>
            </div>
            <p className="text-xs text-[var(--nc-muted)]">Explore your report and nutrition context</p>
          </div>
        </div>

        <div className="hide-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:w-auto sm:pb-0">
          {[
            { step: 1, label: 'Overview' },
            { step: 2, label: 'Care Status' },
            { step: 3, label: 'Diet Preference' },
            { step: 4, label: 'Full Plan' }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => { if (s.step <= currentStep) setCurrentStep(s.step); }}
              className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 transition-all ${
                currentStep === s.step
                  ? 'bg-[var(--nc-green)] text-white shadow-sm'
                  : currentStep > s.step
                  ? 'border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green-dark)]'
                  : 'bg-[var(--nc-line)]/60 text-[var(--nc-muted-light)]'
              }`}
            >
              <span>{s.step}.</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-6">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-lg)] sm:p-8"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[var(--nc-green)]/5 blur-3xl" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20">
              <Bot className="h-6 w-6" />
            </div>
            <div className="w-full flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>
                    NutriCare offline report assistant
                    <Sparkles className="h-4 w-4 text-[var(--nc-green-light)]" />
                  </h3>
                  <span className="text-xs text-[var(--nc-muted)]">Local guidance from report values and checks</span>
                </div>
                {confidence && (
                  <span className="rounded-full border border-[var(--nc-line)] bg-[var(--nc-mint)] px-3 py-1 text-xs font-bold text-[var(--nc-green-dark)]">
                    {confidence} confidence match
                  </span>
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] p-4 text-sm leading-relaxed sm:p-5 sm:text-base">
                <p className="font-semibold text-[var(--nc-ink)]">
                  Your report summary is ready to explore.
                </p>
                <p className="text-[var(--nc-ink-light)]">
                  {summary}
                </p>
                {disease && (
                  <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-[var(--nc-line)] bg-[var(--nc-mint)] px-3 py-1.5">
                    <ShieldCheck className="h-4 w-4 text-[var(--nc-green)]" />
                    <span className="text-xs font-bold text-[var(--nc-green-dark)]">Primary health indicator:</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--nc-green)]">{disease}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--nc-ink)] sm:text-sm">
                  <Stethoscope className="h-4 w-4 text-[var(--nc-green)]" />
                  Key findings explained simply
                </h4>

                {abnormalParams.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {abnormalParams.map((param, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-2xl border border-[var(--nc-warning)]/30 bg-[var(--nc-warning-bg)] p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nc-warning)]" />
                        <div>
                          <p className="text-sm font-bold text-[var(--nc-ink)]">
                            {param.name}: <span className="text-[var(--nc-warning)]">{param.value}</span>
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--nc-muted)]">
                            {param.explanation || `Value is currently ${param.status}.`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] p-4">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--nc-green)]" />
                    <p className="text-sm font-medium text-[var(--nc-green-dark)]">
                      All measured blood parameters fall within healthy baseline reference ranges.
                    </p>
                  </div>
                )}
              </div>

              {currentStep === 1 && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--nc-green)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--nc-green)]/20 transition-all hover:bg-[var(--nc-green-dark)] sm:w-auto"
                  >
                    Continue consultation
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-lg)] sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="w-full flex-1 space-y-4">
                <div className="rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] p-4 text-sm leading-relaxed sm:p-5 sm:text-base">
                  <p className="mb-1 font-bold text-[var(--nc-green-dark)]">
                    Before we personalize your nutrition plan: Are you currently under a doctor's care for these findings?
                  </p>
                  <p className="text-xs text-[var(--nc-green)]">
                    This helps tailor medical safety guidelines specifically for your situation.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                  <button
                    onClick={() => handleDoctorResponse(true)}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                      underDoctorCare === true
                        ? 'border-[var(--nc-green)] bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20'
                        : 'border-[var(--nc-line)] bg-[var(--nc-paper)] text-[var(--nc-ink)] hover:border-[var(--nc-green)] hover:bg-[var(--nc-mint)]'
                    }`}
                  >
                    <CheckCircle2 className={`mt-0.5 h-5 w-5 flex-shrink-0 ${underDoctorCare === true ? 'text-white' : 'text-[var(--nc-green)]'}`} />
                    <div>
                      <h4 className="text-sm font-bold sm:text-base">Yes, I am under a doctor's care</h4>
                      <p className={`mt-1 text-xs ${underDoctorCare === true ? 'text-white/80' : 'text-[var(--nc-muted)]'}`}>
                        Focus on complementary nutritional guidance to support your ongoing medical treatment.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDoctorResponse(false)}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                      underDoctorCare === false
                        ? 'border-[var(--nc-green)] bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20'
                        : 'border-[var(--nc-line)] bg-[var(--nc-paper)] text-[var(--nc-ink)] hover:border-[var(--nc-green)] hover:bg-[var(--nc-mint)]'
                    }`}
                  >
                    <Info className={`mt-0.5 h-5 w-5 flex-shrink-0 ${underDoctorCare === false ? 'text-white' : 'text-[var(--nc-warning)]'}`} />
                    <div>
                      <h4 className="text-sm font-bold sm:text-base">No, I am not under a doctor's care</h4>
                      <p className={`mt-1 text-xs ${underDoctorCare === false ? 'text-white/80' : 'text-[var(--nc-muted)]'}`}>
                        Receive nutritional guidance with recommendations on when to consult a physician.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-lg)] sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
                <Utensils className="h-6 w-6" />
              </div>
              <div className="w-full flex-1 space-y-4">
                <div className="rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] p-4 text-sm leading-relaxed sm:p-5 sm:text-base">
                  <p className="mb-1 font-bold text-[var(--nc-green-dark)]">
                    What is your primary dietary preference?
                  </p>
                  <p className="text-xs text-[var(--nc-green)]">
                    I will customize all nutrient sources, meal ideas, and food swaps to match your lifestyle.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-3">
                  {DIET_OPTIONS.map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => handleDietSelect(diet.id)}
                      className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                        activeDiet === diet.id
                          ? 'border-[var(--nc-green)] bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20'
                          : 'border-[var(--nc-line)] bg-[var(--nc-paper)] text-[var(--nc-ink)] hover:border-[var(--nc-green)] hover:bg-[var(--nc-mint)]'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className={`rounded-xl p-2.5 ${activeDiet === diet.id ? 'bg-white/20 text-white' : 'bg-[var(--nc-line)]/60 text-[var(--nc-ink-light)]'}`}>
                          {diet.icon}
                        </div>
                        {activeDiet === diet.id && (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-bold">{diet.label}</h4>
                        <p className={`text-xs leading-relaxed ${activeDiet === diet.id ? 'text-white/80' : 'text-[var(--nc-muted)]'}`}>
                          {diet.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-[var(--nc-ink)] p-4 text-white shadow-[var(--nc-shadow-lg)] sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold" style={{ fontFamily: 'var(--nc-font-display)' }}>Personalized plan ready</h4>
                  <p className="text-xs text-white/60">Targeted for {disease} | {activeDiet.toUpperCase()} diet focus</p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:flex-nowrap">
                <PDFExportButton 
                  analysisResult={analysisResult} 
                  uploadedFile={uploadedFile} 
                  activeDiet={activeDiet}
                  underDoctorCare={underDoctorCare}
                />
                <button
                  onClick={() => navigate('/assistant')}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--nc-green)] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[var(--nc-green)]/20 transition-all hover:bg-[var(--nc-green-light)] sm:flex-initial sm:text-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Ask assistant</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              <div className="space-y-4 rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-6">
                <div className="flex items-center gap-3 border-b border-[var(--nc-line)] pb-2">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--nc-ink)]">Key nutrients required</h4>
                    <p className="text-xs text-[var(--nc-muted)]">Essential micro and macronutrients</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {nutrients.map((nutrient, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] px-3.5 py-1.5 text-xs font-bold text-[var(--nc-green-dark)] shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--nc-green)]" />
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-6">
                <div className="flex items-center gap-3 border-b border-[var(--nc-line)] pb-2">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-error)]/20 bg-[var(--nc-error-bg)] text-[var(--nc-error)]">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--nc-ink)]">Foods to limit or avoid</h4>
                    <p className="text-xs text-[var(--nc-muted)]">Items that may affect abnormal markers</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {foodsAvoid.map((food, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--nc-error)]/20 bg-[var(--nc-error-bg)] px-3.5 py-1.5 text-xs font-bold text-[var(--nc-error)] shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--nc-error)]" />
                      {food}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--nc-line)] pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--nc-ink)]">Recommended foods</h4>
                    <p className="text-xs text-[var(--nc-muted)]">Curated for your {activeDiet.toUpperCase()} diet preference</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                {allFoodsEat.map((food, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col justify-between rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] p-4 shadow-sm transition-all hover:border-[var(--nc-green)]/30"
                  >
                    <h5 className="mb-1 text-sm font-bold text-[var(--nc-ink)]">
                      {typeof food === 'string' ? food : food.name}
                    </h5>
                    {typeof food === 'object' && food.desc && (
                      <p className="text-xs leading-relaxed text-[var(--nc-muted)]">{food.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-8">
              <MealPlanCard activeDiet={activeDiet} disease={disease} />
            </div>

            {lifestyle.length > 0 && (
              <div className="space-y-4 rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-8">
                <div className="flex items-center gap-3 border-b border-[var(--nc-line)] pb-2">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--nc-ink)]">Lifestyle and daily habits</h4>
                    <p className="text-xs text-[var(--nc-muted)]">Habits to support biomarker recovery</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
                  {lifestyle.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nc-green)]" />
                      <p className="text-xs font-medium leading-relaxed text-[var(--nc-ink-light)] md:text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-[var(--nc-shadow-md)] sm:p-8">
              <BiomarkersGrid bloodParams={bloodParams} />
            </div>

            <p className="mx-auto max-w-3xl pt-4 text-center text-xs leading-relaxed text-[var(--nc-muted)]">
              {disclaimer || 'This automated analysis is for educational purposes and is not a clinical diagnosis. Always review lab results with a qualified physician.'}
            </p>

          </motion.div>
        )}

      </div>

    </div>
  );
}