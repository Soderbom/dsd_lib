const router = require("express").Router();
const connection = require("../db");
const authorization = require("../auth/authorization");

router.get("/info", authorization, async (req, res) => {
    try {
        const email = req.email;
        const username = req.username;

        return {username, email}
    } catch (err) {
        console.error(err.message);
    }
});

router.get("/all", async (req, res) => {
    try {
        await connection.query("SELECT id, title, author, published, stock, coverurl FROM books4days.Library", (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get("/user_loans/:email", async (req, res) => {
    try {
        const { email } = req.params;
        await connection.query("CALL get_loans(?)", [email], (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                if (result[0].length >= 1) {
                    res.status(200).json(result[0]);
                } else {
                    res.status(404).json([])
                }
            }
        });
    } catch (err) {
        console.error(err.message);
    }
});


module.exports = router;