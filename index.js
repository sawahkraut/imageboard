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

// ################################ BODY PARSER ################################ //

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// ############################################################################# //

// ################################ POST + GET ################################ //

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req.file ", req.file);
    const title = req.body.title;
    const description = req.body.description;
    const username = req.body.username;
    var url = `https://s3.amazonaws.com/salt-sawahkraut/` + req.file.filename;
    db.pushImg(url, username, title, description)
        .then(response => {
            var img = {
                id: response.rows[0].id,
                title: title,
                description: description,
                username: username,
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

app.get("/popupInfo/:id", (req, res) => {
    db.getPopup(req.params.id)
        .then(results => {
            const sendModal = {
                id: results.rows[0].id,
                url: results.rows[0].url,
                title: results.rows[0].title,
                description: results.rows[0].description,
                username: results.rows[0].username,
                created_at: results.rows[0].created_at
            };

            // ############################# comments ############################# //

            db.getComments(req.params.id).then(results => {
                const getcomments = results.rows;
                console.log("sendModal", sendModal);
                console.log("getComments", getcomments);
                res.json([sendModal, getcomments]);
            });
        })
        .catch(err => console.log(err));
});

app.post("/sendComment", (req, res) => {
    const { id, username, comment } = req.body;
    db.pushComments(id, username, comment)
        .then(results => {
            var newComment = {
                usercomment: username,
                comment: comment,
                imgid: id,
                id: results.rows[0].id,
                created_at: results.rows[0].created_at
            };
            console.log("newComment", newComment);
            res.json(newComment);
        })
        .catch(err => console.log(err));
});

// ############################################################################# //

app.listen(8080, () => console.log("listening"));

// back end
