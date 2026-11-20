
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET ADMIN PROFILE
router.get("/profile", async (req, res) => {
    try {
        const [admins] = await db.execute(
            `SELECT admin_id, full_name, username, email, phone
             FROM Admins
             WHERE admin_id = 1`
        );

        if (admins.length === 0) {
            return res.status(404).json({
                message: "Admin profile not found."
            });
        }

        res.json(admins[0]);

    } catch (error) {
        console.error("ADMIN PROFILE ERROR:", error);
        res.status(500).json({
            message: "Unable to load admin profile."
        });
    }
});

// UPDATE ADMIN PROFILE
router.put("/profile", async (req, res) => {
    try {
        const { full_name, username, email, phone } = req.body;

        if (!full_name || !username || !email) {
            return res.status(400).json({
                message: "Name, username and email are required."
            });
        }

        await db.execute(
            `UPDATE Admins
             SET full_name = ?, username = ?, email = ?, phone = ?
             WHERE admin_id = 1`,
            [
                full_name.trim(),
                username.trim(),
                email.trim().toLowerCase(),
                phone ? phone.trim() : null
            ]
        );

        res.json({
            message: "Profile updated successfully!"
        });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This username or email is already in use."
            });
        }

        res.status(500).json({
            message: "Unable to update profile."
        });
    }
});

// CHANGE ADMIN PASSWORD
router.patch("/password", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Both passwords are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must have at least 8 characters."
            });
        }

        const [admins] = await db.execute(
            "SELECT password FROM Admins WHERE admin_id = 1"
        );

        if (admins.length === 0) {
            return res.status(404).json({
                message: "Admin not found."
            });
        }

        const isValid = await bcrypt.compare(
            currentPassword,
            admins[0].password
        );

        if (!isValid) {
            return res.status(401).json({
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.execute(
            "UPDATE Admins SET password = ? WHERE admin_id = 1",
            [hashedPassword]
        );

        res.json({
            message: "Password changed successfully!"
        });

    } catch (error) {
        console.error("PASSWORD ERROR:", error);

        res.status(500).json({
            message: "Unable to change password."
        });
    }
});

module.exports = router;