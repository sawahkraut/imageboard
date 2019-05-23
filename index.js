const express = require("express");
const app = express();
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    res.json(images);
});

app.listen(8080, () => console.log("listening"));

// back end
