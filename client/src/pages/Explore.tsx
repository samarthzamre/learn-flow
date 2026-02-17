import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, BarChart3, Loader2, Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame, Globe, Heart, Music, Video, Zap, Layout, Terminal, Palette, Shield, Settings, Database, Cloud, Smartphone, Monitor } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { getTopics, getCategories, type TopicItem } from "@/lib/api";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

const categoryParams: Record<string, string> = {
  "AI & ML": "bg-purple-500/10 text-purple-600",
  "Programming": "bg-blue-500/10 text-blue-600",
  "Science": "bg-red-500/10 text-red-600",
  "Business": "bg-orange-500/10 text-orange-600",
};

const iconMap: Record<string, any> = {
  Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame, Globe, Heart, Music, Video, Zap, Layout, Terminal, Palette, Shield, Settings, Database, Cloud, Smartphone, Monitor
};

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const selectedCategory = searchParams.get("category") || "";
  const [timeRange, setTimeRange] = useState("All Time");

  const { data: categories = [] } = useQuery({
    queryKey: ["client-categories"],
    queryFn: getCategories,
  });

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["client-topics", selectedCategory, searchQuery, timeRange],
    queryFn: () => getTopics({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      timeRange: timeRange || undefined,
    }),
  });

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set("category", slug);
    else params.delete("category");
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <h2 className="text-lg font-bold mb-6 px-4">Categories</h2>
            <div className="space-y-1">
              <button
                onClick={() => setCategory("")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${!selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${!selectedCategory ? "bg-white/20" : "bg-secondary"}`}>
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                  </div>
                </div>
                All Topics
              </button>

              {categories.map((cat) => {
                const isUrl = cat.icon.startsWith("http") || cat.icon.startsWith("/");
                const Icon = !isUrl ? (iconMap[cat.icon] || Cpu) : null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden ${selectedCategory === cat.slug ? "bg-white/20" : "bg-secondary"}`}>
                      {isUrl ? (
                        <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0">
            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setCategory("")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${!selectedCategory
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  All Topics
                </button>
                {categories.map((cat) => {
                  const isUrl = cat.icon.startsWith("http") || cat.icon.startsWith("/");
                  const Icon = !isUrl ? (iconMap[cat.icon] || Cpu) : null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedCategory === cat.slug
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                        }`}
                    >
                      {isUrl ? (
                        <img src={cat.icon} alt={cat.name} className="w-3.5 h-3.5 object-cover rounded-full" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Search Bar & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto lg:mx-0">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border/50 bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
                />
              </div>

              <div className="relative min-w-[140px]">
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 appearance-none rounded-2xl border border-border/50 bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium cursor-pointer"
                  >
                    <option value="All Time">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">
                {selectedCategory
                  ? categories.find(c => c.slug === selectedCategory)?.name || "Topics"
                  : "All Topics"}
              </h1>
              <p className="text-muted-foreground">
                {topics.length} topics available
              </p>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 rounded-2xl bg-secondary/30 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                {/* Topics Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {topics.map((topic, index) => {
                      // Determine colors based on category
                      let borderClass = "border-t-primary";
                      let textClass = "text-primary";

                      const cat = topic.category?.toLowerCase() || "";
                      if (cat.includes("ai")) { borderClass = "border-t-purple-500"; textClass = "text-purple-600"; }
                      else if (cat.includes("programming") || cat.includes("code")) { borderClass = "border-t-blue-500"; textClass = "text-blue-600"; }
                      else if (cat.includes("science")) { borderClass = "border-t-pink-500"; textClass = "text-pink-600"; }
                      else if (cat.includes("business") || cat.includes("finance")) { borderClass = "border-t-orange-500"; textClass = "text-orange-600"; }
                      else if (cat.includes("lifestyle") || cat.includes("health")) { borderClass = "border-t-emerald-500"; textClass = "text-emerald-600"; }

                      return (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link to={`/topic/${topic.id}`}>
                            <div className={`group h-full flex flex-col bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 border-t-[6px] ${borderClass}`}>
                              <div className="p-6 flex flex-col flex-grow relative">
                                {/* Date Badge */}
                                {topic.created_at && (
                                  <div className="absolute top-6 right-6 text-xs font-medium text-muted-foreground">
                                    {new Date(topic.created_at).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </div>
                                )}

                                {/* Category & Difficulty */}
                                <div className="flex flex-col items-start gap-3 mb-4 pr-20">
                                  <span className={`text-[11px] font-extrabold uppercase tracking-widest ${textClass}`}>
                                    {topic.category}
                                  </span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${difficultyColors[topic.difficulty] || "bg-secondary text-secondary-foreground"}`}>
                                    {topic.difficulty}
                                  </span>
                                </div>

                                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors text-foreground">
                                  {topic.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                                  {topic.summary}
                                </p>

                                {/* Footer Spacer */}
                                <div className="mt-auto pt-4 border-t border-border/40 w-full flex items-center gap-4 text-xs font-medium text-muted-foreground/80">
                                  {!!topic.hasInfographic && (
                                    <div className="flex items-center gap-1.5">
                                      <BarChart3 className="w-4 h-4" />
                                      Infographic
                                    </div>
                                  )}
                                  {!!topic.hasArticle && (
                                    <div className="flex items-center gap-1.5">
                                      <BookOpen className="w-4 h-4" />
                                      Article
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Empty State */}
                {topics.length === 0 && (
                  <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                    <div className="w-16 h-16 rounded-2xl bg-background shadow-sm flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">No topics found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
