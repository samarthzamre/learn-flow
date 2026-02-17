CREATE TABLE IF NOT EXISTS topic_views_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic_ip (topic_id, ip_address)
);
