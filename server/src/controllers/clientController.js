const asyncHandler = require("express-async-handler");
const { getPool } = require("../utils/db");

const ping = asyncHandler(async (req, res) => {
    res.json({ ok: true });
});

const getHomepageData = asyncHandler(async (req, res) => {
    const pool = getPool();

    // Stats
    const [[topicCount]] = await pool.query("SELECT COUNT(*) AS count FROM topics WHERE status = 'Published'");
    const [[totalViews]] = await pool.query("SELECT COALESCE(SUM(views), 0) AS total FROM topics");

    // Trending topics (top 4)
    const [trendingTopics] = await pool.query(
        `SELECT t.id, t.title, t.summary, c.name AS category, t.difficulty,
            t.has_infographic AS hasInfographic, t.has_article AS hasArticle, t.trend_score AS trendScore, t.views
     FROM topics t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.status = 'Published' AND (t.trend_score > 0 OR t.is_trending = 1)
     ORDER BY t.is_trending DESC, t.trend_score DESC LIMIT 4`
    );

    // Visible categories
    const [categories] = await pool.query(
        `SELECT c.id, c.name, c.slug, c.description, c.color, c.icon,
            (SELECT COUNT(*) FROM topics t WHERE t.category_id = c.id AND t.status = 'Published') AS topicCount
     FROM categories c
     WHERE c.visible = 1
     ORDER BY c.sort_order, c.name`
    );

    res.json({
        stats: {
            topics: topicCount.count,
            views: totalViews.total,
        },
        trendingTopics,
        categories,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [rows] = await pool.query(
        `SELECT c.id, c.name, c.slug, c.description, c.color, c.icon,
            (SELECT COUNT(*) FROM topics t WHERE t.category_id = c.id AND t.status = 'Published') AS topicCount
     FROM categories c
     WHERE c.visible = 1
     ORDER BY c.sort_order, c.name`
    );
    res.json(rows);
});

const getTopics = asyncHandler(async (req, res) => {
    const pool = getPool();
    const { category, search, difficulty, timeRange } = req.query;
    let sql = `SELECT t.id, t.title, t.summary, c.name AS category, t.difficulty,
                    t.has_infographic AS hasInfographic, t.has_article AS hasArticle,
                    t.trend_score AS trendScore, t.views, t.created_at
             FROM topics t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.status = 'Published'`;
    const params = [];

    if (category) {
        sql += " AND c.slug = ?";
        params.push(category);
    }
    if (search) {
        sql += " AND (t.title LIKE ? OR t.summary LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (difficulty) {
        sql += " AND t.difficulty = ?";
        params.push(difficulty);
    }
    if (timeRange) {
        if (timeRange === "today") {
            sql += " AND t.created_at >= CURDATE()";
        } else if (timeRange === "week") {
            sql += " AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
        } else if (timeRange === "month") {
            sql += " AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        }
    }

    sql += " ORDER BY t.trend_score DESC, t.views DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

const getTopicDetail = asyncHandler(async (req, res) => {
    const pool = getPool();

    // Track unique views by IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Normalize IP (handle ::1 for localhost)
    const normalizedIp = ip === '::1' ? '127.0.0.1' : ip;

    // Check if this IP has already viewed this topic
    const [[viewLog]] = await pool.query(
        "SELECT id FROM topic_views_log WHERE topic_id = ? AND ip_address = ?",
        [req.params.id, normalizedIp]
    );

    if (!viewLog) {
        // Record the view
        await pool.query(
            "INSERT INTO topic_views_log (topic_id, ip_address) VALUES (?, ?)",
            [req.params.id, normalizedIp]
        );
        // Increment views count
        await pool.query("UPDATE topics SET views = views + 1 WHERE id = ? AND status = 'Published'", [req.params.id]);
    }

    const [[topic]] = await pool.query(
        `SELECT t.id, t.title, t.summary, c.name AS category, c.slug AS categorySlug,
            t.difficulty, t.trend_score AS trendScore, t.has_infographic AS hasInfographic,
            t.has_article AS hasArticle, t.views, t.created_at, t.updated_at, t.sidebar_content
     FROM topics t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.id = ? AND t.status = 'Published'`, [req.params.id]
    );
    if (!topic) {
        res.status(404);
        throw new Error("Topic not found");
    }

    const [cards] = await pool.query(
        "SELECT id, title, content FROM topic_cards WHERE topic_id = ? ORDER BY sort_order",
        [req.params.id]
    );

    const [infographicItems] = await pool.query(
        "SELECT id, title, stat, description FROM topic_infographic_items WHERE topic_id = ? ORDER BY sort_order",
        [req.params.id]
    );

    const [[article]] = await pool.query(
        "SELECT content FROM topic_articles WHERE topic_id = ?",
        [req.params.id]
    );

    // Related topics
    const [relatedTopics] = await pool.query(
        `SELECT t.id, t.title, t.summary, c.name AS category, t.difficulty,
            t.has_infographic AS hasInfographic, t.has_article AS hasArticle, t.trend_score AS trendScore
     FROM topics t LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.category_id = (SELECT category_id FROM topics WHERE id = ?)
       AND t.id != ? AND t.status = 'Published'
     ORDER BY t.trend_score DESC LIMIT 3`,
        [req.params.id, req.params.id]
    );

    res.json({
        ...topic,
        cards,
        infographicItems,
        articleContent: article?.content || null,
        relatedTopics,
    });
});

const getTrendingTopics = asyncHandler(async (req, res) => {
    const pool = getPool();
    const { timeRange, source } = req.query;

    let sql = `SELECT t.id, t.title, t.summary, c.name AS category, t.difficulty,
            t.has_infographic AS hasInfographic, t.has_article AS hasArticle,
            t.trend_score AS trendScore, t.views, t.source, t.created_at, t.is_trending
     FROM topics t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.status = 'Published' AND (t.trend_score > 0 OR t.is_trending = 1)`;

    const params = [];

    // Time Filter
    if (timeRange) {
        if (timeRange === "Today") {
            sql += " AND t.created_at >= CURDATE()";
        } else if (timeRange === "This Week") {
            sql += " AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
        } else if (timeRange === "This Month") {
            sql += " AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        }
    }

    // Source Filter
    if (source && source !== "All Sources") {
        sql += " AND t.source = ?";
        params.push(source);
    }

    // Sort by is_trending first, then trend_score
    sql += " ORDER BY t.is_trending DESC, t.trend_score DESC LIMIT 50";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

const getSettings = asyncHandler(async (req, res) => {
    const pool = getPool();
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings");
    const settings = {};
    rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
});

module.exports = {
    ping,
    getHomepageData,
    getCategories,
    getTopics,
    getTopicDetail,
    getTrendingTopics,
    getSettings
};
