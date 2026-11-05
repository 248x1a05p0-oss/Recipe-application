import { Compass, Heart, PlusCircle, Code2 } from 'lucide-react';
import { ViewMode } from '../types/recipe';

interface BottomTabBarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
  onOpenCreate: () => void;
}

export function BottomTabBar({
  currentView,
  onNavigate,
  favoritesCount,
  onOpenCreate,
}: BottomTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => onNavigate('all')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'all'
              ? 'text-orange-600 dark:text-orange-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] mt-1">Explore</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('favorites')}
          className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors ${
            currentView === 'favorites'
              ? 'text-orange-600 dark:text-orange-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-current' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Saved</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreate}
          className="min-h-[44px] flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <PlusCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span className="text-[11px] mt-1">Add</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('flutter-code')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'flutter-code'
              ? 'text-orange-600 dark:text-orange-400 font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[11px] mt-1">Flutter</span>
        </button>
      </div>
    </nav>
  );
}
