import { useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Search,
    TrendingUp,
    Copy,
    Check,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";

const sampleTrendingTopics = [
    { title: "GPT-5 Rumors and Expectations", score: 95, source: "Twitter", category: "AI & ML" },
    { title: "React 19 Server Actions", score: 92, source: "GitHub", category: "Programming" },
    { title: "Apple Vision Pro Reviews", score: 88, source: "News", category: "Tech" },
    { title: "Fed Interest Rate Decision", score: 85, source: "News", category: "Finance" },
    { title: "CRISPR Cancer Treatment", score: 82, source: "Google", category: "Science" },
];

const AdminResearch = () => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleResearch = () => {
        if (!prompt.trim()) {
            toast.error("Please enter a research prompt");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Research completed! Found 5 trending topics.");
        }, 2000);
    };

    const handleCopy = (title: string) => {
        navigator.clipboard.writeText(title);
        setCopiedId(title);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreateTopic = (title: string) => {
        toast.success(`Creating topic: "${title}"`);
    };

    return (
        <AdminLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h1 className="font-display text-2xl md:text-3xl font-bold">Topic Research</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Discover trending topics and generate content ideas
                    </p>
                </div>

                {/* Research Prompt */}
                <Card className="mb-6 md:mb-8">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Research Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Example: Find trending educational and tech topics related to Web Development and Business for this week. Provide reasons and popularity score."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="mb-4 resize-none"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={handleResearch}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                {isLoading ? "Researching..." : "Start Research"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPrompt("Find trending things today across all categories including AI & ML, Programming, Data Science, Business, and Technology. Collect top news, breakthroughs, and popular discussions. Provide popularity scores and sources.")}
                                className="gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Find Trending Things Today
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Trending Results */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Trending Topics
                            </CardTitle>
                            <Badge variant="secondary">Live Data</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sampleTrendingTopics.map((topic, index) => (
                                <motion.div
                                    key={topic.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold">{topic.score}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{topic.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{topic.source}</span>
                                                <span>•</span>
                                                <span>{topic.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(topic.title)}
                                            className="gap-2"
                                        >
                                            {copiedId === topic.title ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                            <span className="hidden sm:inline">Copy</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleCreateTopic(topic.title)}
                                        >
                                            Create Topic
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AdminLayout>
    );
};

export default AdminResearch;
