const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async (req, res, next) => {
    // Läs JWT från header i request
    const jwtToken = req.header("token");

    if(!jwtToken) {
        return res.status(403).json("You are not authorized");
    }

    try {
        // Använd JSONwebtokens inbyggda funktionalitet för att verifiera mottagen token m.h.a. lokal hemlighet
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        
        // TODO Vilka parametrar vill vi använda från token?
        // Uppdatera även jwtGenerator
        req.username = payload.username;

        next();

    }
    catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not authorized");
    }
}