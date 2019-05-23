const express = require("express");
const app = express();
const s3 = require("./s3");
app.use(express.static("./public"));
const db = require("./utils/db");

// ############################ upload img setup ############################ //

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// ############################################################################# //

// ################################ POST + GET ################################ //

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req.file ", req.file);
    const title = req.body.title;
    const description = req.body.description;
    const username = req.body.username;
    var url = `https://s3.amazonaws.com/salt-sawahkraut/` + req.file.filename;
    db.pushImg(url, username, title, description)
        .then(() => {
            var img = {
                url: url,
                success: true
            };
            res.json(img);
        })
        .catch(err => console.log(err));
});

app.get("/images", (req, res) => {
    db.imgInfo()
        .then(results => {
            res.json(results);
        })
        .catch(err => console.log(err));
});

app.listen(8080, () => console.log("listening"));

// back end
