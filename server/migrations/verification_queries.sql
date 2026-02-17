-- 0. Select Database (Note: backticks are required for hyphens)
USE insight_spark;

-- 1. Check Categories
SELECT * FROM categories ORDER BY sort_order;

-- 2. Check Topics (with Category Name)
SELECT 
    t.id, 
    t.title, 
    c.name AS category, 
    t.difficulty, 
    t.status, 
    t.has_infographic, 
    t.has_article 
FROM topics t
JOIN categories c ON t.category_id = c.id;

-- 3. Check Specific Topic Details (e.g., "Large Language Models")
SELECT 
    title, 
    summary, 
    sidebar_content 
FROM topics 
WHERE title = 'Large Language Models';

-- 4. Check Cards for "Large Language Models"
SELECT 
    tc.title, 
    tc.content, 
    tc.sort_order 
FROM topic_cards tc
JOIN topics t ON tc.topic_id = t.id
WHERE t.title = 'Large Language Models'
ORDER BY tc.sort_order;

-- 5. Check Infographic Items
SELECT 
    ti.title, 
    ti.stat, 
    ti.description 
FROM topic_infographic_items ti
JOIN topics t ON ti.topic_id = t.id;

-- 6. Check Articles
SELECT 
    t.title, 
    ta.content 
FROM topic_articles ta
JOIN topics t ON ta.topic_id = t.id;
