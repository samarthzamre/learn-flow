-- Migration: 003_add_infographic_image.sql
-- Description: Adds infographic_image_url column to topics table

ALTER TABLE topics ADD COLUMN infographic_image_url TEXT DEFAULT NULL;
