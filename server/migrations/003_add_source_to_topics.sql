-- Migration: 003_add_source_to_topics.sql
-- Description: Adds 'source' column to topics table for trending filters

ALTER TABLE topics
ADD COLUMN source ENUM('All Sources', 'Google', 'GitHub', 'Twitter', 'News') DEFAULT 'All Sources';
