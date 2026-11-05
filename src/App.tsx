import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Heart,
  ChefHat,
  Sparkles,
  ArrowUpDown,
  UtensilsCrossed,
  Plus,
} from 'lucide-react';
import { Recipe, RecipeCategory, ViewMode } from './types/recipe';
import { INITIAL_RECIPES } from './data/initialRecipes';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { CategoryFilter } from './components/CategoryFilter';
import { FeaturedHero } from './components/FeaturedHero';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';

type SortOption = 'rating' | 'time' | 'servings' | 'name';

export default function App() {
  // Local storage loaded recipes or fallback to initial
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_items');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_RECIPES;
  });

  const [currentView, setCurrentView] = useState<ViewMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart_recipe_items', JSON.stringify(recipes));
    } catch {
      // Ignore quota errors
    }
  }, [recipes]);

  // Sync dark class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle favorite status
  const handleToggleFavorite = (recipeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r))
    );
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Add new recipe handler
  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    setSelectedRecipe(newRecipe);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: recipes.length };
    recipes.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [recipes]);

  // Filtered and sorted recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        // Filter by view
        if (currentView === 'favorites' && !recipe.isFavorite) {
          return false;
        }

        // Filter by category
        if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
          return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = recipe.name.toLowerCase().includes(q);
          const matchCategory = recipe.category.toLowerCase().includes(q);
          const matchIngredient = recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(q)
          );
          return matchName || matchCategory || matchIngredient;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'time') {
          return a.prepTimeMinutes + a.cookTimeMinutes - (b.prepTimeMinutes + b.cookTimeMinutes);
        }
        if (sortBy === 'servings') return b.servings - a.servings;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [recipes, currentView, selectedCategory, searchQuery, sortBy]);

  const favoritesCount = useMemo(() => {
    return recipes.filter((r) => r.isFavorite).length;
  }, [recipes]);

  // Daily featured recipe
  const featuredRecipe = recipes[2] || recipes[0];

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col`}>
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        favoritesCount={favoritesCount}
        onOpenCreate={() => setIsAddModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Container - either standard wide layout or Flutter Phone Frame Simulator */}
      <div className={`flex-1 flex justify-center ${isMobileFrame ? 'py-6 px-4 bg-slate-200/60 dark:bg-slate-900/80' : ''}`}>
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[414px] bg-slate-50 dark:bg-slate-950 rounded-[44px] shadow-2xl border-[8px] border-slate-800 dark:border-slate-700 overflow-hidden relative min-h-[820px] flex flex-col my-auto'
              : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12'
          }`}
        >
          {/* Simulated Mobile Notch & Status Bar if in mobile simulator frame */}
          {isMobileFrame && (
            <div className="pt-3 px-6 pb-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-b border-slate-200/50 dark:border-slate-800">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-800 dark:bg-slate-700 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          <div className={isMobileFrame ? 'p-4 pb-20 flex-1 overflow-y-auto' : ''}>
            {/* VIEW 1: FLUTTER CODE ARCHITECTURE VIEWER */}
            {currentView === 'flutter-code' ? (
              <FlutterCodeViewer />
            ) : (
              /* VIEW 2: RECIPE DISCOVERY & FAVORITES */
              <div className="space-y-6">
                {/* Search Bar & Header Area */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {currentView === 'favorites' ? 'Saved Recipes' : 'Explore Recipes'}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {currentView === 'favorites'
                          ? `You have saved ${favoritesCount} recipes for your weekly meal rotation`
                          : 'Discover chef-crafted meals, quick snacks, and artisanal desserts'}
                      </p>
                    </div>

                    {/* View Switcher Tabs (Explore / Favorites) */}
                    <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCurrentView('all')}
                        className={`min-h-[36px] px-3.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                          currentView === 'all'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        All ({recipes.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentView('favorites')}
                        className={`min-h-[36px] px-3.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                          currentView === 'favorites'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Saved ({favoritesCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar Input */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search recipes, garlic, salmon, breakfast..."
                      className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Featured Recipe Hero (shown when on 'all' view and not searching) */}
                {currentView === 'all' && !searchQuery && selectedCategory === 'All' && !isMobileFrame && (
                  <FeaturedHero
                    recipe={featuredRecipe}
                    onSelect={(recipe) => setSelectedRecipe(recipe)}
                  />
                )}

                {/* Category Filters Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Categories
                    </span>

                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
                      >
                        <option value="rating">Top Rated</option>
                        <option value="time">Fastest Cook Time</option>
                        <option value="servings">Most Servings</option>
                        <option value="name">Alphabetical</option>
                      </select>
                    </div>
                  </div>

                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    counts={categoryCounts}
                  />
                </div>

                {/* Recipe Grid or Empty State */}
                {filteredRecipes.length > 0 ? (
                  <div
                    className={`grid gap-4 sm:gap-6 ${
                      isMobileFrame
                        ? 'grid-cols-1'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}
                  >
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onSelect={(r) => setSelectedRecipe(r)}
                        onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <UtensilsCrossed className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {currentView === 'favorites'
                          ? 'No saved recipes yet'
                          : 'No matching recipes found'}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {currentView === 'favorites'
                          ? 'Tap the heart icon on any recipe card to save it to your personal favorites collection.'
                          : `We couldn't find any recipes matching "${searchQuery}". Try searching for another ingredient or clearing filters.`}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                          }}
                          className="min-h-[40px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="min-h-[40px] px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Recipe</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
        />
      )}

      {/* Add Recipe Modal */}
      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onAddRecipe={handleAddRecipe}
        />
      )}

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        favoritesCount={favoritesCount}
        onOpenCreate={() => setIsAddModalOpen(true)}
      />
    </div>
  );
}
