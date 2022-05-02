const router = require("express").Router();
const connection = require("../db");

router.get("/get_specific_user", async (req, res) => {
    try {
        const { email } = req.body;
        await connection.query("CALL get_loans(?)", [email], (err, result) => {
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