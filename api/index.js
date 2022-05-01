const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.use("/auth", require("./auth/jwtAuth"));
app.use("/get", require("./paths/Get"));
app.use("/post", require("./paths/Post"));
app.use("/delete", require("./paths/Delete"));


app.listen(5000,() => {
    console.log("Starting Express...");
});

