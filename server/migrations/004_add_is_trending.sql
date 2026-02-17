-- Migration: 004_add_is_trending.sql
-- Description: Adds 'is_trending' column to topics table for manual curation

ALTER TABLE topics
ADD COLUMN is_trending TINYINT(1) DEFAULT 0;
