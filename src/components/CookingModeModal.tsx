import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Volume2, Timer } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { playChimeSound } from '../utils/audio';

interface CookingModeModalProps {
  recipe: Recipe;
  servings: number;
  onClose: () => void;
}

export function CookingModeModal({ recipe, servings, onClose }: CookingModeModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = recipe.instructions[currentStepIndex];
  const totalSteps = recipe.instructions.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Initialize or reset timer when changing step
  useEffect(() => {
    if (currentStep?.timerMinutes && currentStep.timerMinutes > 0) {
      setTimerSecondsLeft(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSecondsLeft(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Timer interval countdown
  useEffect(() => {
    if (!isTimerRunning || timerSecondsLeft === null) return;

    if (timerSecondsLeft <= 0) {
      setIsTimerRunning(false);
      playChimeSound();
      return;
    }

    const interval = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          playChimeSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      playChimeSound();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
              {currentStepIndex + 1}
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                {recipe.name}
              </h2>
              <p className="text-xs text-slate-500">
                Step {currentStepIndex + 1} of {totalSteps} · {servings} servings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playChimeSound()}
              title="Test timer chime sound"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-orange-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-center">
          {!isCompleted ? (
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
                Instruction
              </div>
              
              <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {currentStep.instruction}
              </p>

              {currentStep.tip && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-sm">
                  <span className="font-semibold block mb-0.5">Chef's Tip:</span>
                  {currentStep.tip}
                </div>
              )}

              {/* Step Timer Widget (if step has timer) */}
              {timerSecondsLeft !== null && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isTimerRunning ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      <Timer className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Step Timer</div>
                      <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                        {formatTimer(timerSecondsLeft)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`min-h-[44px] px-5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm ${
                        isTimerRunning
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Start Timer
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        if (currentStep?.timerMinutes) {
                          setTimerSecondsLeft(currentStep.timerMinutes * 60);
                        }
                      }}
                      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Celebration Screen when all steps are completed */
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Bon Appétit!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                You've successfully prepared <span className="font-semibold text-slate-900 dark:text-slate-100">{recipe.name}</span>. Plate up and enjoy your handcrafted meal!
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setIsCompleted(false);
                  }}
                  className="min-h-[44px] px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Restart Cooking
                </button>
                <button
                  onClick={onClose}
                  className="min-h-[44px] px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm shadow-md transition-colors"
                >
                  Done Cooking
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isCompleted && (
          <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`min-h-[44px] px-4 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="min-h-[44px] px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              {currentStepIndex === totalSteps - 1 ? 'Finish Cooking' : 'Next Step'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
