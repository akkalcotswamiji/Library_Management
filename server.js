
const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

// IMPORT ROUTES
const booksRoutes = require("./routes/books");
const studentsRoutes = require("./routes/students");
const issuesRoutes = require("./routes/issues");
const adminRoutes = require("./routes/admin");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, "public")));

// API ROUTES
app.use("/api/books", booksRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/admin", adminRoutes);


// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// DATABASE CONNECTION TEST
app.get("/api/test-db", async (req, res) => {
    try {
        const [books] = await db.execute(
            "SELECT COUNT(*) AS totalBooks FROM Books"
        );

        const [students] = await db.execute(
            "SELECT COUNT(*) AS totalStudents FROM Students"
        );

        const [issues] = await db.execute(
            "SELECT COUNT(*) AS totalIssues FROM Issued_Books"
        );

        res.json({
            message: "MySQL connected successfully!",
            totalBooks: books[0].totalBooks,
            totalStudents: students[0].totalStudents,
            totalIssues: issues[0].totalIssues
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Library Hub running on http://localhost:${PORT}`);
});