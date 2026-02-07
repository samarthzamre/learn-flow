const express = require("express");

const clientRouter = express.Router();

clientRouter.get("/ping", (req, res) => {
  res.json({ ok: true });
});

module.exports = { clientRouter };
