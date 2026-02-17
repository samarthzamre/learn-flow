const { z } = require("zod");

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    visible: z.boolean().optional(),
});

const topicCardSchema = z.object({
    title: z.string().min(1, "Card title is required"),
    content: z.string().min(1, "Card content is required"),
});

const infographicItemSchema = z.object({
    title: z.string().min(1, "Item title is required"),
    stat: z.string().optional(),
    description: z.string().optional(),
});

const topicSchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
    category_id: z.number({ required_error: "Category ID is required" }),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    status: z.enum(["Draft", "Published"]).optional(),
    trend_score: z.number().optional(),
    is_trending: z.boolean().optional(),
    source: z.enum(["All Sources", "Google", "GitHub", "Twitter", "News"]).optional(),
    has_infographic: z.boolean().optional(),
    has_article: z.boolean().optional(),
    sidebar_content: z.record(z.any()).optional(),
    infographic_image_url: z.string().optional(),
    cards: z.array(topicCardSchema).optional(),
    infographicItems: z.array(infographicItemSchema).optional(),
    articleContent: z.string().optional()
});

module.exports = {
    categorySchema,
    topicSchema
};
