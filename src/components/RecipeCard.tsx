import { useState } from 'react';
import { Heart, Clock, Utensils, Star, ChefHat } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export function RecipeCard({ recipe, onSelect, onToggleFavorite }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article
      onClick={() => onSelect(recipe)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-200"
    >
      {/* Recipe Image Container with fallback */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imageError ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-800 dark:to-slate-900">
            <Utensils className="w-10 h-10 text-orange-400 mb-2" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{recipe.name}</span>
          </div>
        )}

        {/* Favorite Heart Button - minimum 44x44px hitbox */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(recipe.id, e)}
          aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-transform active:scale-90"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              recipe.isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Custom Recipe Badge if user created */}
        {recipe.isCustom && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-1.5 text-[11px] font-medium text-white">
            <ChefHat className="w-3.5 h-3.5 text-orange-400" />
            <span>My Recipe</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Unboxed Metadata (frontend-design zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-orange-600 dark:text-orange-400 font-semibold">{recipe.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {totalTime}m
          </span>
          <span aria-hidden="true">·</span>
          <span>{recipe.difficulty}</span>
        </div>

        {/* Recipe Title */}
        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {recipe.name}
        </h3>

        {/* Short Description */}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Footer Info: Rating & Servings */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{recipe.rating}</span>
            <span className="text-slate-400">({recipe.reviewsCount})</span>
          </div>
          <span className="tabular-nums font-medium">{recipe.servings} servings</span>
        </div>
      </div>
    </article>
  );
}
