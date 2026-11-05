import { Plus, Heart, Smartphone, Monitor, Sun, Moon, ChefHat, Code2 } from 'lucide-react';
import { ViewMode } from '../types/recipe';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
  onOpenCreate: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export function Navbar({
  currentView,
  onNavigate,
  favoritesCount,
  onOpenCreate,
  isDarkMode,
  onToggleDarkMode,
  isMobileFrame,
  onToggleMobileFrame,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div
          onClick={() => onNavigate('all')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            Smart Recipe
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onNavigate('all')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'all'
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : ''
            }`}
          >
            Explore
          </button>

          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'favorites'
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : ''
            }`}
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Favorites</span>
            <span className="text-xs text-slate-400 tabular-nums">({favoritesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('flutter-code')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'flutter-code'
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : ''
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-500" />
            <span>Flutter Code</span>
          </button>
        </nav>

        {/* Zone 3: Actions & 1 primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile frame toggle */}
          <button
            type="button"
            onClick={onToggleMobileFrame}
            aria-label="Toggle mobile device simulator frame"
            title={isMobileFrame ? 'Switch to Full Width Desktop' : 'Switch to Mobile Frame Simulator'}
            className="min-w-[40px] min-h-[40px] hidden sm:flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="min-h-[42px] px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>
    </header>
  );
}
