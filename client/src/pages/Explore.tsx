import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopicCard } from "@/components/shared/TopicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, Code, Brain, Briefcase, DollarSign, FlaskConical, TrendingUp, LayoutGrid, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const categories = [
  { id: "all", label: "All Topics", icon: LayoutGrid },
  { id: "tech", label: "Tech", icon: BookOpen },
  { id: "programming", label: "Programming", icon: Code },
  { id: "ai-ml", label: "AI & ML", icon: Brain },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "science", label: "Science", icon: FlaskConical },
  { id: "trending", label: "Trending", icon: TrendingUp },
];

const allTopics = [
  {
    id: "1",
    title: "Large Language Models",
    summary: "How GPT, Claude and other LLMs are reshaping AI",
    category: "AI & ML",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "2",
    title: "React Server Components",
    summary: "The future of React rendering explained",
    category: "Programming",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "3",
    title: "Quantum Computing Basics",
    summary: "Understanding qubits, superposition, and entanglement",
    category: "Science",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: false,
  },
  {
    id: "4",
    title: "Startup Fundraising",
    summary: "From seed to Series A: A complete guide",
    category: "Business",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "5",
    title: "Neural Networks Deep Dive",
    summary: "From perceptrons to transformers",
    category: "AI & ML",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "6",
    title: "TypeScript Best Practices",
    summary: "Write cleaner, safer code with TypeScript",
    category: "Programming",
    difficulty: "Intermediate",
    hasInfographic: false,
    hasArticle: true,
  },
  {
    id: "7",
    title: "Blockchain Fundamentals",
    summary: "How distributed ledgers work",
    category: "Tech",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "8",
    title: "Product-Market Fit",
    summary: "Finding and measuring your market fit",
    category: "Business",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "9",
    title: "Cloud Architecture Patterns",
    summary: "Designing scalable cloud solutions",
    category: "Tech",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "10",
    title: "Personal Finance 101",
    summary: "Building wealth through smart money habits",
    category: "Finance",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "11",
    title: "CRISPR Gene Editing",
    summary: "The revolution in genetic engineering",
    category: "Science",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
  },
  {
    id: "12",
    title: "GraphQL vs REST",
    summary: "Choosing the right API architecture",
    category: "Programming",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
  },
];

// Suggestions for autocomplete
const searchSuggestions = [
  "Large Language Models",
  "React Server Components", 
  "Machine Learning basics",
  "Python programming",
  "JavaScript frameworks",
  "Cloud computing",
  "Data Science",
  "Web development",
  "Artificial Intelligence",
  "Blockchain technology",
];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return searchSuggestions.slice(0, 5);
    return searchSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      "all": "All",
      "tech": "Tech",
      "programming": "Programming",
      "ai-ml": "AI & ML",
      "business": "Business",
      "finance": "Finance",
      "science": "Science",
      "trending": "Trending",
    };
    return categoryMap[categoryId] || "All";
  };

  const filteredTopics = allTopics.filter((topic) => {
    const categoryName = getCategoryName(selectedCategory);
    const matchesCategory = selectedCategory === "all" || topic.category === categoryName;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setMobileMenuOpen(false);
  };

  const CategorySidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "" : "p-6"}>
      <h2 className="font-display font-semibold text-lg mb-4">Categories</h2>
      <nav className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 border-r border-border bg-card/50 min-h-[calc(100vh-4rem)] sticky top-16">
            <CategorySidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Search Bar with Autocomplete */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative max-w-2xl mx-auto mb-6 md:mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-12 pr-12 h-12 md:h-14 rounded-2xl text-base border-2 focus:border-primary bg-card"
                />
                {searchQuery && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}
                {!searchQuery && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </Button>
                )}
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="py-2 px-3 border-b border-border">
                    <span className="text-xs text-muted-foreground font-medium">
                      {searchQuery ? "Suggestions" : "Popular searches"}
                    </span>
                  </div>
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-xl h-12">
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      {getCategoryName(selectedCategory) === "All" ? "All Topics" : getCategoryName(selectedCategory)}
                    </span>
                    <span className="text-xs text-muted-foreground">Tap to filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetHeader className="p-6 pb-0">
                    <SheetTitle>Filter Topics</SheetTitle>
                  </SheetHeader>
                  <div className="p-6 pt-4">
                    <CategorySidebar isMobile />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="font-display text-xl md:text-2xl font-bold mb-1">
                  {getCategoryName(selectedCategory) === "All" ? "All Topics" : getCategoryName(selectedCategory)}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {filteredTopics.length} {filteredTopics.length === 1 ? "topic" : "topics"} available
                </p>
              </div>
            </motion.div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TopicCard topic={topic} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredTopics.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">No topics found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
