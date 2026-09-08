# Internship Board REST API

A RESTful API built with **Node.js, Express.js, and SQLite** for managing internship records. This project provides complete CRUD operations, input validation, pagination, filtering, search, persistent database storage, and consistent API responses.

## 📌 Project Overview

The Internship Board API is developed as part of a **Full Stack Development Internship – Task 2: REST API and Persistent Data**.

## 🔐 Task 3: Secure Application Integration

The frontend is served from `http://localhost:3000/` and loads internship records from `GET /api/internships`. Loading, empty, error, and retry states are visible in the browser.

Applications are submitted with `POST /api/applications`:

```json
{
  "internshipId": "INT-101",
  "name": "Asha Student",
  "email": "asha@example.com",
  "portfolio": "https://example.com/work",
  "message": "I am excited to learn through this internship."
}
```

The server rejects missing or invalid names, email addresses, unsafe portfolio URLs, short messages, unknown internship IDs, and duplicate applications for the same internship and email. Applications are persisted in SQLite and duplicate detection is case-insensitive.

Security checklist:

* Helmet secure headers are enabled and Express identifies are hidden.
* API requests are rate limited to 100 requests per 15 minutes; application submissions are limited to 10 per 15 minutes.
* SQLite queries use prepared statements and bound parameters.
* Applicant records are not logged and no secrets are stored in the repository.

Run `npm test` inside `internship-api` to verify CRUD, application success/rejection, and security-header tests. Current result: 4 tests passed.

The API allows users to:

* View all internship opportunities
* View a specific internship
* Create new internship records
* Update existing internship records
* Delete internship records
* Search internships
* Filter internships by domain and mode
* Paginate large result sets
* Validate incoming data
* Handle errors with consistent HTTP status codes
* Store internship data persistently using SQLite

## 🎯 Objective

The main objective of this project is to build a predictable and reliable REST API with:

* Clear API contracts
* Persistent data storage
* Safe CRUD operations
* Input validation
* Consistent error handling
* Pagination and filtering
* Seed data for easy testing

## 🛠️ Technologies Used

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| Node.js           | JavaScript runtime              |
| Express.js        | REST API framework              |
| SQLite            | Persistent database             |
| better-sqlite3    | SQLite database driver          |
| express-validator | Request validation              |
| dotenv            | Environment variable management |
| cors              | Cross-Origin Resource Sharing   |
| Postman           | API testing                     |
| Git & GitHub      | Version control                 |

## 📂 Project Structure

```text
internship-api/
│
├── src/
│   ├── controllers/
│   │   └── internshipController.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   │
│   ├── routes/
│   │   └── internshipRoutes.js
│   │
│   ├── validators/
│   │   └── internshipValidator.js
│   │
│   ├── database.js
│   └── server.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── scripts/
│   └── seed.js
│
├── tests/
│   └── api-tests.md
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── internship-records-sample.json
```

## ⚙️ Features

### 1. Internship Listing

Retrieve all internship records through:

```http
GET /api/internships
```

### 2. Internship Details

Retrieve a specific internship using its ID:

```http
GET /api/internships/:id
```

Example:

```http
GET /api/internships/INT-101
```

### 3. Create Internship

Create a new internship using:

```http
POST /api/internships
```

Example request:

```json
{
  "id": "INT-106",
  "title": "Backend Development Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "India",
  "skills": [
    "Node.js",
    "Express.js",
    "MongoDB"
  ],
  "openings": 2
}
```

### 4. Update Internship

Update an existing internship:

```http
PUT /api/internships/:id
```

Example:

```http
PUT /api/internships/INT-106
```

### 5. Delete Internship

Delete an internship:

```http
DELETE /api/internships/:id
```

Example:

```http
DELETE /api/internships/INT-106
```

## 🔎 Search and Filtering

The API supports searching and filtering.

### Search

```http
GET /api/internships?search=JavaScript
```

### Filter by Domain

```http
GET /api/internships?domain=Full%20Stack%20Development
```

### Filter by Mode

```http
GET /api/internships?mode=Remote
```

### Combined Filters

```http
GET /api/internships?search=Node&mode=Remote
```

## 📄 Pagination

Pagination is supported using `page` and `limit`.

Example:

```http
GET /api/internships?page=1&limit=2
```

Example response:

```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 5,
    "totalPages": 3
  }
}
```

## 📦 API Response Format

Successful responses follow a predictable structure:

```json
{
  "status": "success",
  "data": {}
}
```

List responses additionally contain pagination information:

```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

Error responses follow a consistent structure:

```json
{
  "status": "error",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed."
  }
}
```

## 🛡️ Validation and Error Handling

The API validates incoming requests before processing them.

Validation includes:

* Required internship ID
* Internship title
* Valid domain
* Valid internship mode
* Location
* Skills array
* Non-negative number of openings
* Duplicate internship ID detection

The API uses appropriate HTTP status codes:

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Successful request    |
| 201         | Resource created      |
| 400         | Validation error      |
| 404         | Resource not found    |
| 409         | Duplicate resource    |
| 500         | Internal server error |

## 🗄️ Database

This project uses **SQLite** for persistent local data storage.

The database contains an `internships` table with fields including:

```text
id
title
domain
mode
location
skills
openings
created_at
updated_at
```

The database schema is available in:

```text
database/schema.sql
```

Seed data is available in:

```text
database/seed.sql
```

## 🌱 Seed Data

The project includes sample internship records such as:

* Frontend Intern
* API Engineering Intern
* UI/UX Intern
* Data Analyst Intern
* Security Operations Intern

The seed script initializes the SQLite database.

Run:

```bash
npm run seed
```

## 🚀 Installation

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Enter the project directory

```bash
cd internship-api
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
```

### Step 5: Initialize the database

```bash
npm run seed
```

### Step 6: Start the development server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

## ❤️ Health Check

To check whether the API is running:

```http
GET /health
```

Expected response:

```json
{
  "status": "success",
  "message": "Internship API is running"
}
```

## 🧪 Testing

The API can be tested using:

* Postman
* cURL
* Browser for GET requests

### Example cURL

Get all internships:

```bash
curl http://localhost:3000/api/internships
```

Get a specific internship:

```bash
curl http://localhost:3000/api/internships/INT-101
```

Create an internship:

```bash
curl -X POST http://localhost:3000/api/internships ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"INT-106\",\"title\":\"Backend Development Intern\",\"domain\":\"Full Stack Development\",\"mode\":\"Remote\",\"location\":\"India\",\"skills\":[\"Node.js\",\"Express.js\"],\"openings\":2}"
```

## 📮 API Endpoints

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/health`              | Check API status     |
| GET    | `/api/internships`     | Get all internships  |
| GET    | `/api/internships/:id` | Get internship by ID |
| POST   | `/api/internships`     | Create internship    |
| PUT    | `/api/internships/:id` | Update internship    |
| DELETE | `/api/internships/:id` | Delete internship    |
| POST   | `/api/applications`    | Submit an application |

## 📸 Screenshots

Add your project screenshots here after testing the API.

Recommended screenshots:

1. Project folder structure
2. Successful `npm run seed`
3. Running API server
4. Health check
5. GET all internships
6. Pagination response
7. Search/filter response
8. GET internship by ID
9. POST/create response
10. PUT/update response
11. DELETE response
12. Validation error
13. 404 not found response
14. GitHub repository

Example:

```text
screenshots/
├── server.png
├── health.png
├── get-all.png
├── pagination.png
├── create.png
├── update.png
├── delete.png
└── validation-error.png
```

## 🔐 Security

Sensitive environment files should not be committed to GitHub.

The `.gitignore` file excludes:

```text
node_modules/
.env
database/*.db
```

The project provides `.env.example` so other developers know which environment variables are required without exposing secrets.

## 📈 Future Improvements

Possible future improvements include:

* PostgreSQL database integration
* JWT authentication
* User registration and login
* Admin dashboard
* Advanced filtering
* API documentation using Swagger
* Deployment with a production database

## 🎓 Internship Task

**Task:** REST API and Persistent Data

**Project:** Internship Board REST API

**Purpose:** Build a predictable REST API with persistent storage, validation, pagination, CRUD operations, and consistent error handling.

## 👨‍💻 Author

**Your Name**

Full Stack Development Intern

---

## 📄 License

This project is created for educational and internship purposes.
