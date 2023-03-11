const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3100;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json(
        {message: "Hello World",}
    );
});

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});