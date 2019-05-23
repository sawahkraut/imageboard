const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-imageboard`;
const db = spicedPg(dbUrl);

module.exports.imgInfo = function imgInfo(title, url) {
    return db.query(`SELECT title, url FROM images`, [title, url]);
};
