# Internship Board API

REST API for internship records built with Node.js, Express, and SQLite. It preserves the five supplied fictional record IDs.

## Setup

```bash
cd internship-api
npm install
copy .env.example .env
npm run seed
npm start
```

The website runs at `http://localhost:3000/`, the health check is at `http://localhost:3000/health`, and the API is at `http://localhost:3000/api/internships`. Run `npm test` for CRUD and validation smoke tests.

## Data model

`internships` has `id` (for example `INT-101`), `title`, `domain`, `mode`, `location`, `skills` (array of strings), `openings` (positive integer), optional `description`, and optional `application_url`. Application URLs must use HTTPS.

## API contract

Success responses use `{ "status": "success", "data": ..., "meta": ... }`. Errors use `{ "status": "error", "data": null, "error": { "code": "...", "message": "...", "details": [] } }`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/internships?page=1&limit=10&search=sql&domain=...&mode=...` | List and filter |
| GET | `/api/internships/:id` | Detail |
| POST | `/api/internships` | Create |
| PUT/PATCH | `/api/internships/:id` | Replace or update |
| DELETE | `/api/internships/:id` | Delete |

Example:

```bash
curl -X POST http://localhost:3000/api/internships -H "Content-Type: application/json" -d "{\"id\":\"INT-201\",\"title\":\"QA Intern\",\"domain\":\"Full Stack Development\",\"mode\":\"Remote\",\"location\":\"India\",\"skills\":[\"Testing\"],\"openings\":1}"
```

Validation failures return `400`, duplicate IDs `409`, missing records `404`, creation `201`, and successful reads/updates/deletes `200`.
