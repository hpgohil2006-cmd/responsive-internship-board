"use strict";

require("dotenv").config();

const path = require("node:path");
const fs = require("node:fs");
const Database = require("better-sqlite3");

const { createApp } = require("./app");

const dataDirectory = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(dataDirectory, "internships.db");

const database = new Database(databasePath);

database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

const internshipColumns = database.prepare("PRAGMA table_info(internships)").all().map((column) => column.name);
if (internshipColumns.length > 0 && !internshipColumns.includes("mode")) {
  database.exec("DROP TABLE IF EXISTS applications; DROP TABLE internships;");
}

database.exec(fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8"));

const port = Number(process.env.PORT || 3000);

const app = createApp(database);

const server = app.listen(port, () => {
  console.log(`Internship API running at http://localhost:${port}`);
});

function shutdown() {
  console.log("Shutting down server...");
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

