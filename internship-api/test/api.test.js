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