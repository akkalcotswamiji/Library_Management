
const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", async (req, res) => {
    try {
        const [books] = await db.execute(
            "SELECT * FROM Books"
        );

        res.json(books);

    } catch (error) {
        console.error("BOOKS API ERROR:", error);

        res.status(500).json({
            message: "Unable to fetch books",
            error: error.message
        });
    }
});

module.exports = router;
