
"use strict";

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dataDirectory = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(dataDirectory, "internships.db");

const database = new Database(databasePath);

database.pragma("foreign_keys = ON");

const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
const seedPath = path.join(__dirname, "..", "database", "seed.sql");

const schema = fs.readFileSync(schemaPath, "utf8");
const seed = fs.readFileSync(seedPath, "utf8");

database.exec(schema);
database.exec(seed);

const count = database
  .prepare("SELECT COUNT(*) AS count FROM internships")
  .get();

console.log(`Database seeded successfully.`);
console.log(`Internship records: ${count.count}`);

database.close();
