import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Flame, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomepage, type TopicItem } from "@/lib/api";
import { useMemo } from "react";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

export const TrendingSection = () => {
  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepage,
  });

  const topics: TopicItem[] = homepage?.trendingTopics || [];

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
    <section className="py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-blue-500" />
              <span className="text-base font-semibold text-blue-500">Hot Right Now</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Trending Topics
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/trending">
              <button className="group flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, index) => {
            const catColor = categoryColors[topic.category] || "#64748b"; // default slate

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                          {topic.views || 0}
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
      </div>
    </section>
  );
};
