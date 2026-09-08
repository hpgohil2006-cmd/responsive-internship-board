"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const { createApp } = require("../src/app");

function setup() {
    const database = new Database(":memory:");
    database.exec(fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8"));
    return { app: createApp(database), database };
}

async function request(app, method, url, body) {
    const server = app.listen(0);
    const address = server.address();
    try {
        const response = await fetch(`http://127.0.0.1:${address.port}${url}`, { method, headers: { "content-type": "application/json" }, body: body && JSON.stringify(body) });
        return { status: response.status, body: await response.json() };
    } finally { server.close(); }
}

async function requestText(app, url) {
    const server = app.listen(0);
    const address = server.address();
    try {
        const response = await fetch(`http://127.0.0.1:${address.port}${url}`);
        return { status: response.status, body: await response.text() };
    } finally { server.close(); }
}

test("supports create, list pagination, detail, update, and delete", async () => {
    const { app, database } = setup();
    const root = await requestText(app, "/");
    assert.equal(root.status, 200);
    assert.match(root.body, /InternHub/);
    const record = { id: "INT-201", title: "QA Intern", domain: "Full Stack Development", mode: "Remote", location: "India", skills: ["Testing"], openings: 1 };
    assert.equal((await request(app, "POST", "/api/internships", record)).status, 201);
    const list = await request(app, "GET", "/api/internships?page=1&limit=1");
    assert.equal(list.body.data.length, 1);
    assert.equal(list.body.meta.total, 1);
    assert.equal((await request(app, "GET", "/api/internships/INT-201")).body.data.title, "QA Intern");
    assert.equal((await request(app, "PATCH", "/api/internships/INT-201", { openings: 2 })).body.data.openings, 2);
    assert.equal((await request(app, "DELETE", "/api/internships/INT-201")).body.data.deleted, true);
    assert.equal((await request(app, "GET", "/api/internships/INT-201")).status, 404);
    database.close();
});

test("returns consistent validation errors", async () => {
    const { app, database } = setup();
    const result = await request(app, "POST", "/api/internships", { id: "bad", mode: "Remote", application_url: "javascript:alert(1)" });
    assert.equal(result.status, 400);
    assert.equal(result.body.status, "error");
    assert.equal(result.body.error.code, "VALIDATION_ERROR");
    database.close();
});

test("accepts valid applications and rejects invalid duplicates", async () => {
    const { app, database } = setup();
    database.prepare("INSERT INTO internships (id, title, domain, mode, location, skills, openings) VALUES (?, ?, ?, ?, ?, ?, ?)").run("INT-201", "QA Intern", "Full Stack Development", "Remote", "India", '["Testing"]', 1);
    const application = { internshipId: "INT-201", name: "Asha Student", email: "asha@example.com", portfolio: "https://example.com/work", message: "I am excited to learn through this internship." };
    const created = await request(app, "POST", "/api/applications", application);
    assert.equal(created.status, 201);
    assert.equal(created.body.data.internshipId, "INT-201");
    const duplicate = await request(app, "POST", "/api/applications", { ...application, email: "ASHA@example.com" });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.error.code, "DUPLICATE_APPLICATION");
    const invalid = await request(app, "POST", "/api/applications", { ...application, email: "bad", portfolio: "javascript:alert(1)" });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
    database.close();
});

test("sets security headers", async () => {
    const { app, database } = setup();
    const server = app.listen(0);
    try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
        assert.equal(response.headers.get("x-content-type-options"), "nosniff");
        assert.equal(response.headers.get("x-powered-by"), null);
    } finally {
        server.close();
        database.close();
    }
});