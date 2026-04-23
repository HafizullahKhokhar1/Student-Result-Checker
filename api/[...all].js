let students = [
	{ id: 1, fullName: 'Ali Hassan', marks: 85, subject: 'Mathematics' },
	{ id: 2, fullName: 'Sara Khan', marks: 42, subject: 'Computer Science' },
	{ id: 3, fullName: 'Ahmed Raza', marks: 91, subject: 'Physics' },
	{ id: 4, fullName: 'Fatima Malik', marks: 33, subject: 'Chemistry' }
]

const PASSING_MARKS = 40

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

function nextStudentId() {
	if (students.length === 0) return 1
	return Math.max(...students.map(student => student.id)) + 1
}

function sendJson(res, statusCode, payload) {
	res.statusCode = statusCode
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(payload))
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let data = ''
		req.on('data', chunk => {
			data += chunk
		})
		req.on('end', () => {
			if (!data) {
				resolve({})
				return
			}
			try {
				resolve(JSON.parse(data))
			} catch (error) {
				reject(new Error('Invalid JSON body.'))
			}
		})
		req.on('error', reject)
	})
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

module.exports = async (req, res) => {
	try {
		const url = new URL(req.url, 'http://localhost')
		const path = url.pathname
		const method = req.method || 'GET'

		if (path === '/api/health' && method === 'GET') {
			return sendJson(res, 200, {
				success: true,
				message: 'Student Result Checker API is healthy.',
				timestamp: new Date().toISOString()
			})
		}

		if (path === '/api/stats' && method === 'GET') {
			const passed = students.filter(student => student.marks >= PASSING_MARKS).length
			const failed = students.length - passed
			const averageMarks = students.length
				? Number((students.reduce((sum, student) => sum + student.marks, 0) / students.length).toFixed(2))
				: 0

			return sendJson(res, 200, {
				success: true,
				data: {
					total: students.length,
					passed,
					failed,
					averageMarks,
					passRate: students.length ? Number(((passed / students.length) * 100).toFixed(2)) : 0
				}
			})
		}

		if (path === '/api/students' && method === 'GET') {
			const subject = url.searchParams.get('subject')
			const status = url.searchParams.get('status')
			const search = url.searchParams.get('search')

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

			return sendJson(res, 200, {
				success: true,
				total: result.length,
				data: result
			})
		}

		if (path === '/api/students' && method === 'POST') {
			const payload = await readBody(req)
			const validationErrors = validateStudentPayload(payload)

			if (validationErrors.length > 0) {
				return sendJson(res, 400, {
					success: false,
					errors: validationErrors
				})
			}

			const student = {
				id: nextStudentId(),
				fullName: payload.fullName.trim(),
				marks: Number(payload.marks),
				subject: payload.subject.trim()
			}

			students.push(student)

			return sendJson(res, 201, {
				success: true,
				message: 'Student created successfully.',
				data: buildStudentView(student)
			})
		}

		const studentMatch = path.match(/^\/api\/students\/(\d+)$/)

		if (studentMatch) {
			const id = Number(studentMatch[1])
			const studentIndex = students.findIndex(item => item.id === id)

			if (studentIndex === -1) {
				return sendJson(res, 404, {
					success: false,
					error: `Student not found for id ${id}.`
				})
			}

			if (method === 'GET') {
				return sendJson(res, 200, {
					success: true,
					data: buildStudentView(students[studentIndex])
				})
			}

			if (method === 'PUT') {
				const payload = await readBody(req)
				const validationErrors = validateStudentPayload(payload)

				if (validationErrors.length > 0) {
					return sendJson(res, 400, {
						success: false,
						errors: validationErrors
					})
				}

				students[studentIndex] = {
					id,
					fullName: payload.fullName.trim(),
					marks: Number(payload.marks),
					subject: payload.subject.trim()
				}

				return sendJson(res, 200, {
					success: true,
					message: 'Student updated successfully.',
					data: buildStudentView(students[studentIndex])
				})
			}

			if (method === 'DELETE') {
				const [removedStudent] = students.splice(studentIndex, 1)
				return sendJson(res, 200, {
					success: true,
					message: 'Student deleted successfully.',
					data: buildStudentView(removedStudent)
				})
			}
		}

		return sendJson(res, 404, {
			success: false,
			error: 'Route not found.'
		})
	} catch (error) {
		return sendJson(res, 500, {
			success: false,
			error: 'Unexpected server error.'
		})
	}
}
