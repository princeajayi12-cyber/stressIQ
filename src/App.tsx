import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HeartPulse, 
  HelpCircle, 
  History, 
  Activity, 
  Award, 
  Dna, 
  FileText, 
  Database,
  Info,
  Layers,
  Sparkles,
  ChevronRight,
  ClipboardList
} from "lucide-react";

import { AssessmentQuestion, AssessmentRecord } from "./types";
import { assessmentQuestions, categoryWeights, categoryMetadata, getCategoryWeightKey } from "./data";
import { AssessmentForm } from "./components/AssessmentForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { HistoryLog } from "./components/HistoryLog";

export default function App() {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"quiz" | "results" | "history">("quiz");
  
  // Track selected historical run to view details, defaults to the latest completed run
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Load physical state records from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem("stress_assessment_records");
      if (saved) {
        const parsed = JSON.parse(saved) as AssessmentRecord[];
        setRecords(parsed);
        if (parsed.length > 0) {
          setSelectedRecordId(parsed[0].id);
          setActiveTab("results");
        }
      }
    } catch (e) {
      console.error("Local storage restoration failed", e);
    }
  }, []);

  // Save changes back to localStorage
  const saveRecords = (newRecords: AssessmentRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem("stress_assessment_records", JSON.stringify(newRecords));
    } catch (e) {
      console.error("Failed persisting records to local storage", e);
    }
  };

  // Process and compile newly completed test responses
  const handleCompleteQuiz = (answers: Record<string, number>) => {
    const timestamp = new Date().toISOString();
    const id = "rec_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();

    // 1. Group answers by category targets
    const rawByCategory: Record<string, { actual: number; max: number }> = {
      lifestyle: { actual: 0, max: 0 },
      academic_work: { actual: 0, max: 0 },
      cognitive_social: { actual: 0, max: 0 },
      physical_emotional: { actual: 0, max: 0 }
    };

    assessmentQuestions.forEach((q) => {
      const targetCategory = getCategoryWeightKey(q.category);
      const answerVal = answers[q.id];

      if (answerVal !== undefined) {
        // Option values range from 0 to 3, so max possible option value is 3
        rawByCategory[targetCategory].actual += answerVal;
        rawByCategory[targetCategory].max += 3;
      }
    });

    // 2. Build final category stats and apply Weights
    const finalByCategory: Record<string, { value: number; max: number; percentage: number }> = {};
    let totalWeightedScore = 0;
    let totalMaxPossibleWeighted = 0;

    Object.entries(rawByCategory).forEach(([category, data]) => {
      const weight = categoryWeights[category] || 1.0;
      const actualScore = data.actual;
      const maxScore = data.max;

      // Calculate percentage inside this single category
      const percentage = maxScore > 0 ? (actualScore / maxScore) * 100 : 0;

      finalByCategory[category] = {
        value: actualScore,
        max: maxScore,
        percentage
      };

      // Accumulate weighted values
      totalWeightedScore += actualScore * weight;
      totalMaxPossibleWeighted += maxScore * weight;
    });

    // 3. Overall Weighted Percentage Score
    const overallScore = totalMaxPossibleWeighted > 0 
      ? (totalWeightedScore / totalMaxPossibleWeighted) * 100 
      : 0;

    // 4. Identify the highest distress category loading
    let highestStressCategory = "lifestyle";
    let highestPercentage = -1;

    Object.entries(finalByCategory).forEach(([category, stats]) => {
      if (stats.percentage > highestPercentage) {
        highestPercentage = stats.percentage;
        highestStressCategory = category;
      }
    });

    // Handle tiebreaker by higher multiplier weight
    if (highestPercentage === 0) {
      // Find category with highest answer if all are zero, or default
      highestStressCategory = "physical_emotional";
    }

    const newRecord: AssessmentRecord = {
      id,
      timestamp,
      answers,
      scores: {
        overall: overallScore,
        byCategory: finalByCategory
      },
      highestStressCategory
    };

    const updatedRecords = [newRecord, ...records];
    saveRecords(updatedRecords);
    setSelectedRecordId(id);
    setActiveTab("results");
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this historical assessment record?")) {
      const updated = records.filter((r) => r.id !== id);
      saveRecords(updated);
      
      if (selectedRecordId === id) {
        setSelectedRecordId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("CRITICAL ACTION: This runs a complete cleanup of ALL diagnostic logs. Are you absolutely sure?")) {
      saveRecords([]);
      setSelectedRecordId(null);
      setActiveTab("quiz");
    }
  };

  const handleRetakeQuiz = () => {
    setActiveTab("quiz");
  };

  const activeRecord = records.find((r) => r.id === selectedRecordId) || records[0] || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-100 flex flex-col justify-between" id="app-root">
      
      {/* Decorative top header glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-950/20 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-8 relative z-10">
        
        {/* Navigation Headboard Title */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100/40 dark:border-slate-900">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-650 dark:text-indigo-450 font-mono text-[10px] uppercase font-extrabold tracking-widest flex items-center gap-1">
                <Dna className="w-3 h-3 text-indigo-500" />
                V2.5 WEIGHTED BASELINE ENGINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-display font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-none flex items-center gap-2">
              Well-being & Stress Assessment
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-sans font-medium">
              Multi-dimensional analysis profiling lifestyle, academic, cognitive, and physical pressure metrics using weighted formulas.
            </p>
          </div>

          {/* Segment View Selector Controller Tabs */}
          <div className="flex p-1.5 bg-white dark:bg-slate-900/65 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm self-start shrink-0">
            <button
              onClick={() => setActiveTab("quiz")}
              id="tab-btn-quiz"
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Take Assessment
            </button>

            <button
              onClick={() => {
                if (!activeRecord) {
                  alert("Please take an assessment first to load report insights.");
                  return;
                }
                setActiveTab("results");
              }}
              id="tab-btn-results"
              disabled={!activeRecord}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 relative ${
                !activeRecord 
                  ? "opacity-40 cursor-not-allowed text-slate-300"
                  : activeTab === "results"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold cursor-pointer"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              }`}
            >
              Diagnostic Report
            </button>

            <button
              onClick={() => setActiveTab("history")}
              id="tab-btn-history"
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === "history"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Historical Trends ({records.length})
            </button>
          </div>
        </header>

        {/* Informative explanation banner only on Quiz page to give visual framing */}
        {activeTab === "quiz" && records.length === 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-900/40 p-5 rounded-3xl border border-indigo-100/50 dark:border-slate-800 flex items-start sm:items-center gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 shadow-md shadow-indigo-100/35 dark:shadow-none shrink-0 text-indigo-550 text-indigo-500">
              <ClipboardList className="w-6.5 h-6.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">How our diagnostic weighted rating operates:</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 sm:max-w-4xl leading-relaxed">
                By acknowledging that physical exhaustion and concentration stress load are heavier signals than lifestyle deviations, each category scales with high-fidelity multiplier weights (from <code className="font-mono bg-white/70 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-350">1.0x</code> up to <code className="font-mono bg-white/70 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-350">2.0x</code>). Fill out your current conditions to generate insights on stress defenses.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Display Layout */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "quiz" && (
              <motion.div
                key="quiz-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                <AssessmentForm 
                  questions={assessmentQuestions} 
                  onComplete={handleCompleteQuiz}
                  initialAnswers={records[0]?.answers || {}}
                />
              </motion.div>
            )}

            {activeTab === "results" && activeRecord && (
              <motion.div
                key="results-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <ResultsDashboard 
                  record={activeRecord} 
                  onRetake={handleRetakeQuiz}
                  historyLength={records.length}
                />
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <HistoryLog
                  records={records}
                  activeRecordId={selectedRecordId}
                  onSelect={(rec) => {
                    setSelectedRecordId(rec.id);
                    setActiveTab("results");
                  }}
                  onDeleteRecord={handleDeleteRecord}
                  onClearHistory={handleClearAllHistory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Styled Footer */}
      <footer className="w-full bg-slate-100 dark:bg-slate-950/60 py-6 border-t border-slate-200/50 dark:border-slate-900/60 mt-12 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-450 text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <span>Wellness Assessment & Analytics Dashboard</span>
            <span>•</span>
            <span className="font-bold text-slate-500 dark:text-slate-400">Secure localStorage Sandbox</span>
          </div>
          <div>
            <span>UTC Local State Engine — 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
