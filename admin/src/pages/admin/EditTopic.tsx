import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Loader2,
    Plus,
    Trash2,
    GripVertical,
    Layout,
    FileText,
    List,
    Image as ImageIcon,
    Upload,
    X,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTopic, createTopic, updateTopic, uploadImage, getCategories, type TopicDetail } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const EditTopic = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch Topic Data
    const { data: topic, isLoading, error } = useQuery({
        queryKey: ["admin-topic", id],
        queryFn: () => getTopic(Number(id)),
        enabled: isEditMode,
    });

    // Fetch categories dynamically
    const { data: categories = [] } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: getCategories,
    });

    // Form State
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState<Partial<TopicDetail>>({
        title: "",
        summary: "",
        category_id: 1,
        difficulty: "Beginner",
        status: "Draft",
        trend_score: 0,
        is_trending: false,
        source: "All Sources",
        has_infographic: false,
        has_article: false,
    });

    // Structured Data State
    const [sidebarContent, setSidebarContent] = useState<{
        key_terms: string[];
        real_world_uses: string[];
        common_mistakes: string[];
    }>({
        key_terms: [],
        real_world_uses: [],
        common_mistakes: []
    });

    const [cards, setCards] = useState<{ title: string; content: string }[]>([]);
    const [articleText, setArticleText] = useState("");
    const [infographicImageUrl, setInfographicImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

    // Initialize Data
    useEffect(() => {
        if (isEditMode && topic) {
            setFormData({
                title: topic.title,
                summary: topic.summary,
                category_id: topic.category_id,
                difficulty: topic.difficulty,
                status: topic.status,
                trend_score: topic.trend_score,
                is_trending: topic.is_trending,
                source: topic.source,
                has_infographic: topic.has_infographic,
                has_article: topic.has_article,
                infographic_image_url: topic.infographic_image_url,
            });

            try {
                const sidebar = topic.sidebar_content
                    ? (typeof topic.sidebar_content === 'string' ? JSON.parse(topic.sidebar_content) : topic.sidebar_content)
                    : {};

                setSidebarContent({
                    key_terms: sidebar.key_terms || [],
                    real_world_uses: sidebar.real_world_uses || [],
                    common_mistakes: sidebar.common_mistakes || []
                });
            } catch (e) {
                console.error("Failed to parse sidebar content", e);
            }

            setCards(topic.cards || []);
            setInfographicImageUrl(topic.infographic_image_url || null);

            // Convert HTML article content to plain text for editing
            const rawArticle = topic.article?.content || "";
            // Strip HTML tags to plain text
            const plainText = rawArticle
                .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
                .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
                .replace(/<\/p>\s*<p>/gi, '\n\n')
                .replace(/<p[^>]*>/gi, '')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
            setArticleText(plainText);
        }
    }, [topic, isEditMode]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (isEditMode) {
                return updateTopic(Number(id), data);
            } else {
                return createTopic(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-topic"] });
            queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
            toast({ title: "Success", description: `Topic ${isEditMode ? 'updated' : 'created'} successfully` });
            navigate("/admin/topics");
        },
        onError: (err: any) => {
            toast({ title: "Error", description: err.message || `Failed to ${isEditMode ? 'update' : 'create'} topic`, variant: "destructive" });
        },
    });

    const handleSubmit = () => {
        // Format article content: convert plain text with ## headings to HTML
        let formattedArticle = articleText;
        if (articleText.trim() && !articleText.trim().startsWith("<")) {
            formattedArticle = articleText
                .split("\n\n")
                .map(block => {
                    block = block.trim();
                    if (!block) return "";
                    if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;
                    if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
                    return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
                })
                .filter(Boolean)
                .join("");
        }

        mutation.mutate({
            ...formData,
            sidebar_content: sidebarContent,
            cards: cards,
            articleContent: formattedArticle,
            infographic_image_url: infographicImageUrl,
        });
    };

    // Helper to manage lists
    const addListItem = (key: keyof typeof sidebarContent) => {
        setSidebarContent(prev => ({
            ...prev,
            [key]: [...prev[key], ""]
        }));
    };

    const updateListItem = (key: keyof typeof sidebarContent, index: number, value: string) => {
        setSidebarContent(prev => ({
            ...prev,
            [key]: prev[key].map((item, i) => i === index ? value : item)
        }));
    };

    const removeListItem = (key: keyof typeof sidebarContent, index: number) => {
        setSidebarContent(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
    };

    if (isEditMode && isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            setInfographicImageUrl(result.url);
            toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Upload failed", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info", icon: Layout },
        { id: "sidebar", label: "Sidebar Content", icon: List },
        { id: "cards", label: "Flash Cards", icon: ImageIcon },
        { id: "infographics", label: "Infographics", icon: Upload },
        { id: "article", label: "Article", icon: FileText },
    ];

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/topics")}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-display font-bold">
                                {isEditMode ? `Edit: ${topic?.title}` : "Create New Topic"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Fill in the details to create a comprehensive learning topic
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={mutation.isPending} className="gap-2">
                        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Topic
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Basic Info Tab */}
                        {activeTab === "basic" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Core Information</CardTitle>
                                        <CardDescription>The main details that appear on the topic card</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                value={formData.title || ""}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g., Introduction to Neural Networks"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Summary</label>
                                            <Textarea
                                                value={formData.summary || ""}
                                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                                placeholder="Brief description of the topic..."
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Difficulty</label>
                                                <Select
                                                    value={formData.difficulty}
                                                    onValueChange={(v: any) => setFormData({ ...formData, difficulty: v })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Status</label>
                                                <Select
                                                    value={formData.status}
                                                    onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Draft">Draft</SelectItem>
                                                        <SelectItem value="Published">Published</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Topic Category</label>
                                                <Select
                                                    value={String(formData.category_id)}
                                                    onValueChange={(v) => setFormData({ ...formData, category_id: Number(v) })}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Source</label>
                                                <Select
                                                    value={formData.source}
                                                    onValueChange={(v: any) => setFormData({ ...formData, source: v })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="All Sources">All Sources</SelectItem>
                                                        <SelectItem value="Google">Google</SelectItem>
                                                        <SelectItem value="GitHub">GitHub</SelectItem>
                                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                                        <SelectItem value="News">News</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <label className="text-sm font-medium">Show in Trending</label>
                                                    <p className="text-xs text-muted-foreground">Force this topic to appear in trending</p>
                                                </div>
                                                <Switch
                                                    checked={formData.is_trending}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, is_trending: checked })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Sidebar Content Tab */}
                        {activeTab === "sidebar" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Key Terms */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-semibold">Key Terms</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => addListItem("key_terms")}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        {sidebarContent.key_terms.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">No key terms added</p>
                                        )}
                                        {sidebarContent.key_terms.map((term, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={term}
                                                    onChange={(e) => updateListItem("key_terms", idx, e.target.value)}
                                                    placeholder="Term"
                                                />
                                                <Button size="icon" variant="ghost" onClick={() => removeListItem("key_terms", idx)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Real World Uses */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-semibold">Real World Uses</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => addListItem("real_world_uses")}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        {sidebarContent.real_world_uses.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">No uses added</p>
                                        )}
                                        {sidebarContent.real_world_uses.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => updateListItem("real_world_uses", idx, e.target.value)}
                                                    placeholder="Use case"
                                                />
                                                <Button size="icon" variant="ghost" onClick={() => removeListItem("real_world_uses", idx)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Common Mistakes */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-semibold">Common Mistakes</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => addListItem("common_mistakes")}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        {sidebarContent.common_mistakes.length === 0 && (
                                            <p className="text-sm text-muted-foreground italic">No mistakes added</p>
                                        )}
                                        {sidebarContent.common_mistakes.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => updateListItem("common_mistakes", idx, e.target.value)}
                                                    placeholder="Mistake"
                                                />
                                                <Button size="icon" variant="ghost" onClick={() => removeListItem("common_mistakes", idx)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Cards Tab */}
                        {activeTab === "cards" && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <Button onClick={() => setCards([...cards, { title: "", content: "" }])}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Card
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {cards.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                            <p className="text-muted-foreground">No flash cards created yet</p>
                                        </div>
                                    )}
                                    {cards.map((card, idx) => (
                                        <Card key={idx}>
                                            <CardContent className="p-4 flex gap-4">
                                                <div className="mt-2 text-muted-foreground">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        value={card.title}
                                                        onChange={(e) => {
                                                            const newCards = [...cards];
                                                            newCards[idx].title = e.target.value;
                                                            setCards(newCards);
                                                        }}
                                                        placeholder="Card Title"
                                                        className="font-semibold"
                                                    />
                                                    <Textarea
                                                        value={card.content}
                                                        onChange={(e) => {
                                                            const newCards = [...cards];
                                                            newCards[idx].content = e.target.value;
                                                            setCards(newCards);
                                                        }}
                                                        placeholder="Card Content"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setCards(cards.filter((_, i) => i !== idx))}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Infographics Tab */}
                        {activeTab === "infographics" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Infographic Image</CardTitle>
                                    <CardDescription>
                                        Upload an infographic image for this topic. Supported formats: PNG, JPG, WebP (max 10MB).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {infographicImageUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={infographicImageUrl.startsWith("http") ? infographicImageUrl : `${SERVER_URL}${infographicImageUrl}`}
                                                alt="Infographic"
                                                className="rounded-xl border border-border w-full max-h-[600px] object-contain bg-secondary/30"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setInfographicImageUrl(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-2 text-center">Hover over the image and click ✕ to remove</p>
                                        </div>
                                    ) : (
                                        <label
                                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-16 px-6 cursor-pointer transition-colors ${isUploading ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-secondary/50"
                                                }`}
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type.startsWith("image/")) handleImageUpload(file);
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file);
                                                }}
                                            />
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                                                    <p className="text-sm font-medium">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                                        <Upload className="w-7 h-7 text-primary" />
                                                    </div>
                                                    <p className="font-medium mb-1">Click to upload or drag and drop</p>
                                                    <p className="text-sm text-muted-foreground">PNG, JPG or WebP up to 10MB</p>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Article Tab */}
                        {activeTab === "article" && (
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Article Content</CardTitle>
                                    <CardDescription>
                                        Write your article in plain text. Use <strong>## Heading</strong> for section titles and <strong>### Subheading</strong> for subsections.
                                        Separate paragraphs with a blank line. We'll handle all the formatting automatically.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={articleText}
                                        onChange={(e) => setArticleText(e.target.value)}
                                        className="min-h-[500px] font-mono text-base leading-relaxed"
                                        placeholder={"## The Rise of Large Language Models\n\nLarge Language Models (LLMs) represent a significant leap in artificial intelligence.\n\n### What makes them different?\n\nUnlike previous AI models, LLMs are capable of zero-shot learning.\n\n### The Transformer Architecture\n\nIntroduced in 2017, the Transformer architecture allows models to process data in parallel."}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
};

export default EditTopic;
