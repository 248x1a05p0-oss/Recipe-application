export interface FlutterCodeFile {
  filename: string;
  category: string;
  description: string;
  code: string;
}

export const FLUTTER_CODE_SNIPPETS: FlutterCodeFile[] = [
  {
    filename: 'lib/main.dart',
    category: 'Entrypoint',
    description: 'Flutter application entry point with Material 3 theming and responsive navigation.',
    code: `import 'package:flutter/material.dart';
import 'package:smart_recipe/screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartRecipeApp());
}

class SmartRecipeApp extends StatelessWidget {
  const SmartRecipeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Recipe',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFF97316), // Warm culinary orange
          brightness: Brightness.light,
        ),
        fontFamily: 'Plus Jakarta Sans',
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFF97316),
          brightness: Brightness.dark,
        ),
        fontFamily: 'Plus Jakarta Sans',
      ),
      themeMode: ThemeMode.system,
      home: const HomeScreen(),
    );
  }
}
`,
  },
  {
    filename: 'lib/models/recipe.dart',
    category: 'Models',
    description: 'Strongly typed Dart model for recipes, ingredients, and instruction steps.',
    code: `enum RecipeCategory { breakfast, lunch, dinner, snacks, desserts }

enum Difficulty { easy, medium, hard }

class Ingredient {
  final String id;
  final String name;
  final double amount;
  final String unit;

  const Ingredient({
    required this.id,
    required this.name,
    required this.amount,
    required this.unit,
  });

  Ingredient copyWith({double? amount}) {
    return Ingredient(
      id: id,
      name: name,
      amount: amount ?? this.amount,
      unit: unit,
    );
  }
}

class InstructionStep {
  final int stepNumber;
  final String instruction;
  final int? timerMinutes;
  final String? tip;

  const InstructionStep({
    required this.stepNumber,
    required this.instruction,
    this.timerMinutes,
    this.tip,
  });
}

class Recipe {
  final String id;
  final String name;
  final String description;
  final RecipeCategory category;
  final String imageUrl;
  final int prepTimeMinutes;
  final int cookTimeMinutes;
  final int servings;
  final Difficulty difficulty;
  final double rating;
  final int reviewsCount;
  final List<Ingredient> ingredients;
  final List<InstructionStep> instructions;
  bool isFavorite;

  Recipe({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.prepTimeMinutes,
    required this.cookTimeMinutes,
    required this.servings,
    required this.difficulty,
    required this.rating,
    required this.reviewsCount,
    required this.ingredients,
    required this.instructions,
    this.isFavorite = false,
  });
}
`,
  },
  {
    filename: 'lib/screens/home_screen.dart',
    category: 'Screens',
    description: 'Home screen displaying categories filter, search bar, and grid/list of recipes.',
    code: `import 'package:flutter/material.dart';
import 'package:smart_recipe/models/recipe.dart';
import 'package:smart_recipe/screens/recipe_detail_screen.dart';
import 'package:smart_recipe/widgets/recipe_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();
  final List<String> _categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Desserts',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Smart Recipe',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.bookmark_outline),
            onPressed: () {
              // Navigate to Saved Recipes
            },
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'What would you like to cook today?',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 16),
                  SearchBar(
                    controller: _searchController,
                    hintText: 'Search recipes, ingredients...',
                    leading: const Icon(Icons.search),
                    elevation: const MaterialStatePropertyAll(1),
                  ),
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _categories.map((category) {
                        final isSelected = _selectedCategory == category;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: FilterChip(
                            selected: isSelected,
                            label: Text(category),
                            onSelected: (selected) {
                              setState(() {
                                _selectedCategory = category;
                              });
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return RecipeCard(
                    onTap: (recipe) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => RecipeDetailScreen(recipe: recipe),
                        ),
                      );
                    },
                  );
                },
                childCount: 6,
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Open Add Recipe Screen
        },
        icon: const Icon(Icons.add),
        label: const Text('New Recipe'),
      ),
    );
  }
}
`,
  },
  {
    filename: 'lib/screens/recipe_detail_screen.dart',
    category: 'Screens',
    description: 'Recipe details screen with sliver app bar, serving scaling, and cooking instructions.',
    code: `import 'package:flutter/material.dart';
import 'package:smart_recipe/models/recipe.dart';

class RecipeDetailScreen extends StatefulWidget {
  final Recipe recipe;

  const RecipeDetailScreen({super.key, required this.recipe});

  @override
  State<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends State<RecipeDetailScreen> {
  late int _servings;

  @override
  void initState() {
    super.initState();
    _servings = widget.recipe.servings;
  }

  @override
  Widget build(BuildContext context) {
    final scale = _servings / widget.recipe.servings;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                widget.recipe.imageUrl,
                fit: BoxFit.cover,
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(
                  widget.recipe.isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: Colors.red,
                ),
                onPressed: () {
                  setState(() {
                    widget.recipe.isFavorite = !widget.recipe.isFavorite;
                  });
                },
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.recipe.name,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.recipe.description,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                  const SizedBox(height: 20),
                  // Metadata Row: Prep, Cook, Servings, Difficulty
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildMetaChip(Icons.timer_outlined, '\${widget.recipe.prepTimeMinutes}m prep'),
                      _buildMetaChip(Icons.local_fire_department_outlined, '\${widget.recipe.cookTimeMinutes}m cook'),
                      _buildMetaChip(Icons.speed_outlined, widget.recipe.difficulty.name.toUpperCase()),
                    ],
                  ),
                  const Divider(height: 32),
                  // Ingredients Section with Scaler
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Ingredients',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline),
                            onPressed: _servings > 1 ? () => setState(() => _servings--) : null,
                          ),
                          Text('\$_servings servings'),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline),
                            onPressed: () => setState(() => _servings++),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...widget.recipe.ingredients.map((ing) {
                    final scaled = (ing.amount * scale);
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.check_circle_outline, size: 20),
                      title: Text(ing.name),
                      trailing: Text(
                        '\${scaled % 1 == 0 ? scaled.toInt() : scaled.toStringAsFixed(1)} \${ing.unit}',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    );
                  }),
                  const Divider(height: 32),
                  Text(
                    'Step-by-Step Instructions',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  ...widget.recipe.instructions.map((step) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 14,
                            child: Text('\${step.stepNumber}', style: const TextStyle(fontSize: 12)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(step.instruction),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetaChip(IconData icon, String label) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.orange),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}
`,
  },
  {
    filename: 'pubspec.yaml',
    category: 'Configuration',
    description: 'Flutter project dependencies including Material design and Google fonts.',
    code: `name: smart_recipe
description: "A modern Flutter recipe application."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  provider: ^6.1.2
  cached_network_image: ^3.3.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
];
