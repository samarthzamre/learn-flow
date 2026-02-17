import { motion } from "framer-motion";
import { Flame, BookOpen, BarChart3, Loader2, ArrowLeft, Clock, Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { getTrending, getHomepage, type TopicItem } from "@/lib/api";
import { useState, useMemo } from "react";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

const timeFilters = ["Today", "This Week", "This Month"];
const sourceFilters = ["All Sources", "Google", "GitHub", "Twitter", "News"];

const Trending = () => {
  const [timeRange, setTimeRange] = useState("This Week");
  const [source, setSource] = useState("All Sources");

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery({
    queryKey: ["client-trending", timeRange, source],
    queryFn: () => getTrending({ timeRange, source }),
  });

  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepage,
  });

  const categoryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    if (homepage?.categories) {
      homepage.categories.forEach((cat) => {
        colors[cat.name] = cat.color;
      });
    }
    return colors;
  }, [homepage]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 mb-6 border border-blue-100">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">Updated hourly</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-foreground">
              <span className="text-blue-600">Trending</span> Now
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI-detected hot topics from across the web, explained visually
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-6 mb-10"
          >
            {/* Time Range */}
            <div className="flex bg-secondary/50 p-1 rounded-xl">
              {timeFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeRange(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === filter
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {filter === "Today" && <Clock className="w-3.5 h-3.5" />}
                    {filter}
                  </div>
                </button>
              ))}
            </div>

            {/* Sources */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <span className="text-sm text-muted-foreground mr-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Source:
              </span>
              {sourceFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSource(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${source === filter
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-background border-border text-muted-foreground hover:border-blue-200 hover:text-blue-600"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <span className="text-sm text-muted-foreground">
              Showing {topics.length} trending topics
            </span>
          </div>

          {/* Loading */}
          {isLoadingTopics ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Topics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topics.map((topic, index) => {
                  const catColor = categoryColors[topic.category] || "#64748b"; // default slate

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                    >
                      <Link to={`/topic/${topic.id}`}>
                        <div className="card-hover group overflow-hidden rounded-3xl border border-border/50 bg-card h-full flex flex-col shadow-sm hover:shadow-md transition-all">
                          {/* Card Header */}
                          <div
                            className="px-6 py-4 flex items-center justify-between border-b border-border/5"
                            style={{ backgroundColor: `${catColor}10` }}
                          >
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: catColor }}
                            >
                              {topic.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5" style={{ color: catColor }} />
                              <span className="text-sm font-bold" style={{ color: catColor }}>
                                {topic.trendScore}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                            {/* Difficulty */}
                            <div className="mb-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${difficultyColors[topic.difficulty] || ""}`}>
                                {topic.difficulty}
                              </span>
                            </div>

                            {/* Title & Summary */}
                            <h3 className="font-display text-lg font-bold mb-3 leading-snug group-hover:text-primary transition-colors">
                              {topic.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                              {topic.summary}
                            </p>

                            {/* Footer */}
                            <div className="pt-4 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                              {!!topic.hasInfographic && (
                                <div className="flex items-center gap-1.5">
                                  <BarChart3 className="w-4 h-4 text-muted-foreground/70" />
                                  <span>Infographic</span>
                                </div>
                              )}
                              {!!topic.hasArticle && (
                                <div className="flex items-center gap-1.5">
                                  <BookOpen className="w-4 h-4 text-muted-foreground/70" />
                                  <span>Article</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty State */}
              {topics.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">No trending topics found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or check back later</p>
                  <button
                    onClick={() => { setTimeRange("This Week"); setSource("All Sources"); }}
                    className="text-primary font-medium hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trending;
