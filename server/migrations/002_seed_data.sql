-- Migration: 002_seed_data.sql
-- Description: Inserts initial data for Categories and Topics safely

-- Insert Categories (Idempotent via INSERT IGNORE and unique slug)
INSERT IGNORE INTO categories (name, slug, icon, color, description, visible) VALUES
('Technology', 'technology', 'Cpu', '#3B82F6', 'Latest in tech, gadgets, and software.', 1),
('Science', 'science', 'Atom', '#10B981', 'Discoveries, space, and nature.', 1),
('Business', 'business', 'Briefcase', '#F59E0B', 'Finance, markets, and entrepreneurship.', 1),
('Lifestyle', 'lifestyle', 'Coffee', '#EC4899', 'Health, travel, and daily living.', 1),
('Health', 'health', 'Heart', '#EF4444', 'Wellness, fitness, and medical news.', 1),
('Coding', 'coding', 'Code', '#6366F1', 'Programming, development, and engineering.', 1),
('AI & ML', 'ai-ml', 'Brain', '#8B5CF6', 'Artificial Intelligence and Machine Learning.', 1),
('Programming', 'programming', 'Code', '#3B82F6', 'Software development and coding practices.', 1),
('Finance', 'finance', 'TrendingUp', '#10B981', 'Markets, investing, and economics.', 1);

-- 1. Large Language Models
INSERT INTO topics (title, summary, category_id, difficulty, status, trend_score, has_infographic, has_article, views, sidebar_content)
SELECT 'Large Language Models', 'How GPT, Claude and other LLMs are reshaping AI and transforming the way we interact with technology', id, 'Intermediate', 'Published', 98, 1, 1, 150, 
'{"key_terms": ["Transformer", "Token", "Parameters", "Fine-tuning", "Prompt Engineering"], "real_world_uses": ["Chatbots & Virtual Assistants", "Code Generation Tools", "Content Creation", "Research & Analysis"], "common_mistakes": ["Trusting outputs without fact-checking", "Ignoring context window limits", "Not understanding token costs", "Over-relying on single responses"]}'
FROM categories 
WHERE slug = 'ai-ml' 
  AND NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Large Language Models');

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'What are LLMs?', 'Large Language Models are AI systems trained on massive text datasets. They learn patterns in language to understand and generate human-like text. Think of them as super-smart autocomplete that can write essays, code, and even poetry.', 1
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'What are LLMs?' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'How do they work?', 'At their core, LLMs use a neural network architecture called the Transformer. They process text as tokens (chunks of characters) and predict the most likely next token based on the context of previous tokens.', 2
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'How do they work?' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Training Process', 'Training involves two main stages: Pre-training (learning from vast internet text) and Fine-tuning (refining for specific tasks and safety using human feedback).', 3
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Training Process' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Capabilities', 'Beyond writing text, modern LLMs can reason, solve math problems, write and debug code, translate languages, and even analyze images (multimodal capabilities).', 4
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Capabilities' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Limitations', 'LLMs can hallucinate (confidently state false information), have biases from training data, and lack true understanding of the world—they operate on statistical probability.', 5
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Limitations' AND topic_id = topics.id);

-- 2. React Server Components
INSERT INTO topics (title, summary, category_id, difficulty, status, trend_score, has_infographic, has_article, views, sidebar_content)
SELECT 'React Server Components', 'The future of React rendering explained', id, 'Advanced', 'Published', 96, 1, 1, 120,
'{"key_terms": ["Server Side Rendering", "Hydration", "Bundle Size", "Streaming", "RSC Wire Format"], "real_world_uses": ["E-commerce sites", "Content-heavy apps", "Dashboards", "Static Blogs"], "common_mistakes": ["Using hooks in server components", "Passing non-serializable props", "Over-fetching data", "Importing server code in client components"]}'
FROM categories WHERE slug = 'programming'
  AND NOT EXISTS (SELECT 1 FROM topics WHERE title = 'React Server Components');

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'What are RSCs?', 'React Server Components allow you to render components exclusively on the server. Unlike traditional SSR, their code is never sent to the client, reducing bundle size.', 1
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'What are RSCs?' AND topic_id = topics.id);

-- (Skipping other RSC cards for brevity in this re-write, assuming sufficient)
-- Actually, need to be complete to match original functionality.
INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Why use them?', 'They provide direct access to backend resources (like databases), keep secrets secure, and reduce the JavaScript payload sent to the user''s browser.', 2
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Why use them?' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Client vs Server', 'Server components run on the server and return UI. Client components run in the browser and handle interactivity (onClick, useEffect). You can interleave them.', 3
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Client vs Server' AND topic_id = topics.id);
  
INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Data Fetching', 'With RSCs, you can fetch data directly in your component using async/await without needing useEffect or external libraries like React Query for simple fetches.', 4
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Data Fetching' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Streaming', 'RSCs support streaming, allowing you to show parts of the UI (like a skeleton) while heavy data is still loading, improving perceived performance.', 5
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Streaming' AND topic_id = topics.id);


-- 3. Quantum Computing Basics
INSERT INTO topics (title, summary, category_id, difficulty, status, trend_score, has_infographic, has_article, views, sidebar_content)
SELECT 'Quantum Computing Basics', 'Understanding qubits, superposition, and entanglement', id, 'Beginner', 'Published', 95, 1, 0, 110,
'{"key_terms": ["Qubit", "Superposition", "Entanglement", "Decoherence", "Quantum Gate"], "real_world_uses": ["Cryptography (Shor''s Algorithm)", "Drug Discovery", "Optimization Problems", "Financial Modeling"], "common_mistakes": ["Confusing with supercomputers", "Assuming instant speedup for all tasks", "Ignoring error rates", "Thinking it replaces classical computers"]}'
FROM categories WHERE slug = 'science'
  AND NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Quantum Computing Basics');

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'The Bit vs The Qubit', 'Classical computers use bits (0 or 1). Quantum computers use qubits, which can represent 0, 1, or both closely at the same time due to superposition.', 1
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'The Bit vs The Qubit' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Superposition', 'Imagine a spinning coin. While spinning, it''s roughly heads and tails at once. That''s superposition. It collapses to a single state only when measured.', 2
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Superposition' AND topic_id = topics.id);
  
INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Entanglement', 'Einstein called it ''spooky action at a distance''. Two entangled particles remain connected so that the state of one instantly affects the other, no matter the distance.', 3
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Entanglement' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Quantum Speedup', 'For specific problems (like factoring large numbers), quantum algorithms can be exponentially faster than the best known classical algorithms.', 4
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Quantum Speedup' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Current Challenges', 'Qubits are fragile. Noise and temperature changes cause errors (decoherence), making it hard to maintain stable quantum states for long calculations.', 5
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Current Challenges' AND topic_id = topics.id);


-- 4. Startup Fundraising
INSERT INTO topics (title, summary, category_id, difficulty, status, trend_score, has_infographic, has_article, views, sidebar_content)
SELECT 'Startup Fundraising', 'From seed to Series A: A complete guide', id, 'Intermediate', 'Published', 92, 0, 1, 90,
'{"key_terms": ["Bootstrapping", "Angel Investor", "Venture Capital", "Equity", "Valuation", "Term Sheet"], "real_world_uses": ["Scaling operations", "Hiring talent", "Product development", "Marketing"], "common_mistakes": ["Raising too much too soon", "Ignoring unit economics", "Giving up too much equity", "Bad investor fit"]}'
FROM categories WHERE slug = 'business'
  AND NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Startup Fundraising');

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Bootstrapping', 'Using your own savings or revenue to fund the business. You keep control but grow slower.', 1
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Bootstrapping' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Friends & Family', 'Often the first outside money. High risk for them, but usually flexible terms.', 2
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Friends & Family' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Angel Investors', 'High-net-worth individuals who invest their own money in early-stage startups.', 3
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Angel Investors' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'Venture Capital', 'Professional firms investing other people''s money. They expect high growth and massive returns.', 4
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'Venture Capital' AND topic_id = topics.id);

INSERT INTO topic_cards (topic_id, title, content, sort_order)
SELECT id, 'The Pitch', 'You need a compelling story, a solid team, and a large market opportunity to convince investors.', 5
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_cards WHERE title = 'The Pitch' AND topic_id = topics.id);


-- 7. Add Infographic Items
INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Model Size', '1.7T', 'Parameters in GPT-4 (Estimated)'
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Model Size' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Training Data', '45TB', 'Text data processed during training'
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Training Data' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Compute Cost', '$100M+', 'Cost to train a frontier model'
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Compute Cost' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Adoption', '100M+', 'Users reached in 2 months (ChatGPT)'
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Adoption' AND topic_id = topics.id);


INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Bundle Reduction', '30%', 'Average reduction in JS bundle size'
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Bundle Reduction' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'TTI Speedup', '2x', 'Faster Time to Interactive'
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'TTI Speedup' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'SEO Score', '100', 'Perfect Lighthouse SEO scores achievable'
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'SEO Score' AND topic_id = topics.id);


-- 8. Add Articles
INSERT INTO topic_articles (topic_id, content)
SELECT id, '<h2>The Rise of Large Language Models</h2><p>Large Language Models (LLMs) represent a significant leap in artificial intelligence, moving from simple pattern recognition to complex reasoning and generation.</p><h3>What makes them different?</h3><p>Unlike previous AI models, LLMs are capable of zero-shot learning, meaning they can perform tasks they weren''t explicitly trained for.</p><h3>The Transformer Architecture</h3><p>Introduced in 2017, the Transformer architecture allows models to process data in parallel, significantly speeding up training.</p>'
FROM topics WHERE title = 'Large Language Models'
  AND NOT EXISTS (SELECT 1 FROM topic_articles WHERE topic_id = topics.id);

INSERT INTO topic_articles (topic_id, content)
SELECT id, '<h2>RSC: A Paradigm Shift</h2><p>React Server Components change how we think about building React applications. By moving logic to the server, we can build faster, more secure apps.</p><h3>No More Client Waterfalls</h3><p>Data fetching happens on the server, eliminating the dreaded "loading spinner hell" caused by nested client-side data fetching.</p>'
FROM topics WHERE title = 'React Server Components'
  AND NOT EXISTS (SELECT 1 FROM topic_articles WHERE topic_id = topics.id);


INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Qubits', '50+', 'Current stable qubit count (IBM Eagle)'
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Qubits' AND topic_id = topics.id);

INSERT INTO topic_infographic_items (topic_id, title, stat, description)
SELECT id, 'Error Rate', '0.1%', 'Target error rate for useful computation'
FROM topics WHERE title = 'Quantum Computing Basics'
  AND NOT EXISTS (SELECT 1 FROM topic_infographic_items WHERE title = 'Error Rate' AND topic_id = topics.id);


INSERT INTO topic_articles (topic_id, content)
SELECT id, '<h2>The Fundraising Journey</h2><p>Raising capital is often necessary for high-growth startups. It validates your idea and provides fuel for growth.</p><h3>Seed Stage</h3><p>Typically $500k - $2M. Used to build the product and find product-market fit.</p><h3>Series A</h3><p>$2M - $15M. Used to scale operations and user base once the model is proven.</p>'
FROM topics WHERE title = 'Startup Fundraising'
  AND NOT EXISTS (SELECT 1 FROM topic_articles WHERE topic_id = topics.id);
