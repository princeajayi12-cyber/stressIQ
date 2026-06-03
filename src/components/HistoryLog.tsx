import React from "react";
import { 
  History, 
  Trash2, 
  LineChart, 
  Calendar, 
  ChevronRight, 
  FileSpreadsheet,
  Layers,
  Sparkles,
  Smile,
  AlertCircle
} from "lucide-react";
import { AssessmentRecord } from "../types";
import { getStressLevel, categoryMetadata } from "../data";

interface HistoryLogProps {
  records: AssessmentRecord[];
  activeRecordId: string | null;
  onSelect: (record: AssessmentRecord) => void;
  onDeleteRecord: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
}

export function HistoryLog({ 
  records, 
  activeRecordId, 
  onSelect, 
  onDeleteRecord, 
  onClearHistory 
}: HistoryLogProps) {
  
  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 py-12 text-center shadow-xl shadow-slate-100/40 dark:shadow-none" id="history-empty">
        <div className="mx-auto w-14 h-14 bg-indigo-55 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-500 mb-4">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-display font-semibold text-slate-800 dark:text-slate-100">
          No records registered yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-2">
          Your weighted stress dimensions and historic logs will arrange here once you complete your introductory diagnosis.
        </p>
      </div>
    );
  }

  // Calculate high-level historic trends
  const averageAllTimeScore = records.reduce((acc, curr) => acc + curr.scores.overall, 0) / records.length;
  const highestAllTimeScore = Math.max(...records.map(r => r.scores.overall));
  const latestScore = records[0].scores.overall;

  let trendDirection = "stable";
  if (records.length > 1) {
    const diff = latestScore - records[1].scores.overall;
    if (diff > 2) trendDirection = "increasing";
    else if (diff < -2) trendDirection = "decreasing";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="history-dashboard">
      
      {/* Overview stats on history */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-100/40 dark:shadow-none lg:sticky lg:top-6 self-start space-y-6">
        <div>
          <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase">Trend Analysis</span>
          <h3 className="text-lg font-display font-medium text-slate-800 dark:text-slate-100 mt-0.5">
            Progress Tracking
          </h3>
        </div>

        <div className="space-y-4">
          {/* Average Load */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">All-Time Median Index</span>
              <span className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
                {Math.round(averageAllTimeScore)}%
              </span>
            </div>
            <div className="w-10 h-10 bg-indigo-100/40 dark:bg-indigo-950/20 text-indigo-550 text-indigo-500 rounded-xl flex items-center justify-center">
              <LineChart className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Worst-Case Spike */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">Peak Stress Encountered</span>
              <span className="text-2xl font-display font-bold text-slate-850 text-rose-600 dark:text-rose-400 mt-0.5 block">
                {Math.round(highestAllTimeScore)}%
              </span>
            </div>
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="pt-2">
            {trendDirection === "decreasing" ? (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/45 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 leading-relaxed">
                <Smile className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Stress decreasing:</strong> Your latest index is lower than the previous run. Your coping strategies appear to be generating relief. Keep going!</span>
              </div>
            ) : trendDirection === "increasing" ? (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/45 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Stress mounting:</strong> Your stress loads have ticked upward recently. Please prioritize regular downtime & boundaries.</span>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-350 flex items-start gap-2.5 leading-relaxed">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Your pressure readings remain highly stable. Re-diagnose details anytime workload changes or headers shift.</span>
              </div>
            )}
          </div>

          <button
            onClick={onClearHistory}
            id="btn-clear-history"
            className="w-full py-2.5 text-xs font-semibold text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-900/55 rounded-xl transition-all cursor-pointer text-center block"
          >
            Clear All History Records
          </button>
        </div>
      </div>

      {/* Historical List view (Takes 2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-850 dark:text-slate-100">
            Select Run to Inspect Details:
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {records.length} runs saved
          </span>
        </div>

        <div className="space-y-3">
          {records.map((rec) => {
            const isSelected = activeRecordId === rec.id;
            const level = getStressLevel(rec.scores.overall);
            const primaryMeta = categoryMetadata[rec.highestStressCategory as keyof typeof categoryMetadata] || categoryMetadata["lifestyle"];

            return (
              <div
                key={rec.id}
                id={`history-row-${rec.id}`}
                onClick={() => onSelect(rec)}
                className={`w-full p-4 rounded-2xl border transition-all cursor-pointer relative group flex justify-between items-center ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/10 shadow-md shadow-indigo-500/5"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-705"
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500">
                      {new Date(rec.timestamp).toLocaleDateString(undefined, {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${level.badgeBg}`}>
                      {level.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-2xl font-display font-extrabold text-slate-800 dark:text-slate-100">
                      {Math.round(rec.scores.overall)}%
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                      stress index
                    </span>
                  </div>

                  {primaryMeta && (
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Primary stressor:</span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-350">
                        {primaryMeta.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onDeleteRecord(rec.id, e)}
                    id={`btn-del-record-${rec.id}`}
                    title="Delete record"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>

                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    isSelected ? "text-indigo-500 translate-x-1" : "text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5"
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
