# Student Result Checker

A simple full-stack web application that lets you look up student results, add new student records, and view a pass/fail summary — all through a clean browser UI backed by a lightweight Node.js REST API.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [How to Run](#how-to-run)
- [API Reference](#api-reference)
- [Example Usage](#example-usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Student Result Checker is a beginner-friendly, full-stack application split into two parts:

- **Backend** – an Express.js REST API (Node.js) that manages student records in memory.
- **Frontend** – a plain HTML + JavaScript page that calls the API using `fetch()` and displays results in the browser.

The project is written with learning in mind; comments in the source code explain each concept step by step.

> **Note:** Data is currently stored **in-memory only**. All records are reset whenever the server restarts. A database integration is a planned future improvement (see TODOs below).

---

## Features

- 🔍 **Look up a student by ID** – returns name, subject, marks, grade, and pass/fail status.
- ➕ **Add a new student** – submit name, marks (0–100), and subject; server validates and stores the record.
- ✅ **View pass list** – see a summary (total / passed / failed) and a list of all passing students.
- 📋 **View all students** – list every student, optionally filtered by subject.
- 🎓 **Automatic grading** – marks are converted to a letter grade (A / B / C / D / F) by the server.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Node.js, Express.js 5, CORS       |
| Frontend | HTML5, CSS3, Vanilla JavaScript   |
| HTTP     | `fetch()` API (async/await)       |
| Runtime  | Node.js (any LTS version)         |

---

## Folder Structure

```
Student-Result-Checker/
├── backend/
│   ├── server.js          # Express API server (4 endpoints)
│   ├── package.json       # Node.js dependencies
│   ├── package-lock.json
│   └── test.http          # Manual HTTP request samples (VS Code REST Client)
├── frontend/
│   └── index.html         # Single-page UI (HTML + CSS + JS)
├── .gitignore
└── README.md
```

---

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 LTS or newer recommended)
- npm (bundled with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/HafizullahKhokhar1/Student-Result-Checker.git
cd Student-Result-Checker
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start the backend server

```bash
node server.js
# Output: Server chal raha hai — port 3000
```

The API will be available at `http://localhost:3000`.

### 4. Open the frontend

Open `frontend/index.html` directly in your browser:

```bash
# macOS
open ../frontend/index.html

# Linux
xdg-open ../frontend/index.html

# Windows
start ../frontend/index.html
```

> **Tip:** You can also use a simple static file server (e.g., VS Code Live Server extension) to serve `frontend/index.html` if you prefer.

---

## API Reference

All responses are JSON. The server runs on **port 3000** by default.

### Get all students

```
GET /api/students
GET /api/students?subject=Python   ← optional subject filter
```

**Response 200**
```json
{
  "total": 4,
  "students": [
    { "id": 1, "name": "Ali Hassan", "marks": 85, "subject": "Python" },
    ...
  ]
}
```

---

### Get a student by ID

```
GET /api/students/:id
```

**Response 200**
```json
{
  "student": { "id": 1, "name": "Ali Hassan", "marks": 85, "subject": "Python" },
  "grade": "A",
  "passed": true
}
```

**Response 404**
```json
{ "error": "Student nahi mila ID: 99" }
```

---

### Add a new student

```
POST /api/students
Content-Type: application/json
```

**Request body**
```json
{ "name": "Zara Ali", "marks": 72, "subject": "JavaScript" }
```

**Response 201**
```json
{
  "message": "Student add ho gaya!",
  "student": { "id": 5, "name": "Zara Ali", "marks": 72, "subject": "JavaScript" },
  "grade": "B"
}
```

**Response 400** (validation error)
```json
{ "error": "name, marks aur subject teeno chahiye" }
```

---

### Get pass list

```
GET /api/pass-list
```

**Response 200**
```json
{
  "summary": { "total": 4, "passed": 3, "failed": 1 },
  "passedStudents": [
    { "id": 1, "name": "Ali Hassan", "marks": 85, "subject": "Python" },
    ...
  ]
}
```

---

## Example Usage

### Look up student #1 with curl

```bash
curl http://localhost:3000/api/students/1
```

### Add a new student with curl

```bash
curl -X POST http://localhost:3000/api/students \
     -H "Content-Type: application/json" \
     -d '{"name":"Bilal Ahmed","marks":55,"subject":"Data Science"}'
```

### Filter by subject

```bash
curl "http://localhost:3000/api/students?subject=Python"
```

---

## Configuration

| Setting        | Default         | Where to change              |
|----------------|-----------------|------------------------------|
| Server port    | `3000`          | Last line of `backend/server.js` |
| API base URL   | `http://localhost:3000` | `const API` in `frontend/index.html` |
| Pass threshold | `40` marks      | Hardcoded in `server.js`     |

> **TODO:** Move configuration to environment variables (`.env` file) to make deployment easier.

---

## Grading Scale

| Marks      | Grade |
|------------|-------|
| 80 – 100   | A     |
| 60 – 79    | B     |
| 50 – 59    | C     |
| 40 – 49    | D     |
| 0 – 39     | F     |

Pass threshold: **40 marks or above**.

---

## Known Limitations / TODOs

- [ ] **No persistent storage** – data lives in a JavaScript array; adding a database (e.g., MongoDB or SQLite) would make records survive server restarts.
- [ ] **No authentication** – any user can add or view all student records.
- [ ] **No update/delete endpoints** – only read and create are implemented.
- [ ] **Port and API URL are hardcoded** – should be moved to environment variables.

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

Please keep PRs focused and include a clear description of what was changed and why.

---

## License

No license file is currently present in this repository. All rights are reserved by the author until a license is added.

> **TODO:** Add an open-source license (e.g., MIT) to clarify how others may use this code.