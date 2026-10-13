import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, TrendingDown, AlertCircle, Info, ChevronDown, ChevronUp, Activity } from 'lucide-react';

const getStatusInfo = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'normal') {
    return {
      bg: 'bg-[var(--nc-status-normal-bg)] text-[var(--nc-status-normal)] border-[var(--nc-status-normal)]/30',
      icon: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
      label: 'Normal',
      color: 'var(--nc-status-normal)',
      colorBg: 'var(--nc-status-normal-bg)',
    };
  }
  if (s === 'high' || s === 'warning') {
    return {
      bg: 'bg-[var(--nc-status-high-bg)] text-[var(--nc-status-high)] border-[var(--nc-status-high)]/30',
      icon: <TrendingUp className="h-4 w-4 flex-shrink-0" />,
      label: 'Elevated',
      color: 'var(--nc-status-high)',
      colorBg: 'var(--nc-status-high-bg)',
    };
  }
  if (s === 'low') {
    return {
      bg: 'bg-[var(--nc-status-low-bg)] text-[var(--nc-status-low)] border-[var(--nc-status-low)]/30',
      icon: <TrendingDown className="h-4 w-4 flex-shrink-0" />,
      label: 'Low',
      color: 'var(--nc-status-low)',
      colorBg: 'var(--nc-status-low-bg)',
    };
  }
  if (s === 'critical') {
    return {
      bg: 'bg-[var(--nc-status-critical-bg)] text-[var(--nc-status-critical)] border-[var(--nc-status-critical)]',
      icon: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
      label: 'Critical',
      color: 'var(--nc-status-critical)',
      colorBg: 'var(--nc-status-critical-bg)',
    };
  }
  return {
    bg: 'bg-[var(--nc-line)]/60 text-[var(--nc-muted)] border-[var(--nc-line)]',
    icon: <Info className="h-4 w-4 flex-shrink-0" />,
    label: status || 'Notice',
    color: 'var(--nc-muted)',
    colorBg: 'var(--nc-line)',
  };
};

function parseRangeValue(rangeStr) {
  if (!rangeStr) return null;
  const match = String(rangeStr).match(/(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/);
  if (match) return { low: parseFloat(match[1]), high: parseFloat(match[2]) };
  return null;
}

function parseMeasuredValue(valueStr) {
  if (!valueStr) return null;
  const match = String(valueStr).match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

function RangeRuler({ value, range, status }) {
  const measured = parseMeasuredValue(value);
  const refRange = parseRangeValue(range);

  if (!measured || !refRange || refRange.high <= refRange.low) return null;

  const span = refRange.high - refRange.low;
  const padding = span * 0.8;
  const minVal = refRange.low - padding;
  const maxVal = refRange.high + padding;
  const totalSpan = maxVal - minVal;

  const refStartPct = ((refRange.low - minVal) / totalSpan) * 100;
  const refWidthPct = (span / totalSpan) * 100;
  const measuredPct = Math.max(2, Math.min(98, ((measured - minVal) / totalSpan) * 100));

  const statusColor = getStatusInfo(status).color;

  return (
    <div className="mt-3">
      <div className="relative h-2 w-full rounded-full bg-[var(--nc-line)]">
        <div
          className="absolute top-0 h-2 rounded-full bg-[var(--nc-mint)] border border-[var(--nc-status-normal)]/30"
          style={{ left: `${refStartPct}%`, width: `${refWidthPct}%` }}
        />
        <div
          className="absolute top-1/2 z-10 h-4 w-1 -translate-y-1/2 rounded-full"
          style={{ left: `${measuredPct}%`, background: statusColor, boxShadow: `0 0 0 3px ${statusColor}25` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-medium text-[var(--nc-muted-light)]">
        <span>{minVal.toFixed(1)}</span>
        <span className="text-[var(--nc-green-dark)]">Ref: {refRange.low}–{refRange.high}</span>
        <span>{maxVal.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function BiomarkersGrid({ bloodParams = [] }) {
  const [filter, setFilter] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const abnormalCount = bloodParams.filter(p => (p.status || '').toLowerCase() !== 'normal').length;
  const normalCount = bloodParams.filter(p => (p.status || '').toLowerCase() === 'normal').length;

  const filteredParams = bloodParams.filter(p => {
    if (filter === 'abnormal') return (p.status || '').toLowerCase() !== 'normal';
    if (filter === 'normal') return (p.status || '').toLowerCase() === 'normal';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-[var(--nc-line)] pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-mint)] text-[var(--nc-green)]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>
              Extracted biomarkers
              <span className="rounded-full border border-[var(--nc-line)] bg-[var(--nc-line)]/60 px-2.5 py-0.5 text-xs font-semibold text-[var(--nc-muted)]">
                {bloodParams.length} parameters
              </span>
            </h3>
            <p className="text-xs text-[var(--nc-muted)]">Full laboratory readings parsed from your uploaded report</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--nc-line)] bg-[var(--nc-line)]/40 p-1 text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1.5 transition-all ${filter === 'all' ? 'bg-[var(--nc-paper)] text-[var(--nc-ink)] shadow-sm font-semibold' : 'text-[var(--nc-muted)] hover:text-[var(--nc-ink)]'}`}
            >
              All ({bloodParams.length})
            </button>
            {abnormalCount > 0 && (
              <button
                onClick={() => setFilter('abnormal')}
                className={`rounded-lg px-3 py-1.5 transition-all ${filter === 'abnormal' ? 'bg-[var(--nc-warning)] text-white shadow-sm font-semibold' : 'text-[var(--nc-warning)] hover:bg-[var(--nc-warning-bg)]'}`}
              >
                Attention ({abnormalCount})
              </button>
            )}
            <button
              onClick={() => setFilter('normal')}
              className={`rounded-lg px-3 py-1.5 transition-all ${filter === 'normal' ? 'bg-[var(--nc-green)] text-white shadow-sm font-semibold' : 'text-[var(--nc-green-dark)] hover:bg-[var(--nc-mint)]'}`}
            >
              Normal ({normalCount})
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-xl border border-[var(--nc-line)] bg-[var(--nc-line)]/40 p-2 text-[var(--nc-muted)] transition-colors hover:bg-[var(--nc-mint)]"
            title={isCollapsed ? 'Expand section' : 'Collapse section'}
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredParams.length > 0 ? (
              filteredParams.map((item, idx) => {
                const badge = getStatusInfo(item.status);
                return (
                  <motion.div
                    key={item.name || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="group relative flex flex-col rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper)] p-5 shadow-sm transition-all duration-300 hover:border-[var(--nc-green)]/30 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-[var(--nc-ink-light)] transition-colors group-hover:text-[var(--nc-ink)]">
                        {item.name || item.label}
                      </span>
                      <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-2xl font-black tracking-tight text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-body)' }}>
                        {item.value}
                      </span>
                      {(item.normalRange || item.range) && (
                        <span className="text-xs font-medium text-[var(--nc-muted-light)]">
                          Ref: {item.normalRange || item.range}
                        </span>
                      )}
                    </div>

                    <RangeRuler value={item.value} range={item.normalRange || item.range} status={item.status} />

                    {item.explanation && (
                      <p className="mt-3 border-t border-[var(--nc-line)] pt-2.5 text-xs leading-relaxed text-[var(--nc-muted)]">
                        {item.explanation}
                      </p>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-[var(--nc-muted-light)]">
                No parameters match the selected filter.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}