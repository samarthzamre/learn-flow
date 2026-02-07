import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopicCard } from "@/components/shared/TopicCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Calendar } from "lucide-react";

const timeFilters = ["Today", "This Week", "This Month"];

const sourceFilters = ["All Sources", "Google", "GitHub", "Twitter", "News"];

// Topics with dates for filtering
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
    source: "Google",
    daysAgo: 0, // Today
  },
  {
    id: "2",
    title: "React 19 Features",
    summary: "Everything new in the latest React version",
    category: "Programming",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 95,
    source: "GitHub",
    daysAgo: 1, // Today
  },
  {
    id: "3",
    title: "Generative AI in Business",
    summary: "How enterprises are adopting AI tools",
    category: "Business",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 92,
    source: "News",
    daysAgo: 3, // This Week
  },
  {
    id: "4",
    title: "Quantum Computing Breakthrough",
    summary: "Latest advances in quantum supremacy",
    category: "Science",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 89,
    source: "News",
    daysAgo: 5, // This Week
  },
  {
    id: "5",
    title: "TypeScript 5.3 Updates",
    summary: "New features and performance improvements",
    category: "Programming",
    difficulty: "Intermediate",
    hasInfographic: false,
    hasArticle: true,
    trendScore: 86,
    source: "GitHub",
    daysAgo: 10, // This Month
  },
  {
    id: "6",
    title: "AI-Powered Code Editors",
    summary: "Comparing Cursor, Copilot, and alternatives",
    category: "Tech",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 84,
    source: "Twitter",
    daysAgo: 0, // Today
  },
  {
    id: "7",
    title: "Startup Layoffs 2024",
    summary: "Tech industry restructuring trends",
    category: "Business",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 81,
    source: "News",
    daysAgo: 15, // This Month
  },
  {
    id: "8",
    title: "Edge Computing Growth",
    summary: "Why edge is becoming critical for AI",
    category: "Tech",
    difficulty: "Intermediate",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 78,
    source: "Google",
    daysAgo: 20, // This Month
  },
  {
    id: "9",
    title: "WebAssembly Revolution",
    summary: "Running any language in the browser",
    category: "Programming",
    difficulty: "Advanced",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 76,
    source: "GitHub",
    daysAgo: 2, // This Week
  },
  {
    id: "10",
    title: "Sustainable Tech Innovations",
    summary: "Green computing and energy efficiency",
    category: "Science",
    difficulty: "Beginner",
    hasInfographic: true,
    hasArticle: true,
    trendScore: 74,
    source: "News",
    daysAgo: 25, // This Month
  },
];

const Trending = () => {
  const [selectedTime, setSelectedTime] = useState("This Week");
  const [selectedSource, setSelectedSource] = useState("All Sources");

  const filteredTopics = useMemo(() => {
    return trendingTopics.filter((topic) => {
      // Time filter
      let matchesTime = true;
      if (selectedTime === "Today") {
        matchesTime = topic.daysAgo <= 1;
      } else if (selectedTime === "This Week") {
        matchesTime = topic.daysAgo <= 7;
      } else if (selectedTime === "This Month") {
        matchesTime = topic.daysAgo <= 30;
      }

      // Source filter
      const matchesSource = selectedSource === "All Sources" || topic.source === selectedSource;

      return matchesTime && matchesSource;
    });
  }, [selectedTime, selectedSource]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Updated hourly</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
              <span className="gradient-text">Trending</span> Now
            </h1>
            <p className="text-muted-foreground text-base md:text-lg px-4">
              AI-detected hot topics from across the web, explained visually
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4 mb-8"
          >
            {/* Time Filter */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1 p-1 bg-secondary rounded-xl">
                {timeFilters.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="rounded-lg text-xs sm:text-sm px-3 sm:px-4"
                  >
                    {time === "Today" && <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <TrendingUp className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Source:</span>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {sourceFilters.map((source) => (
                  <Badge
                    key={source}
                    variant={selectedSource === source ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 text-xs px-2 py-1"
                    onClick={() => setSelectedSource(source)}
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground text-sm mb-6"
          >
            Showing {filteredTopics.length} trending {filteredTopics.length === 1 ? 'topic' : 'topics'}
          </motion.p>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <TopicCard topic={topic} showTrendScore />
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
                <Flame className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No topics found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters
              </p>
              <Button onClick={() => {
                setSelectedTime("This Week");
                setSelectedSource("All Sources");
              }}>
                Reset Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trending;
