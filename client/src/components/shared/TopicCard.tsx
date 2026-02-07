import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Flame } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  hasInfographic: boolean;
  hasArticle: boolean;
  trendScore?: number;
}

interface TopicCardProps {
  topic: Topic;
  showTrendScore?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "AI & ML": { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
  "Programming": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
  "Tech": { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/20" },
  "Business": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
  "Finance": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
  "Science": { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" },
  "Trending": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20" },
};

const difficultyColors: Record<string, string> = {
  "Beginner": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Intermediate": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Advanced": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function TopicCard({ topic, showTrendScore }: TopicCardProps) {
  const categoryStyle = categoryColors[topic.category] || categoryColors["Tech"];

  return (
    <Link
      to={`/topic/${topic.id}`}
      className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full"
    >
      {/* Category Header Bar */}
      <div className={`px-4 py-3 ${categoryStyle.bg} border-b ${categoryStyle.border}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${categoryStyle.text}`}>
            {topic.category}
          </span>
          {showTrendScore && topic.trendScore && (
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Flame className="w-3.5 h-3.5" />
              {topic.trendScore}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col h-[calc(100%-52px)]">
        {/* Difficulty Badge */}
        <div className="mb-3">
          <Badge variant="secondary" className={`${difficultyColors[topic.difficulty]} font-medium text-xs`}>
            {topic.difficulty}
          </Badge>
        </div>

        {/* Title & Summary */}
        <h3 className="font-display font-semibold text-base md:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {topic.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 flex-grow">
          {topic.summary}
        </p>

        {/* Content Type Indicators */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
          {topic.hasInfographic && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Infographic</span>
            </div>
          )}
          {topic.hasArticle && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>Article</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
