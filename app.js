const express = require("express");

const app = express();
const port = 3000;

// * ROUTS
app.get("/", (res, req) => {
    res.statusCode(200).send("Server is up and running...");
});

app.listen(port, () => {
    console.log(`App running on  port: ${port}...`);
});
