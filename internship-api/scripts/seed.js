"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const database = new Database(process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "internships.db"));
database.exec(fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8"));
const records = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "internships.json"), "utf8")).internships;
const insert = database.prepare(`INSERT OR REPLACE INTO internships (id, title, domain, mode, location, skills, openings, description, application_url) VALUES (@id, @title, @domain, @mode, @location, @skills, @openings, @description, @application_url)`);
database.transaction(() => records.forEach((record) => insert.run({ ...record, skills: JSON.stringify(record.skills), description: null, application_url: null })))();
console.log(`Seeded ${records.length} internship records.`);
database.close();