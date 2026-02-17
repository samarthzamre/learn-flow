const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
    }
    return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    visible: boolean;
    sort_order: number;
    topicCount: number;
}

export interface Topic {
    id: number;
    title: string;
    summary: string;
    category_id: number;
    categoryName: string;
    categorySlug: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    status: "Draft" | "Published";
    trend_score: number;
    is_trending: boolean;
    source: "All Sources" | "Google" | "GitHub" | "Twitter" | "News";
    has_infographic: boolean;
    has_article: boolean;
    sidebar_content: string | null;
    infographic_image_url: string | null;
    views: number;
    created_at: string;
    updated_at: string;
}

export interface TopicDetail extends Topic {
    cards: { id: number; title: string; content: string }[];
    infographicItems: { id: number; title: string; stat: string; description: string }[];
    article: { id: number; content: string } | null;
}

export interface DashboardStats {
    totalTopics: number;
    publishedTopics: number;
    totalCategories: number;
    totalViews: number;
    trendingTopics: number;
}

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

// ─── Dashboard ───────────────────────────────────────────────────────
export const getStats = () => request<DashboardStats>("/stats");

// ─── Categories ──────────────────────────────────────────────────────
export const getCategories = () => request<Category[]>("/categories");

export const createCategory = (data: Partial<Category>) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) });

export const updateCategory = (id: number, data: Partial<Category>) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteCategory = (id: number) =>
    request<{ ok: boolean }>(`/categories/${id}`, { method: "DELETE" });

// ─── Topics ──────────────────────────────────────────────────────────
export const getTopics = (params?: { status?: string; search?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    const query = qs.toString();
    return request<Topic[]>(`/topics${query ? `?${query}` : ""}`);
};

export const getTopic = (id: number) => request<TopicDetail>(`/topics/${id}`);

export const createTopic = (data: Record<string, unknown>) =>
    request<Topic>("/topics", { method: "POST", body: JSON.stringify(data) });

export const updateTopic = (id: number, data: Record<string, unknown>) =>
    request<Topic>(`/topics/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteTopic = (id: number) =>
    request<{ ok: boolean }>(`/topics/${id}`, { method: "DELETE" });

// ─── Settings ────────────────────────────────────────────────────────
export const getSettings = () => request<Settings>("/settings");

export const updateSettings = (data: Settings) =>
    request<Settings>("/settings", { method: "PUT", body: JSON.stringify(data) });

// ─── Image Upload ────────────────────────────────────────────────────
export const uploadImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
    }
    return res.json();
};
