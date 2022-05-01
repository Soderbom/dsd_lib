const router = require("express").Router();
const connection = require("../db");

router.get("/all", async (req, res) => {
    try {
        await connection.query("SELECT * FROM books4days.Library", (err, result) => {
            if (err) {
                console.error(err.message);
            }
            res.json(result);
        });
        
        //res.json({books});
    } catch (err) {
        console.error(err.message);
    }
});

// GET böcker för en specifik användare

module.exports = router;