"use strict";

require("dotenv").config();
const path = require("node:path");
const Database = require("better-sqlite3");
const { createApp } = require("./app");

const database = new Database(process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "internships.db"));
database.pragma("journal_mode = WAL");
database.exec(`CREATE TABLE IF NOT EXISTS internships (id TEXT PRIMARY KEY, title TEXT NOT NULL, domain TEXT NOT NULL, mode TEXT NOT NULL, location TEXT NOT NULL, skills TEXT NOT NULL, openings INTEGER NOT NULL, description TEXT, application_url TEXT);
CREATE TABLE IF NOT EXISTS applications (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	internship_id TEXT NOT NULL REFERENCES internships(id),
	applicant_name TEXT NOT NULL,
	applicant_email TEXT NOT NULL,
	portfolio_url TEXT,
	message TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (internship_id, applicant_email)
)`);
const port = Number(process.env.PORT || 3000);
createApp(database).listen(port, () => console.log(`Internship API listening on http://localhost:${port}`));