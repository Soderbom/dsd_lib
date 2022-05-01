
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");

app.use(cors());
app.use(express.json());

app.use("/auth", require("./auth/jwtAuth"));

app.get("/get/all", async (req, res) => {
    try {
        const books = await connection.query("SELECT * FROM books4days.Library", (err, result) => {
            if (err) {
                console.error(err.message);
            }
            res.json(result);
        });
        
        //res.json({books});
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000,() => {
    console.log("Starting Express...");
});

