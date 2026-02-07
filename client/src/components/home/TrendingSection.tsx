import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TopicCard } from "@/components/shared/TopicCard";

const trendingTopics = [
  {
    id: "1",
    title: "Large Language Models",
    summary: "How GPT, Claude and other LLMs are reshaping AI",
    category: "AI & ML",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 98,
  },
  {
    id: "2",
    title: "React Server Components",
    summary: "The future of React rendering explained",
    category: "Programming",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 92,
  },
  {
    id: "3",
    title: "Quantum Computing Basics",
    summary: "Understanding qubits, superposition, and entanglement",
    category: "Science",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: false,
    trendScore: 87,
  },
  {
    id: "4",
    title: "Startup Fundraising",
    summary: "From seed to Series A: A complete guide",
    category: "Business",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 85,
  },
];

export function TrendingSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm">Hot Right Now</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Trending Topics
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/trending">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Trending Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TopicCard topic={topic} showTrendScore />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
