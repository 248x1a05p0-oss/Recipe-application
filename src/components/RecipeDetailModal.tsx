import { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Clock,
  Flame,
  Minus,
  Plus,
  Check,
  Play,
  Copy,
  ChefHat,
  Star,
  CheckCircle2
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { CookingModeModal } from './CookingModeModal';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function RecipeDetailModal({ recipe, onClose, onToggleFavorite }: RecipeDetailModalProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);

  const scaleFactor = servings / recipe.servings;

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyIngredients = () => {
    const list = recipe.ingredients
      .map((ing) => {
        const scaled = ing.amount * scaleFactor;
        const formatted = scaled % 1 === 0 ? scaled : scaled.toFixed(1);
        return `• ${formatted} ${ing.unit} ${ing.name}`;
      })
      .join('\n');
    const text = `${recipe.name} (${servings} servings)\n\nIngredients:\n${list}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: `Check out this recipe for ${recipe.name}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyIngredients();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[100vh] sm:max-h-[94vh] flex flex-col">
          
          {/* Hero Header with Large Image and Flutter-style Floating Actions */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0 overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top Navigation Bar: Close & Action Buttons */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share recipe"
                  className="min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                  title="Share or copy recipe"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(recipe.id)}
                  aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all active:scale-90"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom text inside Hero */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
                <span>{recipe.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {recipe.rating} ({recipe.reviewsCount} reviews)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {recipe.name}
              </h1>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {recipe.description}
            </p>

            {/* Key Metadata Metric Strip */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Prep
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {recipe.prepTimeMinutes}m
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-3.5 h-3.5" /> Cook
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {recipe.cookTimeMinutes}m
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <ChefHat className="w-3.5 h-3.5" /> Level
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {recipe.difficulty}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  Energy
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {recipe.nutrition.calories} kcal
                </div>
              </div>
            </div>

            {/* Ingredients Section with Servings Scaler */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Ingredients
                  </h2>
                  <p className="text-xs text-slate-500">
                    Check off items as you prep in your kitchen
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Servings Scaler Control */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Servings:</span>
                    <button
                      type="button"
                      onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                      disabled={servings <= 1}
                      className="min-w-[28px] min-h-[28px] rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-30 transition-colors shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 w-5 text-center tabular-nums">
                      {servings}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServings((prev) => prev + 1)}
                      className="min-w-[28px] min-h-[28px] rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={copyIngredients}
                    className="min-h-[38px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recipe.ingredients.map((ing) => {
                  const isChecked = !!checkedIngredients[ing.id];
                  const scaledAmount = ing.amount * scaleFactor;
                  const displayAmount =
                    scaledAmount % 1 === 0 ? scaledAmount : scaledAmount.toFixed(1);

                  return (
                    <label
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800 text-slate-400 dark:text-slate-500 line-through'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 text-white'
                              : 'border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium">{ing.name}</span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-orange-600 dark:text-orange-400 shrink-0 ml-2">
                        {displayAmount} {ing.unit}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Step-by-Step Cooking Instructions */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Cooking Instructions
                  </h2>
                  <p className="text-xs text-slate-500">
                    {recipe.instructions.length} sequential steps
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recipe.instructions.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                        {step.instruction}
                      </p>
                      {step.tip && (
                        <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                          <span className="font-semibold">Tip:</span> {step.tip}
                        </div>
                      )}
                      {step.timerMinutes && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>Timer recommended: {step.timerMinutes} mins</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Nutrition Facts Details */}
            <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Nutrition per serving
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {recipe.nutrition.calories}
                  </div>
                  <div className="text-[11px] text-slate-500">Calories</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {recipe.nutrition.protein}
                  </div>
                  <div className="text-[11px] text-slate-500">Protein</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {recipe.nutrition.carbs}
                  </div>
                  <div className="text-[11px] text-slate-500">Carbs</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {recipe.nutrition.fat}
                  </div>
                  <div className="text-[11px] text-slate-500">Fat</div>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Bottom Action Bar with "Start Cooking Mode" CTA */}
          <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500 hidden sm:block">
              {Object.keys(checkedIngredients).filter((k) => checkedIngredients[k]).length} of {recipe.ingredients.length} ingredients prepped
            </div>

            <button
              type="button"
              onClick={() => setIsCookingMode(true)}
              className="w-full sm:w-auto min-h-[48px] px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Cooking Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cooking Mode Modal if active */}
      {isCookingMode && (
        <CookingModeModal
          recipe={recipe}
          servings={servings}
          onClose={() => setIsCookingMode(false)}
        />
      )}
    </>
  );
}
