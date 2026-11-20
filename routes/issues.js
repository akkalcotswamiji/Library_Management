
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL ISSUED BOOKS
router.get("/", async (req, res) => {
    try {
        const [records] = await db.execute(`
            SELECT
                ib.issue_id,
                ib.student_id,
                s.name AS student_name,
                ib.book_id,
                b.title AS book_title,
                ib.issue_date,
                ib.due_date,
                ib.return_date,
                CASE
                    WHEN ib.status = 'Issued'
                    AND ib.due_date < CURDATE()
                    THEN 'Overdue'
                    ELSE ib.status
                END AS status
            FROM Issued_Books ib
            JOIN Students s ON ib.student_id = s.student_id
            JOIN Books b ON ib.book_id = b.book_id
            ORDER BY ib.issue_id DESC
        `);

        res.json(records);

    } catch (error) {
        console.error("FETCH ISSUES ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET STUDENTS
router.get("/students", async (req, res) => {
    try {
        const [students] = await db.execute(
            "SELECT student_id, name, email FROM Students ORDER BY name"
        );

        res.json(students);

    } catch (error) {
        console.error("STUDENT FETCH ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET AVAILABLE BOOKS
router.get("/books", async (req, res) => {
    try {
        const [books] = await db.execute(`
            SELECT book_id, title, author, available_quantity
            FROM Books
            WHERE available_quantity > 0
            ORDER BY title
        `);

        res.json(books);

    } catch (error) {
        console.error("BOOK FETCH ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// ISSUE BOOK
router.post("/", async (req, res) => {
    const { student_id, book_id, issue_date, due_date } = req.body;

    if (!student_id || !book_id || !issue_date || !due_date) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(issue_date) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(due_date) ||
        due_date < issue_date
    ) {
        return res.status(400).json({
            message: "Please enter valid dates."
        });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [students] = await connection.execute(
            "SELECT student_id FROM Students WHERE student_id = ?",
            [student_id]
        );

        if (!students.length) {
            await connection.rollback();
            return res.status(404).json({ message: "Student not found." });
        }

        const [books] = await connection.execute(
            `SELECT book_id, available_quantity
             FROM Books WHERE book_id = ? FOR UPDATE`,
            [book_id]
        );

        if (!books.length || books[0].available_quantity <= 0) {
            await connection.rollback();
            return res.status(409).json({
                message: "Book is unavailable."
            });
        }

        await connection.execute(
            `INSERT INTO Issued_Books
            (student_id, book_id, issue_date, due_date, status)
            VALUES (?, ?, ?, ?, 'Issued')`,
            [student_id, book_id, issue_date, due_date]
        );

        await connection.execute(
            `UPDATE Books
             SET available_quantity = available_quantity - 1
             WHERE book_id = ?`,
            [book_id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Book issued successfully!"
        });

    } catch (error) {
        if (connection) await connection.rollback();

        console.error("ISSUE ERROR:", error);
        res.status(500).json({ message: error.message });

    } finally {
        if (connection) connection.release();
    }
});

// RETURN BOOK
router.patch("/:id/return", async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [records] = await connection.execute(
            `SELECT issue_id, book_id, status
             FROM Issued_Books
             WHERE issue_id = ? FOR UPDATE`,
            [req.params.id]
        );

        if (!records.length) {
            await connection.rollback();
            return res.status(404).json({ message: "Issue not found." });
        }

        if (records[0].status === "Returned") {
            await connection.rollback();
            return res.status(409).json({
                message: "Book already returned."
            });
        }

        await connection.execute(
            `UPDATE Issued_Books
             SET return_date = CURDATE(), status = 'Returned'
             WHERE issue_id = ?`,
            [req.params.id]
        );

        await connection.execute(
            `UPDATE Books
             SET available_quantity = available_quantity + 1
             WHERE book_id = ?`,
            [records[0].book_id]
        );

        await connection.commit();

        res.json({ message: "Book returned successfully!" });

    } catch (error) {
        if (connection) await connection.rollback();

        console.error("RETURN ERROR:", error);
        res.status(500).json({ message: error.message });

    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;