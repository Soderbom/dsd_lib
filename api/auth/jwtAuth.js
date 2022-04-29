const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./jwtGenerator");
const jsonwebtoken = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    try {
        // TODO Implementera
        // Ta emot information från body

        // TODO Packetera till MySQL transaktion???
            // Kontrollera om användaren existerar OBS kräver API route

            // Hasha lösenord
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);    

            // Skicka query för att lägga till

        // Generera JWT för användaren
    } catch (err) {
        console.error(err.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        // TODO Implementera
        // Ta emot information från body

        // Hasha lösenord

        // Skicka info till databas för verifiering
        // OBS min tidigare version fick lösenordet skickat till sig, men jag misstänker att detta kan leda till en säkerhetsrisk

        // Generera JWT för användaren
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