import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  ArrowLeft, 
  Info, 
  Dna, 
  Heart, 
  BookOpen, 
  Sparkles, 
  Activity, 
  Users, 
  Compass, 
  ShieldCheck, 
  TrendingDown, 
  ChevronRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { AssessmentRecord } from "../types";
import { categoryMetadata, getStressLevel, assessmentQuestions, categoryWeights } from "../data";

interface ResultsDashboardProps {
  record: AssessmentRecord;
  onRetake: () => void;
  historyLength: number;
}

export function ResultsDashboard({ record, onRetake, historyLength }: ResultsDashboardProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const stressLevel = getStressLevel(record.scores.overall);

  // Recommendations mapping
  const recommendations: Record<string, string[]> = {
    lifestyle: [
      "Improve sleep latency: Set a gadget-free buffer zone 45 minutes before sleep.",
      "Track hydration & meals: Introduce small, protein-rich snacks throughout your heavy routines to stabilize glucose.",
      "Gentle movement triggers: Incorporate 12 minutes of active stretching or focused walking during periods of downtime."
    ],
    academic_work: [
      "Leverage the Time-Boxing protocol: Set focused intervals (e.g., 40 mins work, 10 mins break) to manage cognitive fatigue.",
      "Negotiate & Delegate: Re-evaluate high-dread responsibilities; isolate and solve the most crucial task first.",
      "The 'Good Enough' bar: Establish clear definitions of acceptable performance limits to mitigate over-perfectionist dread."
    ],
    cognitive_social: [
      "Unburden focus: Create external lists or use a physically written planner to free up operational working memory.",
      "Targeted isolation breaker: Block out small windows of dedicated time (even 15 minutes) for a chat with a trusted peer.",
      "The 5-Minute Decompression: Use controlled box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) when feeling irritated."
    ],
    physical_emotional: [
      "Somatic check-ins: Actively drop your shoulders, unclench your jaw, and take 3 deep belly breaths every hour.",
      "Thermoregulation recovery: Try brief, dynamic temperature therapy (e.g. cold face splashes or warm neck wraps).",
      "Validate the cycle: Allow emotional spikes to swell and pass without mounting secondary judgment. Cry, laugh, or rest."
    ]
  };

  // Safe category retrieval
  const maxCategoryKey = record.highestStressCategory || "lifestyle";
  const categoryRecs = recommendations[maxCategoryKey] || recommendations["lifestyle"];
  const currentCategoryMetadata = categoryMetadata[maxCategoryKey as keyof typeof categoryMetadata] || categoryMetadata["lifestyle"];

  return (
    <div className="space-y-6" id="results-dashboard">
      
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Dynamic Gauge Visualizer */}
          <div className="flex flex-col items-center text-center shrink-0 w-full lg:w-72">
            <div className="relative w-48 h-48 flex items-center justify-center">
              
              {/* Spinning/pulsing background glow */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-10 bg-gradient-to-tr from-teal-500 via-indigo-500 to-rose-500" />
              
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="8"
                  fill="transparent"
                  className="stroke-slate-100 dark:stroke-slate-800"
                />
                {/* Foreground Progress Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  className="stroke-indigo-600 dark:stroke-indigo-500"
                  strokeDasharray="264"
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * record.scores.overall) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-display font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {Math.round(record.scores.overall)}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 dark:text-slate-500 font-bold mt-1">
                  Stress Index %
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${stressLevel.badgeBg}`}>
                {stressLevel.label}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1.5 px-3">
                Based on Category Multipliers
              </p>
            </div>
          </div>

          {/* Metric Descriptions & Profile */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                Comprehensive Feedback
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
                Well-being Diagnostic Report
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl">
                {stressLevel.description} Below is a customized summary mapping your weighted dimensions, displaying how multi-faceted pressure signals interact inside your system.
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Assessment Date</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                  {new Date(record.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Primary Driver</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1 flex items-center justify-center lg:justify-start gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 bg-indigo-500" />
                  {currentCategoryMetadata ? currentCategoryMetadata.label : "None"}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Historical Logs</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                  {historyLength} {historyLength === 1 ? "run stored" : "runs stored"}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onRetake}
                id="btn-retake-quiz"
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-all cursor-pointer shadow-md shadow-slate-900/5 dark:shadow-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Assessment
              </button>

              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                id="btn-toggle-formula"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/65 rounded-xl transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                {showFormulaDetails ? "Hide Formula" : "Show Formula Details"}
              </button>
            </div>
          </div>
        </div>

        {/* Informative Math Dropdown Box */}
        {showFormulaDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-indigo-50/30 dark:bg-slate-800/20 border border-indigo-100/50 dark:border-slate-700/50 rounded-2xl text-xs space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <Dna className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">
                  Weighted Score Mechanics & Formulas
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Stress behaves differently across dimensions. Simple workloads hold different stress multipliers than sleep issues or clinical muscle tension. To accommodate this, our scoring mechanism applies multipliers defined in your system architecture:
                </p>
                <ul className="list-disc pl-4 mt-2 mb-2 space-y-1 text-slate-500 dark:text-slate-400">
                  <li><strong>Lifestyle habits:</strong> Multiplier weight of <code className="font-mono text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1.0</code></li>
                  <li><strong>Academic & Work pressure:</strong> Multiplier weight of <code className="font-mono text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1.5</code></li>
                  <li><strong>Cognitive & Social feedback:</strong> Multiplier weight of <code className="font-mono text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1.8</code></li>
                  <li><strong>Physical & Emotional load:</strong> Multiplier weight of <code className="font-mono text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">2.0</code></li>
                </ul>
                <div className="bg-white/80 dark:bg-slate-900/55 p-3 rounded-xl border border-indigo-150/40 dark:border-slate-800 font-mono text-[11px] space-y-1 text-slate-600 dark:text-slate-300 mt-3">
                  <span className="block font-semibold text-indigo-600 dark:text-indigo-400">Formula Breakdown:</span>
                  <div>• Max Possible Weighted Score = Sum of [QuestionMaxScore(3) × CategoryWeight]</div>
                  <div>• Your Actual Weighted Score = Sum of [YourOptionScore (0-3) × CategoryWeight]</div>
                  <div className="pt-1.5 mt-1.5 border-t border-indigo-50 dark:border-slate-800 font-bold">
                    • Final Stress Index % = (Your Actual score / Max possible score) × 100
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Results Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Category Breakdown list (Takes 3 cols on desktop) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-5">
          <div>
            <span className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 uppercase">Dimensional Breakdown</span>
            <h3 className="text-lg font-display font-medium text-slate-800 dark:text-slate-100 mt-0.5">
              Category Loading Analysis
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(record.scores.byCategory).map(([category, details]) => {
              const meta = categoryMetadata[category as keyof typeof categoryMetadata] || {
                label: category,
                description: "",
                color: "from-slate-550 to-slate-400 bg-slate-50 text-slate-700 border-slate-100",
                iconName: "HelpCircle"
              };

              const scorePercent = Math.round(details.percentage);
              
              // Determine status indicator color
              let progressColor = "bg-emerald-500 dark:bg-emerald-400";
              let textColor = "text-emerald-600 dark:text-emerald-400";
              if (scorePercent >= 75) {
                progressColor = "bg-rose-500 dark:bg-rose-400";
                textColor = "text-rose-600 dark:text-rose-400";
              } else if (scorePercent >= 50) {
                progressColor = "bg-orange-500 dark:bg-orange-400";
                textColor = "text-orange-600 dark:text-orange-400";
              } else if (scorePercent >= 25) {
                progressColor = "bg-amber-500 dark:bg-amber-400";
                textColor = "text-amber-600 dark:text-amber-400";
              }

              return (
                <div key={category} className="p-4 rounded-2xl border border-slate-100/70 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/40 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {meta.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {meta.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-mono font-bold ${textColor}`}>
                        {scorePercent}%
                      </span>
                      <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 font-mono uppercase mt-0.5">
                        Raw: {details.value} / {details.max}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart Custom Visualization */}
                  <div className="relative w-full h-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${progressColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    {/* Visual notches at thirds */}
                    <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-slate-250 bg-white/30" />
                    <div className="absolute left-2/4 top-0 bottom-0 w-[1px] bg-slate-250 bg-white/30" />
                    <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-slate-250 bg-white/30" />
                  </div>

                  {/* Weight modifier flag */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 text-slate-400 dark:text-zinc-500">
                    <span>Baseline Burden: {getStressLevel(scorePercent).label}</span>
                    <span>Category weight: {categoryWeights[category as keyof typeof categoryWeights] || "1.0"}x</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Remedies Column (Takes 2 cols on desktop) */}
        <div className="lg:col-span-2 bg-gradient-to-tr from-indigo-950 to-slate-900 border border-slate-850 dark:border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Prescriptive Remedies
            </span>
            <h3 className="text-lg font-display font-medium text-slate-100">
              Personalized Stress Defense
            </h3>
            <p className="text-xs text-slate-350 text-slate-400">
              Targeted behavioral strategies to relieve burden centered in your highest loading stress dimension: <strong className="text-indigo-200">{currentCategoryMetadata?.label || "None"}</strong>.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {categoryRecs.map((rec, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3.5 bg-white/5 dark:bg-slate-950/20 rounded-2xl border border-white/10 dark:border-slate-800 hover:bg-white/10 transition-colors"
              >
                <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 font-mono text-xs font-extrabold text-indigo-300 flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-100 leading-snug">
                    {rec.split(":")[0]}
                  </p>
                  <p className="text-xs text-slate-350 text-slate-400">
                    {rec.split(":")[1] || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 bg-slate-950/20 p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Clinical Notice</h5>
              <p className="text-[11px] text-slate-350 text-slate-400 leading-normal">
                This diagnostic dashboard serves exclusively as a digital lifestyle aid. It is not a professional diagnostic replacement.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
