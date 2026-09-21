# Production-Ready Capstone Report

## Product

InternHub is a responsive internship portal for discovering, filtering, inspecting, and applying to fictional internship opportunities. The public GitHub Pages build supports browsing and filtering through the committed `internship-records.json` fallback. The Node.js service provides persistent CRUD and application storage locally or on a Node-capable host.

## Engineering decisions

- Express serves the frontend and JSON API from one local origin, avoiding development CORS issues.
- SQLite keeps setup reproducible and uses prepared statements for all user-controlled values.
- The application table has a unique `(internship_id, applicant_email)` constraint so duplicate submissions cannot race past application logic.
- The browser has visible loading, empty, failure, retry, and submission states. GitHub Pages falls back to static records because GitHub Pages cannot execute Node.js.
- Logs contain method, route, status, and duration only. Names, email addresses, messages, and portfolio URLs are never logged.

## Quality evidence

Command run from `internship-api`:

```text
npm test
4 tests passed
```

The regression suite covers:

- Website root response and internship CRUD lifecycle
- Pagination metadata and PATCH updates
- Invalid internship/application input
- Successful application and case-insensitive duplicate rejection
- Helmet security headers and hidden Express fingerprint

Additional checks:

```text
node --check script.js
node --check src/app.js
npm run seed -> Database seeded successfully; Internship records: 5
```

## Security checklist

- [x] Helmet secure headers enabled
- [x] `x-powered-by` disabled
- [x] API rate limit: 100 requests per 15 minutes
- [x] Application rate limit: 10 requests per 15 minutes
- [x] Parameterized SQLite queries
- [x] HTTPS-only portfolio URLs
- [x] Server-side validation for names, email, internship IDs, and messages
- [x] Duplicate applications rejected with HTTP 409
- [x] Applicant data excluded from logs
- [x] No secrets committed; use `.env.example`

## Accessibility and responsive QA

The interface uses semantic headings, labels connected to controls, native dialogs, keyboard focus outlines, live regions for result/loading/error messaging, and a responsive layout. Verify at 360px wide with browser device emulation and confirm no horizontal scrollbar. Run Lighthouse Accessibility and Performance audits against the local site before submission; record the scores and screenshots in `screenshots/`.

## Run and deploy

```powershell
cd internship-api
npm install
npm run seed
npm start
```

Local site: `http://localhost:3000/`

GitHub Pages: `https://hpgohil2006-cmd.github.io/responsive-internship-board/`

GitHub Pages serves the static browsing experience. To enable live applications there, deploy the API separately and define `window.INTERNHUB_API_URL` before `script.js` in `index.html`.
