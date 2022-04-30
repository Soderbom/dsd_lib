const jwt = require("jsonwebtoken");
require("dotenv").config();

// TODO Vilken information vill vi ha från användaren?
// Uppdatera även authorization
function jwtGenerator(email, username) {
    const payload = {
        email: email,
        username: username
    };

    // Signerar vår token m.h.a. inbyggd funktionalitet och vår lokala hemlighet
    return jwt.sign(payload, `${process.env.jwtSecret}`, {expiresIn: "1h"});
}

module.exports = jwtGenerator;