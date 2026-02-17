import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  BarChart3,
  Share2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Move
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { getTopic } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

const InteractiveImage = ({ src, alt }: { src: string; alt: string }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, scale + delta), 4);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale(s => Math.max(0.5, s - 0.5));

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 cursor-grab active:cursor-grabbing touch-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out origin-center will-change-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <Button size="icon" variant="secondary" onClick={zoomOut} className="h-8 w-8 rounded-lg shadow-lg bg-background/80 backdrop-blur-sm border border-border">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="h-8 md:min-w-[60px] flex items-center justify-center px-2 rounded-lg shadow-lg bg-background/80 backdrop-blur-sm border border-border text-xs font-mono">
          {Math.round(scale * 100)}%
        </div>
        <Button size="icon" variant="secondary" onClick={zoomIn} className="h-8 w-8 rounded-lg shadow-lg bg-background/80 backdrop-blur-sm border border-border">
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 pointer-events-none opacity-50 bg-background/50 backdrop-blur px-2 py-1 rounded text-xs">
        Scroll to Zoom • Drag to Pan
      </div>
    </div>
  );
};

const TopicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"cards" | "infographic" | "article">("cards");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Topic link copied to clipboard." });
  };



  const { data: topic, isLoading, error } = useQuery({
    queryKey: ["client-topic", id],
    queryFn: () => getTopic(id!),
    enabled: !!id,
  });

  const sidebarContent = useMemo(() => {
    if (!topic?.sidebar_content) return null;
    try {
      if (typeof topic.sidebar_content === 'object') {
        return topic.sidebar_content;
      }
      return JSON.parse(topic.sidebar_content as string);
    } catch (e) {
      console.error("Failed to parse sidebar content", e);
      return null;
    }
  }, [topic?.sidebar_content]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-40 px-4">
          <h2 className="font-display text-2xl font-bold mb-2">Topic Not Found</h2>
          <Link to="/explore" className="text-primary hover:underline">Back to Explore</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cards = topic?.cards || [];
  const safeCurrentCardIndex = Math.min(currentCardIndex, Math.max(0, cards.length - 1));
  const progress = cards.length > 0 ? ((safeCurrentCardIndex + 1) / cards.length) * 100 : 0;

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner Section */}
      <div className="relative pt-24 pb-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-background/90 dark:from-blue-950/20 dark:to-background"></div>
          {/* Abstract Pattern */}
          <div className="absolute top-0 left-0 w-full h-[500px] opacity-10 dark:opacity-5 bg-[url('https://images.unsplash.com/photo-1620641788421-7f1c9ddde591?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Link to="/explore" className="inline-flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full text-sm font-medium hover:bg-background/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                {topic.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${difficultyColors[topic.difficulty]}`}>
                {topic.difficulty}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {topic.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {topic.summary}
            </p>
          </div>
        </div>
      </div>

      <main className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex p-1 bg-muted/50 rounded-full border border-border/50">
              {[
                { id: "cards", label: "Cards", icon: BookOpen },
                { id: "infographic", label: "Infographic", icon: BarChart3 },
                { id: "article", label: "Article", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleShare}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            {/* Main Content Area */}
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {activeTab === "cards" && cards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Step {safeCurrentCardIndex + 1} of {cards.length}</span>
                      <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Card Content */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 min-h-[280px] flex flex-col justify-center relative shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6">
                        <Lightbulb className="w-8 h-8" />
                      </div>

                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                        {cards[safeCurrentCardIndex]?.title || "Untitled Card"}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {cards[safeCurrentCardIndex]?.content || "No content available."}
                      </p>

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                        <Button
                          variant="ghost"
                          onClick={handlePrevCard}
                          disabled={safeCurrentCardIndex === 0}
                          className="gap-2 text-muted-foreground"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>

                        <div className="flex gap-2">
                          {cards.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === safeCurrentCardIndex ? "bg-primary" : "bg-secondary"
                                }`}
                            />
                          ))}
                        </div>

                        <Button
                          onClick={handleNextCard}
                          disabled={safeCurrentCardIndex === cards.length - 1}
                          className="gap-2 rounded-xl px-6"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "cards" && cards.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 bg-card border border-border/50 rounded-3xl text-center">
                    <p className="text-muted-foreground">No flashcards available for this topic.</p>
                  </div>
                )}

                {activeTab === "infographic" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-card border border-border/50 rounded-3xl p-1 overflow-hidden h-[600px] relative group"
                  >
                    {topic.infographic_image_url ? (
                      <div className="w-full h-full relative overflow-hidden bg-secondary/20 rounded-2xl">
                        <InteractiveImage src={topic.infographic_image_url} alt={topic.title} />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                        <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                        <p>No infographic available for this topic.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "article" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 md:p-12"
                  >
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: topic.articleContent }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {sidebarContent && (
                <>
                  {/* Key Terms */}
                  {sidebarContent?.key_terms && Array.isArray(sidebarContent.key_terms) && (
                    <div className="bg-card border border-border/50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold">Key Terms</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sidebarContent.key_terms.map((term: string) => (
                          <span key={term} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real World Uses */}
                  {sidebarContent?.real_world_uses && Array.isArray(sidebarContent.real_world_uses) && (
                    <div className="bg-card border border-border/50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold">Real-World Uses</h3>
                      </div>
                      <ul className="space-y-3">
                        {sidebarContent.real_world_uses.map((use: string) => (
                          <li key={use} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {sidebarContent?.common_mistakes && Array.isArray(sidebarContent.common_mistakes) && (
                    <div className="bg-card border border-border/50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <h3 className="font-semibold">Common Mistakes</h3>
                      </div>
                      <ul className="space-y-3">
                        {sidebarContent.common_mistakes.map((mistake: string) => (
                          <li key={mistake} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopicDetail;
