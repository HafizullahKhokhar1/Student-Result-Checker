const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = Number(process.env.PORT) || 3000
const PASSING_MARKS = 40

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://hafizullahkhokhar1.github.io'
]

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`Origin not allowed by CORS: ${origin}`))
  }
}))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'frontend')))

let students = [
  { id: 1, fullName: 'Ali Hassan', marks: 85, subject: 'Mathematics' },
  { id: 2, fullName: 'Sara Khan', marks: 42, subject: 'Computer Science' },
  { id: 3, fullName: 'Ahmed Raza', marks: 91, subject: 'Physics' },
  { id: 4, fullName: 'Fatima Malik', marks: 33, subject: 'Chemistry' }
]

function getGrade(marks) {
  if (marks >= 85) return 'A'
  if (marks >= 70) return 'B'
  if (marks >= 60) return 'C'
  if (marks >= 50) return 'D'
  return 'F'
}

function buildStudentView(student) {
  return {
    ...student,
    grade: getGrade(student.marks),
    passed: student.marks >= PASSING_MARKS
  }
}

function validateStudentPayload(payload) {
  const errors = []

  if (!payload || typeof payload !== 'object') {
    return ['Body must be a valid JSON object.']
  }

  if (!payload.fullName || typeof payload.fullName !== 'string' || payload.fullName.trim().length < 3) {
    errors.push('fullName is required and must be at least 3 characters long.')
  }

  if (typeof payload.subject !== 'string' || payload.subject.trim().length < 2) {
    errors.push('subject is required and must be at least 2 characters long.')
  }

  if (typeof payload.marks !== 'number' || Number.isNaN(payload.marks)) {
    errors.push('marks is required and must be a valid number.')
  } else if (payload.marks < 0 || payload.marks > 100) {
    errors.push('marks must be between 0 and 100.')
  }

  return errors
}

function nextStudentId() {
  if (students.length === 0) return 1
  return Math.max(...students.map(student => student.id)) + 1
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Result Checker API is healthy.',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/stats', (req, res) => {
  const passed = students.filter(student => student.marks >= PASSING_MARKS).length
  const failed = students.length - passed
  const averageMarks = students.length
    ? Number((students.reduce((sum, student) => sum + student.marks, 0) / students.length).toFixed(2))
    : 0

  res.status(200).json({
    success: true,
    data: {
      total: students.length,
      passed,
      failed,
      averageMarks,
      passRate: students.length ? Number(((passed / students.length) * 100).toFixed(2)) : 0
    }
  })
})

app.get('/api/students', (req, res) => {
  const { subject, status, search } = req.query

  let result = students.map(buildStudentView)

  if (subject) {
    const subjectValue = String(subject).trim().toLowerCase()
    result = result.filter(student => student.subject.toLowerCase() === subjectValue)
  }

  if (status === 'pass') {
    result = result.filter(student => student.passed)
  }

  if (status === 'fail') {
    result = result.filter(student => !student.passed)
  }

  if (search) {
    const searchValue = String(search).trim().toLowerCase()
    result = result.filter(student =>
      student.fullName.toLowerCase().includes(searchValue) ||
      student.subject.toLowerCase().includes(searchValue)
    )
  }

  res.status(200).json({
    success: true,
    total: result.length,
    data: result
  })
})

app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Student id must be a positive integer.'
    })
  }

  const student = students.find(item => item.id === id)

  if (!student) {
    return res.status(404).json({
      success: false,
      error: `Student not found for id ${id}.`
    })
  }

  return res.status(200).json({
    success: true,
    data: buildStudentView(student)
  })
})

app.post('/api/students', (req, res) => {
  const validationErrors = validateStudentPayload(req.body)

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: validationErrors
    })
  }

  const student = {
    id: nextStudentId(),
    fullName: req.body.fullName.trim(),
    marks: Number(req.body.marks),
    subject: req.body.subject.trim()
  }

  students.push(student)

  return res.status(201).json({
    success: true,
    message: 'Student created successfully.',
    data: buildStudentView(student)
  })
})

app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Student id must be a positive integer.'
    })
  }

  const studentIndex = students.findIndex(item => item.id === id)

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Student not found for id ${id}.`
    })
  }

  const validationErrors = validateStudentPayload(req.body)

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: validationErrors
    })
  }

  students[studentIndex] = {
    id,
    fullName: req.body.fullName.trim(),
    marks: Number(req.body.marks),
    subject: req.body.subject.trim()
  }

  return res.status(200).json({
    success: true,
    message: 'Student updated successfully.',
    data: buildStudentView(students[studentIndex])
  })
})

app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Student id must be a positive integer.'
    })
  }

  const studentIndex = students.findIndex(item => item.id === id)

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Student not found for id ${id}.`
    })
  }

  const [removedStudent] = students.splice(studentIndex, 1)

  return res.status(200).json({
    success: true,
    message: 'Student deleted successfully.',
    data: buildStudentView(removedStudent)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})

app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('Origin not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      error: err.message
    })
  }

  return res.status(500).json({
    success: false,
    error: 'Unexpected server error.'
  })
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Student Result Checker API running on port ${PORT}`)
  })
}

module.exports = app