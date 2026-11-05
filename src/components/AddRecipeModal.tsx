import { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, ChefHat } from 'lucide-react';
import { Recipe, RecipeCategory } from '../types/recipe';

interface AddRecipeModalProps {
  onClose: () => void;
  onAddRecipe: (newRecipe: Recipe) => void;
}

const PRESET_IMAGES = [
  { label: 'Avocado Toast', url: '/src/assets/images/recipe_avocado_toast_1793887265846.jpg' },
  { label: 'Blueberry Pancakes', url: '/src/assets/images/recipe_berry_pancakes_1793887264537.jpg' },
  { label: 'Salmon Bowl', url: '/src/assets/images/recipe_salmon_bowl_1793887266290.jpg' },
  { label: 'Creamy Fettuccine', url: '/src/assets/images/recipe_creamy_pasta_1793887265437.jpg' },
  { label: 'Chocolate Lava', url: '/src/assets/images/recipe_chocolate_lava_1793887267162.jpg' },
  { label: 'Guacamole & Chips', url: '/src/assets/images/recipe_guacamole_chips_1793887288639.jpg' },
  { label: 'Strawberry Acai Bowl', url: '/src/assets/images/recipe_strawberry_acai_1793887288712.jpg' },
];

export function AddRecipeModal({ onClose, onAddRecipe }: AddRecipeModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Dinner');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[2].url);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(15);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(25);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  
  // Ingredients dynamic state
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: number; unit: string }>>([
    { id: '1', name: 'Fresh garlic', amount: 3, unit: 'cloves' },
    { id: '2', name: 'Extra virgin olive oil', amount: 2, unit: 'tbsp' },
  ]);

  // Instructions dynamic state
  const [instructions, setInstructions] = useState<Array<{ stepNumber: number; instruction: string; timerMinutes?: number }>>([
    { stepNumber: 1, instruction: 'Prep all fresh ingredients and season with salt and pepper.', timerMinutes: 5 },
    { stepNumber: 2, instruction: 'Heat olive oil in a skillet and cook until golden brown.', timerMinutes: 10 },
  ]);

  const [errors, setErrors] = useState<string>('');

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', amount: 1, unit: 'item' },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateIngredient = (id: string, field: 'name' | 'amount' | 'unit', val: string | number) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const handleAddInstruction = () => {
    setInstructions((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, instruction: '', timerMinutes: undefined },
    ]);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    const filtered = instructions.filter((_, idx) => idx !== index);
    setInstructions(
      filtered.map((step, idx) => ({ ...step, stepNumber: idx + 1 }))
    );
  };

  const handleUpdateInstruction = (index: number, instruction: string, timer?: number) => {
    setInstructions((prev) =>
      prev.map((step, idx) => (idx === index ? { ...step, instruction, timerMinutes: timer } : step))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors('Please enter a recipe title.');
      return;
    }
    const validIngredients = ingredients.filter((i) => i.name.trim() !== '');
    if (validIngredients.length === 0) {
      setErrors('Please add at least one ingredient.');
      return;
    }
    const validInstructions = instructions.filter((i) => i.instruction.trim() !== '');
    if (validInstructions.length === 0) {
      setErrors('Please add at least one instruction step.');
      return;
    }

    const newRecipe: Recipe = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'A delicious home-cooked recipe.',
      category,
      imageUrl: imageUrl || PRESET_IMAGES[0].url,
      prepTimeMinutes: Math.max(1, prepTimeMinutes),
      cookTimeMinutes: Math.max(0, cookTimeMinutes),
      servings: Math.max(1, servings),
      difficulty,
      rating: 5.0,
      reviewsCount: 1,
      nutrition: {
        calories: 380,
        protein: '18g',
        carbs: '35g',
        fat: '16g',
      },
      ingredients: validIngredients,
      instructions: validInstructions.map((s, idx) => ({
        stepNumber: idx + 1,
        instruction: s.instruction,
        timerMinutes: s.timerMinutes ? Number(s.timerMinutes) : undefined,
      })),
      isFavorite: true,
      isCustom: true,
      author: 'You (Home Chef)',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto max-h-[100vh] sm:max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Recipe
              </h2>
              <p className="text-xs text-slate-500">
                Share your culinary creation with custom ingredients and steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400">
              {errors}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recipe Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grandma's Lemon Ricotta Cake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief story or flavor overview for this dish..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Timing, Servings, Difficulty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Prep Time (min)
              </label>
              <input
                type="number"
                min="1"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Cook Time (min)
              </label>
              <input
                type="number"
                min="0"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              Select Recipe Image
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    imageUrl === img.url
                      ? 'border-orange-500 ring-2 ring-orange-500/20 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Ingredients List
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Qty"
                    value={ing.amount}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'amount', Number(e.target.value))}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums"
                  />
                  <input
                    type="text"
                    placeholder="Unit (cups, tbsp)"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    disabled={ingredients.length <= 1}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Cooking Steps
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                    {step.stepNumber}
                  </span>
                  <input
                    type="text"
                    placeholder={`Step ${step.stepNumber} instructions...`}
                    value={step.instruction}
                    onChange={(e) => handleUpdateInstruction(idx, e.target.value, step.timerMinutes)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Timer (min)"
                    value={step.timerMinutes || ''}
                    onChange={(e) =>
                      handleUpdateInstruction(
                        idx,
                        step.instruction,
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    disabled={instructions.length <= 1}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm shadow-md transition-colors"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
