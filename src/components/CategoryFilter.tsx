import { RecipeCategory } from '../types/recipe';
import { Coffee, Utensils, Moon, Cookie, Cake, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts: Record<string, number>;
}

interface CategoryItem {
  id: string;
  label: string;
  icon: typeof Coffee;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'All', label: 'All Recipes', icon: Sparkles },
  { id: 'Breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'Lunch', label: 'Lunch', icon: Utensils },
  { id: 'Dinner', label: 'Dinner', icon: Moon },
  { id: 'Snacks', label: 'Snacks', icon: Cookie },
  { id: 'Desserts', label: 'Desserts', icon: Cake },
];

export function CategoryFilter({ selectedCategory, onSelectCategory, counts }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-orange-500 dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400 dark:text-slate-950' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              isSelected
                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
