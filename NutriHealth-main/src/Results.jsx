import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { AlertCircle, FileSearch, UploadCloud } from 'lucide-react';
import { useReport } from './context/ReportContext';
import AIConsultationFlow from './components/consultation/AIConsultationFlow';

export default function Results() {
  const navigate = useNavigate();
  const { analysisResult, analysisError, uploadedFile } = useReport();

  const hasRealData = !!analysisResult
    && typeof analysisResult === 'object'
    && Array.isArray(analysisResult.bloodParameters)
    && analysisResult.bloodParameters.length > 0;

  if (!hasRealData) {
    return (
      <div className="w-full max-w-3xl mx-auto py-10">
        {analysisError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--nc-error)]/30 bg-[var(--nc-error-bg)] p-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nc-error)]" />
            <div>
              <p className="text-sm font-bold text-[var(--nc-error)]">Analysis could not be completed</p>
              <p className="mt-0.5 text-sm text-[var(--nc-error)]/80">{analysisError}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-10 text-center shadow-[var(--nc-shadow-md)]"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[var(--nc-mint)] text-[var(--nc-green)]">
            <FileSearch className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl text-[var(--nc-ink)]">
              {analysisError ? 'Analysis was not completed' : 'No analysis available yet'}
            </h2>
            <p className="mx-auto max-w-md text-sm leading-7 text-[var(--nc-muted)]">
              {analysisError
                ? 'Your report could not be analyzed. Please try uploading it again.'
                : 'Upload a blood report to see extracted biomarkers, reference ranges, and general nutrition guidance.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--nc-green)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--nc-green)]/20 transition-all hover:bg-[var(--nc-green-dark)]"
          >
            <UploadCloud className="h-4 w-4" />
            Upload report
          </button>
        </motion.div>
      </div>
    );
  }

  const bloodParams = analysisResult.bloodParameters;
  const nutrients = Array.isArray(analysisResult.nutrients) ? analysisResult.nutrients : [];
  const allFoodsEat = Array.isArray(analysisResult.foodsToEat) ? analysisResult.foodsToEat : [];
  const foodsAvoid = Array.isArray(analysisResult.foodsToAvoid) ? analysisResult.foodsToAvoid : [];
  const lifestyle = Array.isArray(analysisResult.lifestyle) ? analysisResult.lifestyle : [];
  const disease = analysisResult.disease || 'General wellness review';
  const confidence = analysisResult.confidence || null;

  return (
    <div className="w-full space-y-6">
      {analysisError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl flex items-start gap-3 rounded-2xl border border-[var(--nc-warning)]/30 bg-[var(--nc-warning-bg)] p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nc-warning)]" />
          <p className="text-sm text-[var(--nc-warning)]">
            A partial issue occurred during analysis; results below may be incomplete.
          </p>
        </motion.div>
      )}

      {analysisResult.modelAssessment && (
        <section className="mx-auto max-w-5xl rounded-[1.5rem] border border-[var(--nc-line-dark)] bg-[var(--nc-mint)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--nc-green-dark)]">Local machine learning model</p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>
                {analysisResult.modelAssessment.status === 'ready' ? 'Model assessment' : 'Model setup needed'}
              </h3>
            </div>
            {analysisResult.modelAssessment.status === 'ready' && (
              <span className="rounded-xl bg-[var(--nc-paper)] px-4 py-2 text-lg font-bold text-[var(--nc-green-dark)] shadow-sm">
                {analysisResult.modelAssessment.category}
              </span>
            )}
          </div>
          {analysisResult.modelAssessment.status === 'ready' ? (
            <>
              <p className="mt-3 text-sm leading-7 text-[var(--nc-ink-light)]">
                The model received {analysisResult.modelAssessment.providedFeatureCount} of {analysisResult.modelAssessment.expectedFeatureCount} biomarker features from this report. The report pipeline's measured values, alerts, and risk checks remain separate.
              </p>
              {analysisResult.modelAssessment.probabilities && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(analysisResult.modelAssessment.probabilities).map(([label, probability]) => (
                    <span key={label} className="rounded-lg border border-[var(--nc-line)] bg-[var(--nc-paper)] px-3 py-1.5 text-xs font-medium text-[var(--nc-ink-light)]">
                      {label}: {Math.round(probability * 100)}%
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[var(--nc-ink-light)]">
              {analysisResult.modelAssessment.message || 'The existing report pipeline completed, but local model prediction is unavailable.'}
            </p>
          )}
          <p className="mt-4 border-t border-[var(--nc-line-dark)] pt-3 text-xs text-[var(--nc-muted)]">
            Educational demonstration only. The model is trained on synthetic, rule-derived tiers and is not a diagnostic tool or validated clinical risk score.
          </p>
        </section>
      )}

      {(analysisResult.agentSummary || analysisResult.healthTips) && (
        <div className="mx-auto max-w-5xl rounded-[1.5rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-6 shadow-[var(--nc-shadow-md)]">
          <h3 className="text-lg font-semibold text-[var(--nc-green-dark)]" style={{ fontFamily: 'var(--nc-font-display)' }}>
            Personalized AI agent insights
          </h3>
          {analysisResult.agentSummary && (
            <p className="mt-3 text-sm leading-7 text-[var(--nc-ink-light)]">{analysisResult.agentSummary}</p>
          )}
          {analysisResult.diseasePrediction && (
            <div className="mt-4 rounded-xl border border-[var(--nc-line)] bg-[var(--nc-mint)] p-4">
              <h4 className="text-sm font-bold text-[var(--nc-green-dark)]">Risk indicator</h4>
              <p className="mt-1 text-sm text-[var(--nc-ink-light)]">
                {analysisResult.diseasePrediction.likelyCondition || 'Not specified'}
                {analysisResult.diseasePrediction.confidence && ` (Confidence: ${analysisResult.diseasePrediction.confidence})`}
              </p>
              {Array.isArray(analysisResult.diseasePrediction.indicators) && analysisResult.diseasePrediction.indicators.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-xs text-[var(--nc-muted)]">
                  {analysisResult.diseasePrediction.indicators.map((ind, i) => <li key={i}>{ind}</li>)}
                </ul>
              )}
            </div>
          )}
          {Array.isArray(analysisResult.healthTips) && analysisResult.healthTips.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-[var(--nc-green-dark)]">Health tips</h4>
              <ul className="mt-2 space-y-1 text-sm text-[var(--nc-ink-light)]">
                {analysisResult.healthTips.map((tip, i) => <li key={i}>• {tip}</li>)}
              </ul>
            </div>
          )}
          {analysisResult.disclaimer && (
            <p className="mt-4 border-t border-[var(--nc-line)] pt-3 text-xs text-[var(--nc-muted)]">{analysisResult.disclaimer}</p>
          )}
        </div>
      )}

      <AIConsultationFlow
        analysisResult={analysisResult}
        uploadedFile={uploadedFile}
        bloodParams={bloodParams}
        nutrients={nutrients}
        allFoodsEat={allFoodsEat}
        foodsAvoid={foodsAvoid}
        lifestyle={lifestyle}
        summary={analysisResult.summary}
        disease={disease}
        confidence={confidence}
        disclaimer={analysisResult.disclaimer || null}
      />
    </div>
  );
}