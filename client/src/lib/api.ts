const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/client";

async function request<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
    }
    return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────
export interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    topicCount: number;
}

export interface TopicItem {
    id: number;
    title: string;
    summary: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    hasInfographic: boolean;
    hasArticle: boolean;
    trendScore: number;
    views?: number;
    created_at?: string;
}

export interface TopicDetailData extends TopicItem {
    categorySlug: string;
    cards: { id: number; title: string; content: string }[];
    infographicItems: { id: number; title: string; stat: string; description: string }[];
    infographic_image_url?: string;
    articleContent: string | null;
    sidebar_content?: string | object | null; // JSON string or object
    relatedTopics: TopicItem[];
    created_at: string; // Already exists here, just ensuring type consistency
    updated_at: string;
}

export interface HomepageData {
    stats: { topics: number; views: number };
    trendingTopics: TopicItem[];
    categories: CategoryItem[];
}

// ─── API Functions ───────────────────────────────────────────────────
export const getHomepage = () => request<HomepageData>("/homepage");

export const getCategories = () => request<CategoryItem[]>("/categories");

export interface Settings {
    siteName?: string;
    siteDescription?: string;
    siteLogo?: string;
    enableNotifications?: string;
    enableAnalytics?: string;
    maintenanceMode?: string;
    darkModeDefault?: string;
    [key: string]: string | undefined;
}

export const getTopics = (params?: { category?: string; search?: string; difficulty?: string; timeRange?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search) qs.set("search", params.search);
    if (params?.difficulty) qs.set("difficulty", params.difficulty);
    if (params?.timeRange && params.timeRange !== "All Time") qs.set("timeRange", params.timeRange.toLowerCase().replace("this ", ""));
    const query = qs.toString();
    return request<TopicItem[]>(`/topics${query ? `?${query}` : ""}`);
};

export const getTopic = (id: string | number) => request<TopicDetailData>(`/topics/${id}`);

export const getTrending = () => request<TopicItem[]>("/trending");

export const getSettings = () => request<Settings>("/settings");
