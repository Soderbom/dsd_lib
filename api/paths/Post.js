const router = require("express").Router();
const connection = require("../db");

router.post("/loan_book", async (req, res) => {
    try {

        // Deconstruct body
        const { email, book_id } = req.body;

        // Gör ett query till databasen med stored procedure loan_book
        await connection.query("CALL loan_book(?, ?)", [email, book_id], (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                // [0] eftersom MySQL har en standard array inbakad i sin response
                res.status(200).json(result[0]);
            }
        });

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;