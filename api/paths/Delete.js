const router = require("express").Router();
const connection = require("../db");

// TODO Testa så att koden faktiskt fungerar och gör ändringar om det behövs

router.delete("/return_book", async (req, res) => {
    try {

        const { email, book_id } = req.body;

        await connection.query("CALL return_book(?, ?)", [email, book_id], (err, result) => {
            if (err) {
                console.error(err.message);
            }
            res.json(result);
        });
        
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;