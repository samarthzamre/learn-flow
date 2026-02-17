const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { adminRouter } = require("./routes/admin");
const { clientRouter } = require("./routes/client");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { checkConnection } = require("./utils/db");

const path = require("path");

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be loaded
}));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", async (req, res) => {
  const dbStatus = await checkConnection();
  res.json({ ok: true, service: "insight-spark-server", db: dbStatus });
});

app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});