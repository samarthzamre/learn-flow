const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { adminRouter } = require("./routes/admin");
const { clientRouter } = require("./routes/client");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "insight-spark-server" });
});

app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
