import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Layers,
  Image,
  FileText,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Check,
  Download,
  ZoomIn,
} from "lucide-react";

// Mock data - in real app this would come from API
const topicData = {
  id: "1",
  title: "Large Language Models",
  summary: "How GPT, Claude and other LLMs are reshaping AI and transforming the way we interact with technology",
  category: "AI & ML",
  difficulty: "Intermediate",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format",
  cards: [
    {
      id: 1,
      title: "What are LLMs?",
      content: "Large Language Models are AI systems trained on massive text datasets. They learn patterns in language to understand and generate human-like text. Think of them as super-smart autocomplete that can write essays, code, and even poetry.",
      icon: Lightbulb,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "How Do They Learn?",
      content: "LLMs are trained by reading billions of web pages, books, and articles. They predict what word comes next, over and over, billions of times. This helps them understand context, grammar, facts, and even reasoning patterns.",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      title: "Popular Examples",
      content: "ChatGPT and GPT-4 by OpenAI are the most famous. Claude by Anthropic focuses on being helpful and safe. Google's Gemini and Meta's LLaMA are other major players. Each has unique strengths and use cases.",
      icon: Layers,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      title: "Watch Out For",
      content: "LLMs can 'hallucinate' - confidently stating false information. They have knowledge cutoff dates and can't access real-time data. Always verify important facts and don't rely on them for critical decisions alone.",
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      title: "Real-World Uses",
      content: "Content writing and editing, code generation and debugging, customer service chatbots, language translation, research assistance, and creative brainstorming are just the beginning of what LLMs can do today.",
      icon: CheckCircle2,
      color: "from-indigo-500 to-blue-500",
    },
  ],
  keyTerms: ["Transformer", "Token", "Parameters", "Fine-tuning", "Prompt Engineering"],
  useCases: ["Chatbots & Virtual Assistants", "Code Generation Tools", "Content Creation", "Research & Analysis"],
  commonMistakes: [
    "Trusting outputs without fact-checking",
    "Ignoring context window limits", 
    "Not understanding token costs",
    "Over-relying on single responses"
  ],
  infographic: {
    title: "How Large Language Models Work",
    sections: [
      {
        title: "1. Training Data",
        description: "LLMs learn from billions of text examples from books, websites, and documents.",
        stat: "175B+ parameters",
      },
      {
        title: "2. Transformer Architecture",
        description: "Uses attention mechanisms to understand relationships between words in context.",
        stat: "96 attention layers",
      },
      {
        title: "3. Token Prediction",
        description: "Predicts the most likely next word based on all previous context.",
        stat: "32K token context",
      },
      {
        title: "4. Fine-Tuning",
        description: "Models are refined with human feedback to improve helpfulness and safety.",
        stat: "RLHF trained",
      },
    ],
    keyStats: [
      { label: "Training Cost", value: "$100M+" },
      { label: "Parameters", value: "175B-1.8T" },
      { label: "Context Window", value: "4K-200K" },
      { label: "Languages", value: "100+" },
    ],
  },
};

const TopicDetail = () => {
  const { id } = useParams();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"cards" | "infographic" | "article">("cards");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentCard = topicData.cards[activeCardIndex];
  const progress = ((activeCardIndex + 1) / topicData.cards.length) * 100;

  const nextCard = () => {
    if (activeCardIndex < topicData.cards.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
    }
  };

  const prevCard = () => {
    if (activeCardIndex > 0) {
      setActiveCardIndex((prev) => prev - 1);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks", {
      description: isBookmarked ? "Topic removed from your saved list" : "You can find this in your bookmarks",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: topicData.title,
      text: topicData.summary,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!", {
          description: "Share this topic with others",
        });
      }
    } catch (err) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", {
        description: "Share this topic with others",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={topicData.image}
            alt={topicData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button asChild variant="secondary" size="sm" className="rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white">
              <Link to="/explore">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          {/* Topic Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                {topicData.category}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                {topicData.difficulty}
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {topicData.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              {topicData.summary}
            </p>
          </motion.div>

          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card rounded-2xl border border-border"
          >
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-lg"
              >
                <Layers className="w-4 h-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === "infographic" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("infographic")}
                className="rounded-lg"
              >
                <Image className="w-4 h-4 mr-2" />
                Infographic
              </Button>
              <Button
                variant={viewMode === "article" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("article")}
                className="rounded-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Article
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={handleBookmark}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {viewMode === "cards" && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">
                          Step {activeCardIndex + 1} of {topicData.cards.length}
                        </span>
                        <span className="font-semibold text-primary">{Math.round(progress)}% complete</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Card Display */}
                    <div className="relative bg-card rounded-2xl border border-border overflow-hidden min-h-[420px] flex flex-col">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentCard.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="flex-1 flex flex-col p-8"
                        >
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCard.color} flex items-center justify-center mb-6 shadow-lg`}>
                            <currentCard.icon className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                            {currentCard.title}
                          </h2>
                          <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                            {currentCard.content}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation */}
                      <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/30">
                        <Button
                          variant="outline"
                          onClick={prevCard}
                          disabled={activeCardIndex === 0}
                          className="rounded-xl"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-2">
                          {topicData.cards.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveCardIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === activeCardIndex
                                  ? "bg-primary scale-110"
                                  : index < activeCardIndex
                                  ? "bg-primary/40"
                                  : "bg-border hover:bg-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <Button
                          onClick={nextCard}
                          disabled={activeCardIndex === topicData.cards.length - 1}
                          className="rounded-xl"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {viewMode === "infographic" && (
                  <motion.div
                    key="infographic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    {/* Infographic Header */}
                    <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-xl font-bold mb-1">{topicData.infographic.title}</h3>
                          <p className="text-muted-foreground text-sm">Visual breakdown of key concepts</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <ZoomIn className="w-4 h-4 mr-2" />
                            Zoom
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-border">
                      {topicData.infographic.keyStats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-4 rounded-xl bg-secondary/50"
                        >
                          <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                          <p className="text-muted-foreground text-sm">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Process Flow */}
                    <div className="p-6">
                      <h4 className="font-display font-semibold text-lg mb-6">The LLM Pipeline</h4>
                      <div className="space-y-4">
                        {topicData.infographic.sections.map((section, index) => (
                          <motion.div
                            key={section.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex gap-4 p-4 rounded-xl bg-secondary/30 border border-border"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 text-primary-foreground font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-semibold">{section.title}</h5>
                                <Badge variant="secondary" className="text-xs">{section.stat}</Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">{section.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {viewMode === "article" && (
                  <motion.div
                    key="article"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card rounded-2xl border border-border p-8"
                  >
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                      <h2 className="font-display">Understanding Large Language Models</h2>
                      <p className="lead text-lg text-muted-foreground">
                        Large Language Models (LLMs) represent one of the most significant advances in artificial intelligence. They enable machines to understand and generate human-like text with unprecedented accuracy.
                      </p>
                      
                      <h3 className="font-display">What Makes LLMs Special?</h3>
                      <p>
                        Unlike traditional rule-based systems, LLMs learn patterns from massive datasets containing billions of words from books, websites, and other text sources. This training allows them to capture nuanced relationships between words, concepts, and ideas.
                      </p>
                      
                      <h3 className="font-display">The Transformer Architecture</h3>
                      <p>
                        At the heart of modern LLMs is the Transformer architecture, introduced in 2017. This architecture uses a mechanism called "attention" that allows the model to focus on relevant parts of the input when generating each word of output.
                      </p>
                      
                      <h3 className="font-display">Applications and Impact</h3>
                      <p>
                        LLMs are revolutionizing industries from customer service to software development. They power chatbots, writing assistants, code generators, and research tools, making expert-level capabilities accessible to everyone.
                      </p>

                      <h3 className="font-display">Best Practices for Using LLMs</h3>
                      <ul>
                        <li>Always verify important facts and claims</li>
                        <li>Provide clear, specific prompts for better results</li>
                        <li>Understand the model's limitations and knowledge cutoffs</li>
                        <li>Use them as tools to augment, not replace, human judgment</li>
                      </ul>
                    </article>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Terms */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  Key Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topicData.keyTerms.map((term) => (
                    <Badge key={term} variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">
                      {term}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Use Cases */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  Real-World Uses
                </h3>
                <ul className="space-y-3">
                  {topicData.useCases.map((useCase) => (
                    <li key={useCase} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Common Mistakes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  Common Mistakes
                </h3>
                <ul className="space-y-3">
                  {topicData.commonMistakes.map((mistake) => (
                    <li key={mistake} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <span className="text-muted-foreground">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopicDetail;
