const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// ===== DATA (baad mein yeh database mein jayega) =====
let students = [
  { id: 1, name: "Ali Hassan",      marks: 85, subject: "Python" },
  { id: 2, name: "Sara Khan",       marks: 42, subject: "JavaScript" },
  { id: 3, name: "Ahmed Raza",      marks: 91, subject: "Data Science" },
  { id: 4, name: "Fatima Malik",    marks: 33, subject: "Python" },
]

// ===== HELPER FUNCTION =====
// Python mein yeh def hota, JS mein function
function getGrade(marks) {
  if (marks >= 80) return "A"
  if (marks >= 60) return "B"
  if (marks >= 50) return "C"
  if (marks >= 40) return "D"
  return "F"
}

// ===== ENDPOINT 1 — Saare students =====
// GET /api/students
app.get('/api/students', (req, res) => {
  // req.body — GET mein body nahi hoti
  // req.query — filter ke liye use kar sakte hain
  
  const subject = req.query.subject  // ?subject=Python

  if (subject) {
    const filtered = students.filter(s => s.subject === subject)
    return res.status(200).json({
      total: filtered.length,
      students: filtered
    })
  }

  res.status(200).json({
    total: students.length,
    students: students
  })
})

// ===== ENDPOINT 2 — Ek student ID se =====
// GET /api/students/1
app.get('/api/students/:id', (req, res) => {
  // req.params.id — URL se aaya
  const id = parseInt(req.params.id)
  const student = students.find(s => s.id === id)

  if (!student) {
    // 404 — yeh record exist nahi karta
    return res.status(404).json({ error: "Student nahi mila ID: " + id })
  }

  res.status(200).json({
    student: student,
    grade: getGrade(student.marks),
    passed: student.marks >= 40
  })
})

// ===== ENDPOINT 3 — Naya student add karo =====
// POST /api/students
app.post('/api/students', (req, res) => {
  // req.body — POST ka data yahan hota hai
  const { name, marks, subject } = req.body

  // Validation — agar data missing ho
  if (!name || marks === undefined || !subject) {
    return res.status(400).json({
      error: "name, marks aur subject teeno chahiye"
    })
  }

  if (marks < 0 || marks > 100) {
    return res.status(400).json({
      error: "Marks 0 aur 100 ke beech hone chahiye"
    })
  }

  const newStudent = {
    id: students.length + 1,
    name: name,
    marks: marks,
    subject: subject
  }

  students.push(newStudent)

  // 201 — naya record bana
  res.status(201).json({
    message: "Student add ho gaya!",
    student: newStudent,
    grade: getGrade(marks)
  })
})

// ===== ENDPOINT 4 — Sirf passing students =====
// GET /api/pass-list
app.get('/api/pass-list', (req, res) => {
  const passed = students.filter(s => s.marks >= 40)
  const failed = students.filter(s => s.marks < 40)

  res.status(200).json({
    summary: {
      total: students.length,
      passed: passed.length,
      failed: failed.length
    },
    passedStudents: passed
  })
})

app.listen(3000, () => {
  console.log('Server chal raha hai — port 3000')
})