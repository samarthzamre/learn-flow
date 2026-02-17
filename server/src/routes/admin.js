const express = require("express");
const adminRouter = express.Router();
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validationMiddleware");
const { categorySchema, topicSchema } = require("../utils/schemas");
const {
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
} = require("../controllers/adminController");

// Image Upload
adminRouter.post("/upload", upload.single("image"), uploadImage);

// Health
adminRouter.get("/ping", ping);

// Dashboard Stats
adminRouter.get("/stats", getStats);

// Categories
adminRouter.get("/categories", getCategories);
adminRouter.post("/categories", validate(categorySchema), createCategory);
adminRouter.put("/categories/:id", validate(categorySchema.partial()), updateCategory);
adminRouter.delete("/categories/:id", deleteCategory);

// Topics
adminRouter.get("/topics", getTopics);
adminRouter.get("/topics/:id", getTopicById);
adminRouter.post("/topics", validate(topicSchema), createTopic);
adminRouter.put("/topics/:id", validate(topicSchema.partial()), updateTopic);
adminRouter.delete("/topics/:id", deleteTopic);

// Settings
adminRouter.get("/settings", getSettings);
adminRouter.put("/settings", updateSettings); // Settings schema is dynamic/simple so skipping strict zod for now

module.exports = { adminRouter };
