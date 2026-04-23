# Student Result Checker

A complete student marks checker website with:

- A structured Express backend API
- A responsive frontend dashboard
- Student CRUD and filtering
- Stats summary with grades and pass or fail status

## Features

- Add student with full name, subject, and marks
- View all students in a table
- Filter by pass or fail status and search by name or subject
- Lookup one student by ID
- Delete student records
- Health and analytics endpoints

## Tech Stack

- Backend: Node.js, Express, CORS
- Frontend: HTML, CSS, vanilla JavaScript

## Project Structure

- backend/server.js
- backend/package.json
- backend/test.http
- frontend/index.html

## Run Locally

1. Go to backend folder.
2. Install dependencies.
3. Start backend.
4. Open frontend/index.html in browser or serve it with Live Server.

Commands:

PowerShell

cd backend
npm install
npm run start

Backend default URL: http://localhost:3000

## API Endpoints

- GET /api/health
- GET /api/stats
- GET /api/students
- GET /api/students/:id
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

## Deployment Plan

To make this live publicly, deploy backend and frontend separately:

1. Deploy backend on Render or Railway.
2. Deploy frontend on GitHub Pages.
3. In the frontend page, set API URL input to your deployed backend URL and save.

### Deploy Backend on Render

1. Create a new Web Service from this repository.
2. Set Root Directory to backend.
3. Build command: npm install
4. Start command: npm start
5. Optional env variable: CORS_ORIGINS with your GitHub Pages origin.

Example CORS_ORIGINS value:

https://hafizullahkhokhar1.github.io

### Deploy Frontend on GitHub Pages

1. Open repository settings on GitHub.
2. Go to Pages.
3. Source: Deploy from branch.
4. Branch: main
5. Folder: /frontend
6. Save and wait for deployment URL.

After opening the live page, paste your backend URL in API Base URL field and click Save API URL.

## Notes

- Current data is stored in memory and resets on server restart.
- You can later connect MongoDB or PostgreSQL for persistent data.