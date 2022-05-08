const router = require("express").Router();
const conn = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./jwtGenerator");
const authorization = require("./authorization");

// TODO Verifiera korrekt epost

router.post("/register", async (req, res) => {
    
    try {        
        // Deconstruct body
        const { email, username, password } = req.body;

        // Hasha lösenord
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
        // Kör store procedure för addUser     

        await conn.query("CALL add_user(?,?,?)", [email, username, bcryptPassword], (err, result) => {
            if (err) {
                console.error(err.message);
            } else {
                // Generera JWT för användaren om transaktionen lyckades
                if (result.length > 1)
                {
                    const jwtToken = jwtGenerator(email, username)
                    res.status(200).json({jwtToken});
                } else {
                    res.status(403).json("User exists.")
                }
            }
        }); 
    } catch (err) {
        console.error(err.message);
    }
    
});


router.post("/login", async (req, res) => {
    try {
        // Deconstruct body
        const { email, password } = req.body;
        
        // Skicka info till databas för verifiering
        await conn.query("SELECT email, username, pwhash FROM Users WHERE email = ?", [email], async (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({err});
            } else {
                // Returnera unauthorized om ingen användare hittas
                if (result.length !== 1) {
                    return res.status(401).json("Wrong username or password.");
                }
                const confirmPasswd = await bcrypt.compare(
                    password,
                    result[0].pwhash
                );
                
                // Generera JWT för användaren om korrekt lösenord har angivits
                if (confirmPasswd){
                    const jwtToken = jwtGenerator(result[0].email, result[0].username);
                    return res.status(200).json({jwtToken}); 
                }

                return res.status(401).json("Wrong username or password.");
            }

            
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get("/is-verified", authorization, async (_, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(403).send("Unable to authorize.");
    }
});


module.exports = router;