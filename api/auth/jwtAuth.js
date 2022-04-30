const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./jwtGenerator");
const jsonwebtoken = require("jsonwebtoken");

// TODO Verifiera korrekt epost

router.post("/register", async (req, res) => {
    try {
        // Deconstruct body
        const { username, email, password } = req.body;

        // Hasha lösenord
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);    

        // Kör store procedure för addUser
        const addUser = await pool.query("CALL add_user ($1, $2, $3)", [username, email, bcryptPassword]);

        // TODO Feedback om transaktionen misslyckades

        // Generera JWT för användaren
        const jwtToken = jwtGenerator(addUser.rows[0].email, addUser.rows[0].username);
        return res.json({jwtToken});
    } catch (err) {
        console.error(err.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        // Deconstruct body
        const { email, password } = req.body;

        // Hasha lösenord
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);    

        // Skicka info till databas för verifiering
        const user = await pool.query("SELECT username FROM Users WHERE email = $1 AND pwhash = $2", [email, bcryptPassword]);

        // Returnera unauthorized om ingen användare hittas
        if (user.rows.length !== 1){
            return res.status(401).json("Wrong username or password");
        }
            
        // Generera JWT för användaren
        const jwtToken = jwtGenerator(addUser.rows[0].email, addUser.rows[0].username);
        return res.json({jwtToken});        
    } catch (err) {
        console.error(err.message);
    }
});

router.get("/is-verified", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(403).send("Unable to authorize.");
    }
});

module.exports = router;