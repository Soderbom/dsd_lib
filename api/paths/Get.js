const router = require("express").Router();
const connection = require("../db");

router.get("/all", async (req, res) => {
    try {
        await connection.query("SELECT id, title, author, published, stock, coverurl FROM books4days.Library", (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                res.status(200).json(result);
            }
        });
        
        //res.json({books});
    } catch (err) {
        console.error(err.message);
    }
});

router.get("/user_loans", async (req, res) => {
    try {
        const { email } = req.body;
        await connection.query("CALL get_loans(?)", [email], (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result[0].length)
                if (result[0].length >= 1) {
                    res.status(200).json(result[0]);
                } else {
                    res.status(404).json([])
                }
            }
        });
        
        //res.json({books});
    } catch (err) {
        console.error(err.message);
    }
});


module.exports = router;