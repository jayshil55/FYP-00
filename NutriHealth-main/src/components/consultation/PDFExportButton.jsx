import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export default function PDFExportButton({ analysisResult, uploadedFile, activeDiet, underDoctorCare }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePrint}
      className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-white/20"
    >
      <Download className="h-4 w-4 text-[var(--nc-green-light)]" />
      <span>Print / save as PDF</span>
    </motion.button>
  );
}