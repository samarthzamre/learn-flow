const express = require("express");
const { getPool } = require("../db");

const adminRouter = express.Router();

adminRouter.get("/ping", async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (err) {
    next(err);
  }
});

module.exports = { adminRouter };
