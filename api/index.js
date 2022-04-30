
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
    try {
        res.status(200).json("Works");
    } catch (err) {
        console.error("Something went wrong!");
    }
});

app.listen(5000,() => {
    console.log("Starting Express...");
});

