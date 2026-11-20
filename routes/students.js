const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET ALL STUDENTS
router.get("/", async (req, res) => {
    try {
        const [students] = await db.execute(
            `SELECT student_id, name, email, phone, created_at
             FROM Students
             ORDER BY student_id DESC`
        );

        res.json(students);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch students" });
    }
});

// REGISTER STUDENT
router.post("/", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const [existing] = await db.execute(
            "SELECT student_id FROM Students WHERE email = ?",
            [cleanEmail]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            `INSERT INTO Students (name, email, password, phone)
             VALUES (?, ?, ?, ?)`,
            [
                name.trim(),
                cleanEmail,
                hashedPassword,
                phone ? phone.trim() : null
            ]
        );

        res.status(201).json({
            message: "Student registered successfully!"
        });

    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        res.status(500).json({
            message: "Unable to register student"
        });
    }
});

module.exports = router;