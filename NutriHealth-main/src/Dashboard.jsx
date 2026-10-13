import React, { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, ArrowRight, ShieldCheck, FileCheck2, Cpu, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReport } from './context/ReportContext';
import { analyzeReport } from './api/apiClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

  const validateSelectedFile = (candidate) => {
    if (!candidate) return 'Please choose a file to upload.';
    const name = candidate.name || '';
    const extension = name.slice(name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Only PDF, PNG, JPG, JPEG, and WebP files are allowed.';
    }
    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      return `This file is ${(candidate.size / (1024 * 1024)).toFixed(1)} MB — the limit is 15 MB. Please upload a smaller or compressed file.`;
    }
    if (candidate.size === 0) {
      return 'This file appears to be empty. Please choose a valid report file.';
    }
    return null;
  };

  const selectFile = (candidate) => {
    const error = validateSelectedFile(candidate);
    setFileError(error);
    setFile(error ? null : candidate);
  };

  const {
    setUploadedFile,
    setIsAnalyzing,
    setAnalysisError,
    resetReport,
    setReportData,
  } = useReport();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      selectFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || fileError) return;

    resetReport();
    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalysisError(null);

    navigate('/processing');

    try {
      const result = await analyzeReport(file);
      if (result && typeof result === 'object') {
        setReportData(result);
      } else {
        throw new Error('The local analysis returned an invalid result format.');
      }
    } catch (err) {
      console.error('[Dashboard] Analysis failed:', err.message);
      setAnalysisError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--nc-line)] bg-[var(--nc-mint)] px-3.5 py-1.5 text-xs font-semibold text-[var(--nc-green-dark)] shadow-sm">
            <Cpu className="h-3.5 w-3.5" />
            Local OCR and rule-based report review
          </div>

          <div className="space-y-4">
            <h1 className="max-w-xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.96] tracking-[-0.055em]">
              Bring your lab report into focus.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--nc-muted)] sm:text-lg">
              Upload a supported report file. NutriCare extracts measured biomarkers, compares available reference ranges, and keeps the local model assessment separate from the rule-based findings.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['15 MB', 'maximum file size'],
              ['PDF + images', 'PDF, PNG, JPG, JPEG, WebP'],
              ['No samples', 'only your selected file is analyzed'],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper)] p-4 shadow-sm">
                <strong className="block text-sm font-bold text-[var(--nc-ink)]">{value}</strong>
                <span className="mt-1 block text-xs leading-5 text-[var(--nc-muted)]">{label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-4 shadow-[var(--nc-shadow-xl)] sm:p-6"
          aria-labelledby="upload-title"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="upload-title" className="text-2xl">Upload report</h2>
              <p id={helpId} className="mt-1 text-sm text-[var(--nc-muted)]">
                Choose one file. Photos should be sharp, flat, and readable.
              </p>
            </div>
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-mint)] text-[var(--nc-green)] sm:flex">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <label
            htmlFor={inputId}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex min-h-[20rem] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed p-6 text-center transition-all duration-300 sm:p-8 ${
              isDragging
                ? 'border-[var(--nc-green)] bg-[var(--nc-mint)] shadow-[0_0_0_6px_rgba(22,116,94,0.08)]'
                : file
                ? 'border-[var(--nc-green)] bg-[#f7fbf8]'
                : 'border-[var(--nc-line-dark)] bg-[#fbfcf9] hover:border-[var(--nc-green)] hover:bg-[var(--nc-mint)]/60'
            }`}
          >
            <input
              id={inputId}
              type="file"
              className="sr-only"
              accept=".pdf,.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              aria-describedby={`${helpId}${fileError ? ` ${errorId}` : ''}`}
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,51,46,0.08)_1px,transparent_0)] [background-size:18px_18px] opacity-40" />

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] transition-all ${
                file
                  ? 'bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20'
                  : 'border border-[var(--nc-line)] bg-[var(--nc-paper)] text-[var(--nc-green)] shadow-sm group-hover:scale-[1.02]'
              }`}>
                {file ? <FileCheck2 className="h-10 w-10" /> : <UploadCloud className="h-10 w-10" />}
              </div>

              {file ? (
                <div className="max-w-full space-y-3">
                  <h3 className="truncate text-2xl">{file.name}</h3>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--nc-line)] bg-[var(--nc-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--nc-green-dark)]">
                    <FileCheck2 className="h-3.5 w-3.5" />
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for analysis
                  </div>
                  <p className="mx-auto max-w-sm text-xs text-[var(--nc-muted)]">
                    Select this area again to replace the file before analysis.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-2xl">Drop the report here</h3>
                  <p className="mx-auto max-w-sm text-sm text-[var(--nc-muted)]">
                    Or press Enter on this area and browse your computer for a PDF, PNG, JPG, JPEG, or WebP file.
                  </p>
                  <span className="inline-flex rounded-full bg-[var(--nc-green)] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[var(--nc-green)]/20">
                    Browse files
                  </span>
                </div>
              )}
            </div>
          </label>

          {fileError && (
            <div id={errorId} role="alert" className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-900">This file cannot be analyzed</p>
                <p className="mt-0.5 text-sm text-red-700">{fileError}</p>
                <p className="mt-1 text-xs text-red-700/80">For photos, keep text sharp and avoid shadows or glare.</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs text-[var(--nc-muted)]">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--nc-green)]" />
              <span>Medical results are educational and should be reviewed with a qualified clinician.</span>
            </div>

            <motion.button
              type="button"
              disabled={!file || !!fileError}
              whileHover={file && !fileError ? { y: -1 } : {}}
              whileTap={file && !fileError ? { scale: 0.98 } : {}}
              onClick={handleAnalyze}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                file && !fileError
                  ? 'bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/20 hover:bg-[var(--nc-green-dark)]'
                  : 'cursor-not-allowed border border-[var(--nc-line)] bg-[var(--nc-line)]/60 text-[var(--nc-muted-light)]'
              }`}
            >
              Analyze report
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
