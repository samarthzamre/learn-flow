import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Code, Cpu, TrendingUp, Briefcase, Atom, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomepage, type CategoryItem } from "@/lib/api";

// Icon mapping from string name to component
const iconMap: Record<string, React.ElementType> = {
  Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame,
};

export const CategoriesSection = () => {
  const { data: homepage } = useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepage,
  });

  // Sort by topic count (descending) and take top 8
  const categories: CategoryItem[] = (homepage?.categories || [])
    .sort((a, b) => b.topicCount - a.topicCount)
    .slice(0, 8);

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Explore by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dive into any field and master it with our visual learning approach.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] || Cpu;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link to={`/explore?category=${cat.slug}`} className="block h-full">
                  <div className="card-hover group rounded-2xl border border-border/50 bg-card p-6 h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col h-full items-start text-left">
                      <div
                        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="font-display text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {cat.description}
                      </p>

                      <span
                        className="text-sm font-semibold"
                        style={{ color: cat.color }}
                      >
                        {cat.topicCount} topics
                      </span>
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
