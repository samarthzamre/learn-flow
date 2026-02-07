import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Cpu, 
  Code, 
  Brain, 
  Briefcase, 
  TrendingUp, 
  Atom,
  Flame
} from "lucide-react";

const categories = [
  {
    id: "tech",
    name: "Tech",
    description: "Latest in technology",
    icon: Cpu,
    topicCount: 85,
    color: "category-tech",
    gradient: "from-[hsl(var(--category-tech))] to-[hsl(var(--category-tech)/0.6)]",
  },
  {
    id: "programming",
    name: "Programming",
    description: "Languages & frameworks",
    icon: Code,
    topicCount: 120,
    color: "category-programming",
    gradient: "from-[hsl(var(--category-programming))] to-[hsl(var(--category-programming)/0.6)]",
  },
  {
    id: "ai-ml",
    name: "AI & ML",
    description: "Machine learning & AI",
    icon: Brain,
    topicCount: 64,
    color: "category-ai",
    gradient: "from-[hsl(var(--category-ai))] to-[hsl(var(--category-ai)/0.6)]",
  },
  {
    id: "business",
    name: "Business",
    description: "Strategy & growth",
    icon: Briefcase,
    topicCount: 78,
    color: "category-business",
    gradient: "from-[hsl(var(--category-business))] to-[hsl(var(--category-business)/0.6)]",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Markets & investing",
    icon: TrendingUp,
    topicCount: 56,
    color: "category-finance",
    gradient: "from-[hsl(var(--category-finance))] to-[hsl(var(--category-finance)/0.6)]",
  },
  {
    id: "science",
    name: "Science",
    description: "Research & discovery",
    icon: Atom,
    topicCount: 92,
    color: "category-science",
    gradient: "from-[hsl(var(--category-science))] to-[hsl(var(--category-science)/0.6)]",
  },
  {
    id: "trending",
    name: "Trending",
    description: "What's hot now",
    icon: Flame,
    topicCount: 45,
    color: "category-trending",
    gradient: "from-[hsl(var(--category-trending))] to-[hsl(var(--category-trending)/0.6)]",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Dive into any field and master it with our visual learning approach.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                to={`/explore?category=${category.id}`}
                className="group block bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                <span className="text-xs font-medium text-primary">{category.topicCount} topics</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
