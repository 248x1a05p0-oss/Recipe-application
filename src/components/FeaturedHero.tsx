import { Recipe } from '../types/recipe';
import { Clock, Play, Star, Sparkles } from 'lucide-react';

interface FeaturedHeroProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export function FeaturedHero({ recipe, onSelect }: FeaturedHeroProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-md transition-all hover:shadow-xl"
    >
      {/* Background Image Container */}
      <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full min-h-[260px] sm:min-h-[320px]">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
        />
        {/* Measured scrim overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
          <div className="max-w-2xl space-y-3">
            {/* Unboxed Metadata (frontend-design zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Today
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-200">{recipe.category}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Clock className="w-3.5 h-3.5" />
                {totalTime}m total
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {recipe.name}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
              {recipe.description}
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                className="min-h-[44px] px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>View Recipe & Cook</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white tabular-nums">{recipe.rating}</span>
                <span className="text-slate-400">({recipe.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
