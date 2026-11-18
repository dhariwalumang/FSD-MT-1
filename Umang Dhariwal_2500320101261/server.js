const express = require("express");
const app = express();

app.use(express.json());

// Initial Data
let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },
    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },
    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

// Generate Unique ID
function generateId() {
    return Math.max(...enrollments.map(e => e.id), 600) + 1;
}

// Validation Function
function validData(data) {
    return (
        typeof data.studentName === "string" &&
        data.studentName.trim() !== "" &&

        typeof data.courseCode === "string" &&
        data.courseCode.trim() !== "" &&

        typeof data.courseName === "string" &&
        data.courseName.trim() !== "" &&

        Number.isInteger(data.semester) &&
        data.semester > 0 &&

        typeof data.attendance === "number" &&
        Number.isFinite(data.attendance) &&
        data.attendance >= 0 &&
        data.attendance <= 100
    );
}

// 1. GET ALL ENROLLMENTS
app.get("/api/enrollments", (req, res) => {
    res.status(200).json(enrollments);
});

// 2. POST NEW ENROLLMENT
app.post("/api/enrollments", (req, res) => {
    const data = req.body;

    if (!validData(data)) {
        return res.status(400).json({
            message: "Invalid enrollment data"
        });
    }

    const newEnrollment = {
        id: generateId(),
        ...data
    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);
});

// 3. GET LOW ATTENDANCE
app.get("/api/enrollments/low-attendance", (req, res) => {
    const result = enrollments.filter(e => e.attendance < 75);

    res.status(200).json(result);
});

// 4. FILTER BY SEMESTER
app.get("/api/enrollments/filter", (req, res) => {
    const semester = Number(req.query.semester);

    if (!req.query.semester ||
        !Number.isInteger(semester) ||
        semester <= 0) {

        return res.status(400).json({
            message: "Valid semester is required"
        });
    }

    const result = enrollments.filter(e => e.semester === semester);

    res.status(200).json(result);
});

// 5. GET ENROLLMENT BY ID
app.get("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const enrollment = enrollments.find(e => e.id === id);

    if (!enrollment) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    res.status(200).json(enrollment);
});

// 6. UPDATE ENROLLMENT
app.put("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    if (!validData(req.body)) {
        return res.status(400).json({
            message: "Invalid enrollment data"
        });
    }

    enrollments[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(enrollments[index]);
});

// 7. DELETE ENROLLMENT
app.delete("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: "Enrollment deleted successfully"
    });
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});