import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Activity, Search, BrainCircuit, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReport } from './context/ReportContext';

const STEPS = [
  { id: 1, label: 'Upload complete', desc: 'File received and validated', icon: ShieldCheck },
  { id: 2, label: 'Extracting biomarkers', desc: 'OCR and text parsing in progress', icon: Search },
  { id: 3, label: 'Analyzing values', desc: 'Comparing to reference baselines', icon: Activity },
  { id: 4, label: 'Building summary', desc: 'Preparing report and local model assessment', icon: BrainCircuit },
];

const STEP_INTERVAL_MS = 2200;

export default function Processing() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { isAnalyzing, analysisResult, analysisError } = useReport();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, STEP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAnalyzing && analysisResult) {
      const timer = setTimeout(() => navigate('/recovery'), 600);
      return () => clearTimeout(timer);
    }

    if (!isAnalyzing && analysisError) {
      const timer = setTimeout(() => navigate('/recovery'), 600);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, analysisResult, analysisError, navigate]);

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[var(--nc-paper-warm)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-6 shadow-[var(--nc-shadow-xl)] sm:p-10"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--nc-green)]/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--nc-green)]/8 blur-[80px]" />

        <div className="relative z-10">
          <div className="mb-10 space-y-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20"
            >
              <BrainCircuit className="h-9 w-9" />
            </motion.div>

            <div>
              <h1 className="text-2xl sm:text-3xl">Processing your report</h1>
              <p className="mt-2 text-sm text-[var(--nc-muted)]">
                Local OCR and rule-based analysis
              </p>
            </div>
          </div>

          <div className="relative space-y-3">
            <div className="pointer-events-none absolute bottom-6 left-5 top-6 w-0.5 bg-[var(--nc-line)]" />

            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isPending = step.id > currentStep;
              const Icon = isCompleted ? CheckCircle2 : step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="relative flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-[var(--nc-mint)]/40"
                >
                  {index > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isCompleted ? 'calc(100% - 12px)' : isActive ? '50%' : 0 }}
                      className="pointer-events-none absolute left-4.5 top-6 w-0.5 bg-[var(--nc-green)]"
                    />
                  )}

                  <div className="relative flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0.9, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? 'border-[var(--nc-green)] bg-[var(--nc-green)] text-white shadow-md shadow-[var(--nc-green)]/15'
                          : isActive
                          ? 'border-[var(--nc-green)] bg-[var(--nc-paper)] text-[var(--nc-green)] shadow-md shadow-[var(--nc-green)]/10 ring-2 ring-[var(--nc-green)]/20'
                          : 'border-[var(--nc-line)] bg-[var(--nc-paper)] text-[var(--nc-muted-light)]'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                    </motion.div>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        className="pointer-events-none absolute inset-0 rounded-full bg-[var(--nc-green)]/15"
                      />
                    )}
                  </div>

                  <div className={`flex-1 pt-1 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    <h4 className={`text-sm font-bold ${isActive ? 'text-[var(--nc-ink)]' : isCompleted ? 'text-[var(--nc-green-dark)]' : 'text-[var(--nc-muted)]'}`}>
                      {step.label}
                    </h4>
                    <AnimatePresence mode="popLayout">
                      {(isActive || isCompleted) && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 4 }}
                          transition={{ duration: 0.25 }}
                          className={`mt-0.5 text-xs ${isActive ? 'text-[var(--nc-green-dark)] font-medium' : 'text-[var(--nc-muted)]'}`}
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {analysisError && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-900">Analysis failed</p>
                  <p className="mt-0.5 text-sm text-red-700">{analysisError}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 underline-offset-2 hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 border-t border-[var(--nc-line)] pt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--nc-muted)]">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{Math.round((currentStep / STEPS.length) * 100)}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--nc-line)]">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full bg-[var(--nc-green)]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
