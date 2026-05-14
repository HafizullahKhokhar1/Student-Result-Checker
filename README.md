# Student Result Checker

A clean full-stack student result management app focused on practical backend API design and a simple, responsive UI.

## Highlights

- Full CRUD workflow for student records
- Pass/fail and grade-aware result handling
- Search and filter support for faster data lookup
- Stats endpoint for analytics-ready summaries
- Vercel-ready deployment setup for frontend + API

## Live Demo

- **Production:** https://studentresultchecker.vercel.app

## Tech Stack

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Deployment:** Vercel

## Project Structure

```text
api/
  [...all].js
  index.js
backend/
  server.js
  package.json
  test.http
frontend/
  index.html
docs/
  image.png
vercel.json
```

## Core Features

- Add student records (name, subject, marks)
- View all students in a table
- Search by student name or subject
- Filter by pass/fail status
- View individual student by ID
- Update and delete student records
- Health and stats endpoints for monitoring

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Service health check |
| GET | `/api/stats` | Student result analytics |
| GET | `/api/students` | List students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

## Run Locally

```bash
cd Student-Result-Checker
npm install
npm run start
```

Backend runs at: `http://localhost:3000`

Then open `frontend/index.html` in your browser (or use Live Server).

## Screenshot

![Student Result Checker Home](./docs/image.png)

## Deployment (Vercel)

This repo is already configured to deploy frontend and backend together on one Vercel domain.

1. Import repository: `HafizullahKhokhar1/Student-Result-Checker`
2. Branch: `main`
3. Framework Preset: `Other`
4. Root Directory: `./`
5. Install Command: default (`npm install`)
6. Build Command: leave empty
7. Output Directory: leave empty
8. Deploy

After deployment, verify:

- `https://your-project.vercel.app/`
- `https://your-project.vercel.app/api/health`

## Notes

- Data is currently stored in memory (resets when server restarts).
- For persistence, you can connect MongoDB or PostgreSQL next.
