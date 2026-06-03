import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, ListRestart, Sparkles, HelpCircle } from "lucide-react";
import { AssessmentQuestion } from "../types";
import { categoryMetadata, getCategoryWeightKey, categoryWeights } from "../data";

interface AssessmentFormProps {
  questions: AssessmentQuestion[];
  onComplete: (answers: Record<string, number>) => void;
  initialAnswers?: Record<string, number>;
}

export function AssessmentForm({ questions, onComplete, initialAnswers = {} }: AssessmentFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [showProgressHint, setShowProgressHint] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Track keyboard events for seamless 1/2/3/4 selection of options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion) return;
      const key = parseInt(e.key);
      if (key >= 1 && key <= currentQuestion.options.length) {
        const optionIndex = key - 1;
        const selectedValue = currentQuestion.options[optionIndex].value;
        handleSelectValue(selectedValue);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        handlePrev();
      } else if (e.key === "ArrowRight" && answers[currentQuestion.id] !== undefined) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQuestion, answers]);

  const handleSelectValue = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Auto-advance with a slight delay for better sensory flow, except on the last question
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length >= totalQuestions) {
      onComplete(answers);
    } else {
      setShowProgressHint(true);
      setTimeout(() => setShowProgressHint(false), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your quiz draft?")) {
      setAnswers({});
      setCurrentIndex(0);
    }
  };

  const currentSelectedValue = answers[currentQuestion?.id];
  const meta = currentQuestion ? categoryMetadata[getCategoryWeightKey(currentQuestion.category) as keyof typeof categoryMetadata] : null;
  const weight = currentQuestion ? categoryWeights[getCategoryWeightKey(currentQuestion.category)] : 1.0;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none overflow-hidden" id="assessment-container">
      {/* Quiz Progress Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Dimension Assessment
          </span>
          <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            Well-being Questionnaire
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {answeredCount} of {totalQuestions} answered
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {progressPercent}% Complete
            </div>
          </div>
          {/* Circular progress bar */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-500 transition-all duration-300"
                strokeWidth="3.5"
                strokeDasharray={`${progressPercent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress timeline strip */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Category Pill Tag */}
            {meta && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${meta.color.split(" ")[2]} ${meta.color.split(" ")[1]} ${meta.color.split(" ")[0]}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {meta.label}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">
                  <span className="font-mono">Multiplier Weight:</span>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{weight.toFixed(1)}x</span>
                </div>
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-xl md:text-2xl font-display font-medium text-slate-800 dark:text-slate-100 leading-snug">
              {currentQuestion.text}
            </h3>

            {/* Options Interactive Grid */}
            <div className="space-y-3.5 mt-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentSelectedValue === option.value;
                return (
                  <button
                    key={`${currentQuestion.id}-${idx}`}
                    id={`btn-opt-${currentIndex}-${idx}`}
                    onClick={() => handleSelectValue(option.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50/45 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-100 ring-2 ring-indigo-500/10"
                        : "border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-sans font-medium text-base leading-tight">
                        {option.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                        Score: {option.value}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5.5 h-5.5 text-indigo-500 shrink-0" />
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Form Controls Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            id="btn-quiz-prev"
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentIndex === 0
                ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Prev
          </button>

          {/* Tips and helpful guidelines */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint: Press keys [1-4] to select quickly</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              id="btn-quiz-reset"
              title="Reset questionnaire progress"
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
            >
              <ListRestart className="w-5 h-5" />
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                id="btn-quiz-complete"
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  answeredCount < totalQuestions
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                }`}
              >
                Assemble Insights
                <CheckCircle2 className="w-4.5 h-4.5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                id="btn-quiz-next"
                disabled={currentSelectedValue === undefined}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentSelectedValue === undefined
                    ? "bg-slate-50 dark:bg-slate-800/60 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 cursor-pointer"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showProgressHint && (
        <div className="px-6 py-2 bg-rose-50 dark:bg-rose-950/25 border-t border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
          Incomplete: Please make sure to fill out all questions prior to finalizing.
        </div>
      )}
    </div>
  );
}
