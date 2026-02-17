const express = require("express");
const clientRouter = express.Router();
const {
  ping,
  getHomepageData,
  getCategories,
  getTopics,
  getTopicDetail,
  getTrendingTopics,
  getSettings
} = require("../controllers/clientController");

// Health
clientRouter.get("/ping", ping);

// Homepage Data
clientRouter.get("/homepage", getHomepageData);

// Categories
clientRouter.get("/categories", getCategories);

// Topics
clientRouter.get("/topics", getTopics);
clientRouter.get("/topics/:id", getTopicDetail);

// Trending
clientRouter.get("/trending", getTrendingTopics);

// Settings
clientRouter.get("/settings", getSettings);

module.exports = { clientRouter };
