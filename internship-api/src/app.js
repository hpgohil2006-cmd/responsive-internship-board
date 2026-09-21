"use strict";

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const internshipRoutes = require("./routes/internshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const { errorHandler } = require("./middleware/errorHandler");

function createApp(database) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));
  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => console.log(JSON.stringify({ method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - startedAt })));
    next();
  });
  app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));

  // Serve the frontend from the workspace root.
  app.use(express.static(path.resolve(__dirname, "../.."), { index: "index.html" }));

  // Health check
  app.get("/health", (req, res) => {
    let databaseReady = false;
    try {
      database.prepare("SELECT 1").get();
      databaseReady = true;
    } catch {}
    res.status(200).json({
      status: databaseReady ? "success" : "error",
      message: "Internship API is running",
      data: {
        service: "internship-api",
        environment: process.env.NODE_ENV || "development",
        database: databaseReady ? "ready" : "unavailable"
      }
    });
  });

  // API routes
  app.use("/api/internships", internshipRoutes(database));
  app.use("/api/applications", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false }), applicationRoutes(database));

  // Unknown route
  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      data: null,
      error: {
        code: "NOT_FOUND",
        message: `Route ${req.method} ${req.originalUrl} not found`
      }
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};

