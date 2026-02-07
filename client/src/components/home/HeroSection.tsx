import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BarChart3, Brain, BookOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const floatingCards = [
  { icon: BarChart3, label: "Infographics", color: "from-primary to-primary/60" },
  { icon: Brain, label: "AI Summaries", color: "from-accent to-accent/60" },
  { icon: BookOpen, label: "Deep Reads", color: "from-category-programming to-category-programming/60" },
  { icon: Zap, label: "Trending", color: "from-category-finance to-category-finance/60" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08)_0%,transparent_50%)]" />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            className={`absolute hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border/50 shadow-lg ${
              index === 0 ? "top-[20%] left-[8%]" :
              index === 1 ? "top-[30%] right-[10%]" :
              index === 2 ? "bottom-[35%] left-[5%]" :
              "bottom-[25%] right-[8%]"
            }`}
            style={{
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`
            }}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <card.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-medium text-sm">{card.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Now with AI-powered learning</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Learn Anything.
            <br />
            <span className="gradient-text">Visually. Faster. Smarter.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
          >
            Master complex topics through beautiful card summaries, AI-generated infographics, and in-depth articles. The smartest way to learn anything.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 px-8 h-12 text-base font-semibold"
            >
              <Link to="/explore">
                Explore Topics
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-12 text-base font-semibold border-2"
            >
              <Link to="/trending">
                <Play className="mr-2 w-4 h-4" />
                See Trending
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { value: "500+", label: "Topics" },
              { value: "50K+", label: "Learners" },
              { value: "1M+", label: "Cards Viewed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
