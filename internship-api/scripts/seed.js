
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

const internshipColumns = database.prepare("PRAGMA table_info(internships)").all().map((column) => column.name);
if (internshipColumns.length > 0 && !internshipColumns.includes("mode")) {
  database.exec("DROP TABLE IF EXISTS applications; DROP TABLE internships;");
}

const schemaPath = path.join(__dirname, "..", "schema.sql");
const recordsPath = path.join(__dirname, "..", "data", "internships.json");

database.exec(fs.readFileSync(schemaPath, "utf8"));
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8")).internships;
const insert = database.prepare(`
  INSERT OR REPLACE INTO internships
    (id, title, domain, mode, location, skills, openings, description, application_url)
  VALUES (@id, @title, @domain, @mode, @location, @skills, @openings, @description, @application_url)
`);

database.transaction(() => {
  for (const record of records) {
    insert.run({
      ...record,
      skills: JSON.stringify(record.skills),
      description: record.description || null,
      application_url: record.application_url || null
    });
  }
})();

const count = database
  .prepare("SELECT COUNT(*) AS count FROM internships")
  .get();

console.log("Database seeded successfully.");
console.log(`Internship records: ${count.count}`);

database.close();
