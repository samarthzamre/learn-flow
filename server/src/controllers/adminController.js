const asyncHandler = require("express-async-handler");
const { getPool } = require("../utils/db");

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("No file uploaded");
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

const ping = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
});

const getStats = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [[topicCount]] = await pool.query("SELECT COUNT(*) AS count FROM topics");
    const [[publishedCount]] = await pool.query("SELECT COUNT(*) AS count FROM topics WHERE status = 'Published'");
    const [[categoryCount]] = await pool.query("SELECT COUNT(*) AS count FROM categories");
    const [[totalViews]] = await pool.query("SELECT COALESCE(SUM(views), 0) AS total FROM topics");
    const [[trendingCount]] = await pool.query("SELECT COUNT(*) AS count FROM topics WHERE trend_score >= 80");

    res.json({
        totalTopics: topicCount.count,
        publishedTopics: publishedCount.count,
        totalCategories: categoryCount.count,
        totalViews: totalViews.total,
        trendingTopics: trendingCount.count,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [rows] = await pool.query(
        `SELECT c.*, (SELECT COUNT(*) FROM topics t WHERE t.category_id = c.id) AS topicCount
     FROM categories c ORDER BY c.sort_order, c.name`
    );
    res.json(rows);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, color, icon, visible } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Name is required");
    }

    const pool = getPool();
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [result] = await pool.query(
        "INSERT INTO categories (name, slug, description, color, icon, visible) VALUES (?, ?, ?, ?, ?, ?)",
        [name, finalSlug, description || "", color || "#6366F1", icon || "Cpu", visible !== false ? 1 : 0]
    );
    const [[created]] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);
    res.status(201).json(created);
});

const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, color, icon, visible } = req.body;
    const pool = getPool();
    const sets = [];
    const vals = [];

    if (name !== undefined) { sets.push("name = ?"); vals.push(name); }
    if (slug !== undefined) { sets.push("slug = ?"); vals.push(slug); }
    if (description !== undefined) { sets.push("description = ?"); vals.push(description); }
    if (color !== undefined) { sets.push("color = ?"); vals.push(color); }
    if (icon !== undefined) { sets.push("icon = ?"); vals.push(icon); }
    if (visible !== undefined) { sets.push("visible = ?"); vals.push(visible ? 1 : 0); }

    if (sets.length === 0) {
        res.status(400);
        throw new Error("Nothing to update");
    }

    vals.push(req.params.id);
    await pool.query(`UPDATE categories SET ${sets.join(", ")} WHERE id = ?`, vals);
    const [[updated]] = await pool.query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
    res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const pool = getPool();
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
});

const getTopics = asyncHandler(async (req, res) => {
    const pool = getPool();
    const { status, search, category } = req.query;
    let sql = `SELECT t.*, c.name AS categoryName, c.slug AS categorySlug
             FROM topics t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE 1=1`;
    const params = [];

    if (status && status !== "All") {
        sql += " AND t.status = ?";
        params.push(status);
    }
    if (search) {
        sql += " AND t.title LIKE ?";
        params.push(`%${search}%`);
    }
    if (category) {
        sql += " AND c.slug = ?";
        params.push(category);
    }

    sql += " ORDER BY t.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

const getTopicById = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [[topic]] = await pool.query(
        `SELECT t.*, c.name AS categoryName, c.slug AS categorySlug
     FROM topics t LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.id = ?`, [req.params.id]
    );
    if (!topic) {
        res.status(404);
        throw new Error("Topic not found");
    }

    const [cards] = await pool.query("SELECT * FROM topic_cards WHERE topic_id = ? ORDER BY sort_order", [req.params.id]);
    const [infographicItems] = await pool.query("SELECT * FROM topic_infographic_items WHERE topic_id = ? ORDER BY sort_order", [req.params.id]);
    const [[article]] = await pool.query("SELECT * FROM topic_articles WHERE topic_id = ?", [req.params.id]);

    res.json({ ...topic, cards, infographicItems, article: article || null });
});

const createTopic = asyncHandler(async (req, res) => {
    const { title, summary, category_id, difficulty, status, trend_score, is_trending, source, has_infographic, has_article, cards, infographicItems, articleContent, sidebar_content, infographic_image_url } = req.body;
    if (!title || !category_id) {
        res.status(400);
        throw new Error("Title and category_id are required");
    }

    const pool = getPool();
    const [result] = await pool.query(
        `INSERT INTO topics (title, summary, category_id, difficulty, status, trend_score, is_trending, source, has_infographic, has_article, sidebar_content, infographic_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, summary || "", category_id, difficulty || "Beginner", status || "Draft", trend_score || 0, is_trending ? 1 : 0, source || "All Sources", has_infographic ? 1 : 0, has_article ? 1 : 0, sidebar_content ? JSON.stringify(sidebar_content) : null, infographic_image_url || null]
    );
    const topicId = result.insertId;

    // Insert cards
    if (cards && cards.length > 0) {
        for (let i = 0; i < cards.length; i++) {
            await pool.query(
                "INSERT INTO topic_cards (topic_id, title, content, sort_order) VALUES (?, ?, ?, ?)",
                [topicId, cards[i].title, cards[i].content, i + 1]
            );
        }
    }

    // Insert infographic items
    if (infographicItems && infographicItems.length > 0) {
        for (let i = 0; i < infographicItems.length; i++) {
            await pool.query(
                "INSERT INTO topic_infographic_items (topic_id, title, stat, description, sort_order) VALUES (?, ?, ?, ?, ?)",
                [topicId, infographicItems[i].title, infographicItems[i].stat || "", infographicItems[i].description || "", i + 1]
            );
        }
    }

    // Insert article
    if (articleContent) {
        await pool.query(
            "INSERT INTO topic_articles (topic_id, content) VALUES (?, ?)",
            [topicId, articleContent]
        );
    }

    const [[created]] = await pool.query("SELECT * FROM topics WHERE id = ?", [topicId]);
    res.status(201).json(created);
});

const updateTopic = asyncHandler(async (req, res) => {
    const { title, summary, category_id, difficulty, status, trend_score, is_trending, source, has_infographic, has_article, sidebar_content, infographic_image_url, cards, infographicItems, articleContent } = req.body;
    const pool = getPool();
    const sets = [];
    const vals = [];

    if (title !== undefined) { sets.push("title = ?"); vals.push(title); }
    if (summary !== undefined) { sets.push("summary = ?"); vals.push(summary); }
    if (category_id !== undefined) { sets.push("category_id = ?"); vals.push(category_id); }
    if (difficulty !== undefined) { sets.push("difficulty = ?"); vals.push(difficulty); }
    if (status !== undefined) { sets.push("status = ?"); vals.push(status); }
    if (trend_score !== undefined) { sets.push("trend_score = ?"); vals.push(trend_score); }
    if (is_trending !== undefined) { sets.push("is_trending = ?"); vals.push(is_trending ? 1 : 0); }
    if (source !== undefined) { sets.push("source = ?"); vals.push(source); }
    if (has_infographic !== undefined) { sets.push("has_infographic = ?"); vals.push(has_infographic ? 1 : 0); }
    if (has_article !== undefined) { sets.push("has_article = ?"); vals.push(has_article ? 1 : 0); }
    if (infographic_image_url !== undefined) { sets.push("infographic_image_url = ?"); vals.push(infographic_image_url); }
    if (sidebar_content !== undefined) { sets.push("sidebar_content = ?"); vals.push(JSON.stringify(sidebar_content)); }

    if (sets.length === 0) {
        res.status(400);
        throw new Error("Nothing to update");
    }

    vals.push(req.params.id);
    await pool.query(`UPDATE topics SET ${sets.join(", ")} WHERE id = ?`, vals);

    // Update Cards (Replace all)
    if (cards) {
        await pool.query("DELETE FROM topic_cards WHERE topic_id = ?", [req.params.id]);
        if (cards.length > 0) {
            for (let i = 0; i < cards.length; i++) {
                await pool.query(
                    "INSERT INTO topic_cards (topic_id, title, content, sort_order) VALUES (?, ?, ?, ?)",
                    [req.params.id, cards[i].title, cards[i].content, i + 1]
                );
            }
        }
    }

    // Update Infographics (Replace all)
    if (infographicItems) {
        await pool.query("DELETE FROM topic_infographic_items WHERE topic_id = ?", [req.params.id]);
        if (infographicItems.length > 0) {
            for (let i = 0; i < infographicItems.length; i++) {
                await pool.query(
                    "INSERT INTO topic_infographic_items (topic_id, title, stat, description, sort_order) VALUES (?, ?, ?, ?, ?)",
                    [req.params.id, infographicItems[i].title, infographicItems[i].stat || "", infographicItems[i].description || "", i + 1]
                );
            }
        }
    }

    // Update Article
    if (articleContent !== undefined) {
        await pool.query("DELETE FROM topic_articles WHERE topic_id = ?", [req.params.id]);
        if (articleContent) {
            await pool.query(
                "INSERT INTO topic_articles (topic_id, content) VALUES (?, ?)",
                [req.params.id, articleContent]
            );
        }
    }

    const [[updated]] = await pool.query("SELECT * FROM topics WHERE id = ?", [req.params.id]);
    res.json(updated);
});

const deleteTopic = asyncHandler(async (req, res) => {
    const pool = getPool();
    await pool.query("DELETE FROM topics WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
});

const getSettings = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
    const settings = {};
    rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
});

const updateSettings = asyncHandler(async (req, res) => {
    const pool = getPool();
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
        await pool.query(
            "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
            [key, String(value), String(value)]
        );
    }
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
    const settings = {};
    rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
});

module.exports = {
    uploadImage,
    ping,
    getStats,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    getSettings,
    updateSettings
};
