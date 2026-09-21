# 🚀 Responsive Internship Board

A full-stack internship listing and application platform built with **HTML, CSS, JavaScript, Node.js, Express.js, and SQLite**.

The project provides a responsive frontend for discovering internship opportunities and a RESTful backend for managing internship records, searching and filtering opportunities, pagination, validation, and internship applications with persistent database storage.

---

## 📌 Project Overview

The **Responsive Internship Board** is a full-stack web application designed to provide a simple and structured platform for students and job seekers to discover internship opportunities.

The project combines:

* A responsive and accessible web interface
* Dynamic internship data loading
* RESTful API architecture
* SQLite persistent storage
* Complete CRUD operations
* Search and filtering
* Pagination
* Request validation
* Application submission
* Duplicate application protection
* Secure HTTP headers
* API rate limiting
* Consistent API response and error formats

The frontend communicates with the backend through REST API endpoints, allowing internship data to be dynamically loaded instead of being hard-coded into the user interface.

---

## 🎯 Project Objectives

The main objectives of this project are:

1. Build a responsive internship discovery platform.
2. Implement a RESTful backend using Node.js and Express.js.
3. Store internship records persistently using SQLite.
4. Implement complete CRUD operations.
5. Provide search and filtering functionality.
6. Implement pagination for internship records.
7. Validate API requests before database operations.
8. Provide consistent success and error responses.
9. Allow users to submit internship applications.
10. Prevent duplicate applications.
11. Apply basic API security practices.
12. Create a maintainable full-stack project structure.

---

# ✨ Key Features

## 🌐 Frontend Features

### Internship Listing

The frontend retrieves internship records dynamically from the backend API.

```http
GET /api/internships
```

Internship information can include:

* Internship ID
* Title
* Domain
* Mode
* Location
* Skills
* Number of openings

---

### 🔎 Search

Users can search internship opportunities using keywords.

Example:

```http
GET /api/internships?search=JavaScript
```

Search can be used to find relevant internships based on available internship information.

---

### 🏷️ Filtering

Internships can be filtered by:

* Domain
* Internship mode

Example:

```http
GET /api/internships?domain=Full%20Stack%20Development
```

Remote internships can also be filtered:

```http
GET /api/internships?mode=Remote
```

Multiple filters can be combined:

```http
GET /api/internships?search=Node&mode=Remote
```

---

### 📄 Pagination

The API supports pagination using `page` and `limit`.

Example:

```http
GET /api/internships?page=1&limit=10
```

A paginated response contains information such as:

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

---

### 📋 Internship Details

A specific internship can be retrieved using its unique ID.

```http
GET /api/internships/:id
```

Example:

```http
GET /api/internships/INT-101
```

---

### 📝 Internship Application

Users can submit an application for an internship through:

```http
POST /api/applications
```

Example request:

```json
{
  "internshipId": "INT-101",
  "name": "Asha Student",
  "email": "asha@example.com",
  "portfolio": "https://example.com/work",
  "message": "I am excited to learn through this internship."
}
```

The backend validates the application before storing it.

---

### 🔄 Loading, Empty and Error States

The frontend handles different API states, including:

* Loading state
* Successful data loading
* Empty internship results
* API errors
* Retry functionality

This prevents the interface from becoming unusable when the API is unavailable or returns no records.

---

# 🔧 Backend Features

## CRUD Operations

The REST API supports complete CRUD functionality.

### Create

```http
POST /api/internships
```

Example:

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

### Read

Get all internships:

```http
GET /api/internships
```

Get one internship:

```http
GET /api/internships/:id
```

### Update

```http
PUT /api/internships/:id
```

### Delete

```http
DELETE /api/internships/:id
```

---

# 🗄️ Database

The application uses **SQLite** as its persistent database.

The main internship table contains fields such as:

| Field        | Description                   |
| ------------ | ----------------------------- |
| `id`         | Unique internship identifier  |
| `title`      | Internship title              |
| `domain`     | Internship domain             |
| `mode`       | Remote, hybrid, or other mode |
| `location`   | Internship location           |
| `skills`     | Required skills               |
| `openings`   | Number of available positions |
| `created_at` | Record creation timestamp     |
| `updated_at` | Last update timestamp         |

SQLite provides persistent local storage so internship records are not dependent on temporary in-memory data.

---

# 🌱 Seed Data

The project includes seed data for quickly initializing the database.

Example internship categories include:

* Frontend Intern
* API Engineering Intern
* UI/UX Intern
* Data Analyst Intern
* Security Operations Intern

Run the seed command:

```bash
npm run seed
```

---

# 🛡️ Validation

Incoming API requests are validated before database operations.

Validation includes:

* Required internship ID
* Internship title
* Domain
* Internship mode
* Location
* Skills array
* Non-negative number of openings
* Duplicate internship ID detection
* Valid applicant name
* Valid email address
* Valid portfolio URL
* Application message validation
* Valid internship ID during application

Invalid requests are rejected with appropriate HTTP status codes and structured error responses.

---

# 🔐 Security

The backend includes several security measures.

### Helmet

Helmet is used to configure secure HTTP response headers.

### Rate Limiting

API requests are rate limited to reduce excessive requests.

Application submissions have a stricter rate limit.

### Prepared Statements

SQLite operations use prepared statements and bound parameters to reduce SQL injection risks.

### CORS

Cross-Origin Resource Sharing is configured for frontend/API communication.

### Environment Variables

Sensitive configuration is managed through environment variables.

The `.env` file should not be committed to GitHub.

---

# 📦 Technologies Used

| Technology         | Purpose                                    |
| ------------------ | ------------------------------------------ |
| HTML5              | Frontend structure                         |
| CSS3               | Responsive styling and UI                  |
| JavaScript         | Frontend interaction and API communication |
| Node.js            | Backend JavaScript runtime                 |
| Express.js         | REST API framework                         |
| SQLite             | Persistent database                        |
| better-sqlite3     | SQLite database driver                     |
| express-validator  | Request validation                         |
| express-rate-limit | API rate limiting                          |
| Helmet             | Security headers                           |
| CORS               | Cross-origin API communication             |
| dotenv             | Environment configuration                  |
| Nodemon            | Development server                         |
| Postman            | API testing                                |
| Git                | Version control                            |
| GitHub             | Source code hosting                        |

---

# 🏗️ Project Architecture

The application follows a client-server architecture:

```text
┌──────────────────────────────┐
│       Frontend Browser       │
│                              │
│ HTML + CSS + JavaScript      │
└──────────────┬───────────────┘
               │
               │ HTTP / REST API
               ▼
┌──────────────────────────────┐
│       Express.js Server      │
│                              │
│ Routes                       │
│ Validation                   │
│ Controllers / Logic          │
│ Error Handling               │
│ Security Middleware          │
└──────────────┬───────────────┘
               │
               │ SQL Queries
               ▼
┌──────────────────────────────┐
│           SQLite             │
│                              │
│ Internship Records           │
│ Application Records          │
└──────────────────────────────┘
```

---

# 📂 Project Structure

```text
responsive-internship-board/
│
├── index.html
├── style.css
├── script.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
│
└── internship-api/
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
    │
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── package-lock.json
```

---

# 🔗 API Endpoints

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/health`              | Check API status              |
| GET    | `/api/internships`     | Get all internships           |
| GET    | `/api/internships/:id` | Get internship by ID          |
| POST   | `/api/internships`     | Create internship             |
| PUT    | `/api/internships/:id` | Update internship             |
| DELETE | `/api/internships/:id` | Delete internship             |
| POST   | `/api/applications`    | Submit internship application |

---

# 📦 API Response Format

## Successful Response

```json
{
  "status": "success",
  "data": {}
}
```

For list responses:

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

## Error Response

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

---

# 📊 HTTP Status Codes

| Status Code | Meaning                        |
| ----------- | ------------------------------ |
| `200`       | Successful request             |
| `201`       | Resource created               |
| `400`       | Validation error / bad request |
| `404`       | Resource not found             |
| `409`       | Duplicate resource             |
| `500`       | Internal server error          |

---

# ❤️ Health Check

The API provides a health-check endpoint:

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

This endpoint can be used to quickly verify whether the backend server is running.

---

# 🧪 Testing

The backend can be tested using:

* Postman
* cURL
* Browser
* Node.js test runner

Run the automated tests from the API directory:

```bash
npm test
```

The test suite covers important API behavior including CRUD operations, application validation, application submission, rejection cases, and security headers.

---

# 🚀 Installation and Setup

## Prerequisites

Install the following:

* Node.js 18 or higher
* npm
* Git
* A modern web browser
* Postman (optional)

---

## 1. Clone the Repository

```bash
git clone https://github.com/hpgohil2006-cmd/responsive-internship-board.git
```

---

## 2. Open the Project

```bash
cd responsive-internship-board
```

---

## 3. Open the API Directory

```bash
cd internship-api
```

---

## 4. Install Dependencies

```bash
npm install
```

---

## 5. Configure Environment Variables

Create a `.env` file inside `internship-api`.

Example:

```env
PORT=3000
NODE_ENV=development
```

Do not commit your actual `.env` file to GitHub.

---

## 6. Initialize Seed Data

```bash
npm run seed
```

---

## 7. Start the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## 8. Start the Production Server

```bash
npm start
```

---

# 🌐 Frontend Integration

The frontend communicates with the REST API using JavaScript.

The main data flow is:

```text
User opens Internship Board
          ↓
Frontend JavaScript sends API request
          ↓
GET /api/internships
          ↓
Express.js processes request
          ↓
SQLite returns internship records
          ↓
JSON response sent to frontend
          ↓
JavaScript renders internship cards
```

This architecture keeps the frontend presentation layer separate from backend business logic and persistent data storage.

---

# 🔍 Example API Requests

### Get all internships

```bash
curl http://localhost:3000/api/internships
```

### Get a specific internship

```bash
curl http://localhost:3000/api/internships/INT-101
```

### Search internships

```bash
curl "http://localhost:3000/api/internships?search=JavaScript"
```

### Filter remote internships

```bash
curl "http://localhost:3000/api/internships?mode=Remote"
```

### Pagination

```bash
curl "http://localhost:3000/api/internships?page=1&limit=10"
```

---

# 📸 Screenshots

For project documentation, the following screenshots can be added:

```text
screenshots/
├── homepage.png
├── internship-list.png
├── search.png
├── filter.png
├── application-form.png
├── api-server.png
├── health-check.png
├── get-internships.png
├── pagination.png
├── create-internship.png
├── update-internship.png
├── delete-internship.png
├── validation-error.png
└── github-repository.png
```

Example Markdown:

```markdown
![Internship Board](screenshots/homepage.png)
```

---

# 🔄 Development Workflow

The recommended development workflow is:

```text
1. Modify frontend/backend code
          ↓
2. Run application locally
          ↓
3. Test API endpoints
          ↓
4. Verify frontend integration
          ↓
5. Run automated tests
          ↓
6. Check git status
          ↓
7. Commit changes
          ↓
8. Push to GitHub
```

Git commands:

```bash
git add .
git commit -m "Update internship board"
git push origin main
```

---

# 📈 Future Enhancements

Potential improvements include:

* PostgreSQL production database
* JWT-based authentication
* User registration and login
* Admin dashboard
* Internship bookmarking
* Advanced search
* Sorting by date or relevance
* Email notifications
* Resume upload
* Application status tracking
* Swagger/OpenAPI documentation
* Automated CI/CD pipeline
* Production cloud deployment
* Analytics dashboard

---

# 🎓 Internship Task

**Internship:** Full Stack Development Internship

**Task:** REST API and Persistent Data

**Project:** Responsive Internship Board

### Task Requirements Implemented

* RESTful API
* Node.js and Express.js
* Persistent SQLite storage
* CRUD operations
* Request validation
* Search
* Filtering
* Pagination
* Seed data
* Consistent API responses
* Error handling
* Frontend/API integration
* Application submission
* Security middleware

---

# 👨‍💻 Author

**Harshvardhansinh Gohil**

Full Stack Development Intern

GitHub:

https://github.com/hpgohil2006-cmd

---

# 📄 License

This project is created for educational and internship purposes.

---

## ⭐ Project Summary

The **Responsive Internship Board** demonstrates a practical full-stack development workflow by combining a responsive frontend with a structured REST API and persistent SQLite database.

It demonstrates practical knowledge of:

**Frontend Development → REST API Development → Database Management → Validation → Security → Testing → Git/GitHub**

The project is designed to be maintainable, extensible, and suitable as a foundation for a production-style internship management platform.
