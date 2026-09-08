"use strict";

const express = require("express");
const cors = require("cors");
const path = require("node:path");

const DOMAINS = new Set(["Full Stack Development", "UI/UX", "Data Analytics", "Cyber Security"]);
const MODES = new Set(["Remote", "Hybrid", "On-site"]);

function createApp(database) {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "32kb" }));
    app.use(express.static(path.resolve(__dirname, "../.."), { index: "index.html" }));

    const success = (res, data, meta = {}) => res.json({ status: "success", data, meta });
    const failure = (res, code, message, details = []) => {
        const statusCode = code === "NOT_FOUND" ? 404 : code === "DUPLICATE_ID" ? 409 : code === "INTERNAL_ERROR" ? 500 : 400;
        return res.status(statusCode).json({ status: "error", data: null, error: { code, message, details } });
    };

    app.get("/health", (req, res) => success(res, { service: "internship-api", database: "sqlite" }));

    app.get("/api/internships", (req, res) => {
        const page = parsePositiveInteger(req.query.page, 1);
        const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 100);
        const search = String(req.query.search || "").trim();
        const domain = String(req.query.domain || "").trim();
        const mode = String(req.query.mode || "").trim();
        const where = [];
        const params = {};
        if (search) { where.push("(title LIKE @search OR domain LIKE @search OR location LIKE @search OR skills LIKE @search)"); params.search = `%${search}%`; }
        if (domain) { where.push("domain = @domain"); params.domain = domain; }
        if (mode) { where.push("mode = @mode"); params.mode = mode; }
        const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const total = database.prepare(`SELECT COUNT(*) AS count FROM internships ${clause}`).get(params).count;
        const rows = database.prepare(`SELECT * FROM internships ${clause} ORDER BY id LIMIT @limit OFFSET @offset`).all({ ...params, limit, offset: (page - 1) * limit });
        return success(res, rows.map(toInternship), { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total });
    });

    app.get("/api/internships/:id", (req, res) => {
        const row = database.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
        return row ? success(res, toInternship(row)) : failure(res, "NOT_FOUND", "Not found");
    });

    app.post("/api/internships", (req, res) => {
        const result = validatePayload(req.body, true);
        if (!result.valid) return failure(res, "VALIDATION_ERROR", "Request validation failed", result.errors);
        try {
            database.prepare(`INSERT INTO internships (id, title, domain, mode, location, skills, openings, description, application_url) VALUES (@id, @title, @domain, @mode, @location, @skills, @openings, @description, @application_url)`).run(toRow(result.value));
            return res.status(201).json({ status: "success", data: result.value, meta: {} });
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") return failure(res, "DUPLICATE_ID", "An internship with this ID already exists");
            throw error;
        }
    });

    app.put("/api/internships/:id", (req, res) => updateInternship(req, res, true));
    app.patch("/api/internships/:id", (req, res) => updateInternship(req, res, false));

    function updateInternship(req, res, replace) {
        const existing = database.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
        if (!existing) return failure(res, "NOT_FOUND", "Not found");
        const input = replace ? { ...req.body, id: req.params.id } : { ...toInternship(existing), ...req.body, id: req.params.id };
        const result = validatePayload(input, true);
        if (!result.valid) return failure(res, "VALIDATION_ERROR", "Request validation failed", result.errors);
        database.prepare(`UPDATE internships SET title=@title, domain=@domain, mode=@mode, location=@location, skills=@skills, openings=@openings, description=@description, application_url=@application_url WHERE id=@id`).run(toRow(result.value));
        return success(res, result.value);
    }

    app.delete("/api/internships/:id", (req, res) => {
        const result = database.prepare("DELETE FROM internships WHERE id = ?").run(req.params.id);
        if (!result.changes) return failure(res, "NOT_FOUND", "Not found");
        return success(res, { id: req.params.id, deleted: true });
    });

    app.use((error, req, res, next) => {
        if (error instanceof SyntaxError && error.status === 400 && error.body) return failure(res, "INVALID_JSON", "Request body must be valid JSON");
        console.error("Unhandled API error:", error.message);
        return failure(res, "INTERNAL_ERROR", "An unexpected server error occurred");
    });
    return app;
}

function parsePositiveInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function validatePayload(payload, requireId) {
    const value = payload && typeof payload === "object" ? payload : {};
    const errors = [];
    const required = ["title", "domain", "mode", "location", "skills", "openings"];
    if (requireId && !/^INT-\d{3,}$/.test(String(value.id || ""))) errors.push({ field: "id", message: "Must match INT-123 format" });
    for (const field of required) if (value[field] === undefined || value[field] === "") errors.push({ field, message: "Is required" });
    if (value.title !== undefined && (typeof value.title !== "string" || value.title.trim().length < 3 || value.title.length > 120)) errors.push({ field: "title", message: "Must be 3-120 characters" });
    if (value.domain !== undefined && !DOMAINS.has(value.domain)) errors.push({ field: "domain", message: "Is not a supported domain" });
    if (value.mode !== undefined && !MODES.has(value.mode)) errors.push({ field: "mode", message: "Is not a supported work mode" });
    if (value.skills !== undefined && (!Array.isArray(value.skills) || value.skills.length === 0 || value.skills.some((skill) => typeof skill !== "string" || !skill.trim()))) errors.push({ field: "skills", message: "Must be a non-empty array of text" });
    if (value.openings !== undefined && (!Number.isInteger(value.openings) || value.openings < 1 || value.openings > 10000)) errors.push({ field: "openings", message: "Must be an integer from 1 to 10000" });
    if (value.application_url !== undefined && value.application_url !== null && !isSafeUrl(value.application_url)) errors.push({ field: "application_url", message: "Must be an HTTPS URL" });
    if (value.description !== undefined && value.description !== null && (typeof value.description !== "string" || value.description.length > 2000)) errors.push({ field: "description", message: "Must be at most 2000 characters" });
    if (errors.length) return { valid: false, errors };
    return { valid: true, value: { id: value.id, title: value.title.trim(), domain: value.domain, mode: value.mode, location: value.location.trim(), skills: value.skills.map((skill) => skill.trim()), openings: value.openings, description: value.description || null, application_url: value.application_url || null } };
}

function isSafeUrl(value) { try { return new URL(value).protocol === "https:"; } catch { return false; } }
function toInternship(row) { return { ...row, skills: JSON.parse(row.skills) }; }
function toRow(value) { return { ...value, skills: JSON.stringify(value.skills) }; }

module.exports = { createApp, validatePayload };