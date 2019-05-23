const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/imgboard`;
const db = spicedPg(dbUrl);

module.exports.imgInfo = function imgInfo() {
    return db.query(`SELECT * FROM images`);
};

module.exports.pushImg = function pushImg(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)`,
        [url, username, title, description]
    );
};
