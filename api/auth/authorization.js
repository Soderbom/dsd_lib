const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async (req, res, next) => {
    // Läs JWT från header i request
    const jwtToken = req.header("token");

    // Om användaren inte har en token nekas åtkomst.
    if(!jwtToken) {
        return res.status(403).json("You are not authorized");
    }

    try {
        // Använd JSONwebtokens inbyggda funktionalitet för att verifiera mottagen token m.h.a. lokal hemlighet
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        
        // Uppdatera även jwtGenerator
        req.username = payload.username;
        req.email = payload.email;

        // Eftersom authorization används som ett argument i andra funktions anrop måste vi specificera att gå vidare
        next();

    }
    catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not authorized");
    }
}