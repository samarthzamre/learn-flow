import { motion } from "framer-motion";
import { BarChart3, Brain, BookOpen, Zap, Layers, Target } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Visual Infographics",
    description: "Complex concepts broken down into stunning, shareable infographics you'll actually remember.",
    color: "from-primary to-primary/60",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "Condensed Concepts",
    description: "Smart summaries that extract the essence of any topic in digestible card format.",
    color: "from-accent to-accent/60",
    bgColor: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "Deep Dive Articles",
    description: "When you need more, access comprehensive articles with examples and real-world applications.",
    color: "from-category-programming to-category-programming/60",
    bgColor: "bg-category-programming/10",
  },
  {
    icon: Zap,
    title: "Trending Topics",
    description: "Stay ahead with curated trending topics from tech, business, and beyond.",
    color: "from-category-trending to-category-trending/60",
    bgColor: "bg-category-trending/10",
  },
  {
    icon: Layers,
    title: "Learning Paths",
    description: "Follow curated sequences from beginner to expert on any subject matter.",
    color: "from-category-finance to-category-finance/60",
    bgColor: "bg-category-finance/10",
  },
  {
    icon: Target,
    title: "Track Progress",
    description: "Bookmark, save, and track your learning journey across all topics.",
    color: "from-category-science to-category-science/60",
    bgColor: "bg-category-science/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Learn the way your brain <span className="gradient-text">actually works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We combine visual learning, smart summaries, and deep content to create the ultimate learning experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
