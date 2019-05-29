const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/imgboard`;
const db = spicedPg(dbUrl);

module.exports.imgInfo = function imgInfo() {
    return db.query(`SELECT * FROM images
        ORDER BY id DESC
        LIMIT 12`);
};

module.exports.pushImg = function pushImg(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [url, username, title, description]
    );
};

module.exports.getPopup = function getPopup(id) {
    return db.query(
        `
        SELECT * FROM images
        WHERE id=$1
        `,
        [id]
    );
};
// ############################ COMMENTS ############################ //

module.exports.getComments = function getComments(id) {
    return db.query(
        `
        SELECT * FROM comments
        WHERE imgid = $1
        `,
        [id]
    );
};

module.exports.pushComments = function pushComments(imgid, username, comment) {
    return db.query(
        `INSERT INTO comments (imgid, username, comment)
        VALUES ($1, $2, $3)
        RETURNING id, created_at
        `,
        [imgid, username, comment]
    );
};
