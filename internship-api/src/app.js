"use strict";

const express = require("express");
const cors = require("cors");
const path = require("node:path");

const internshipRoutes = require("./routes/internshipRoutes");
const { errorHandler } = require("./middleware/errorHandler");

function createApp(database) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "100kb" }));

  // Serve the frontend from the workspace root.
  app.use(express.static(path.resolve(__dirname, "../.."), { index: "index.html" }));

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Internship API is running",
      data: {
        service: "internship-api",
        environment: process.env.NODE_ENV || "development"
      }
    });
  });

  // API routes
  app.use("/api/internships", internshipRoutes(database));

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

