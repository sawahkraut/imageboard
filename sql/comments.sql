DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    imgid INTEGER NOT NULL,
    comment VARCHAR (255) NOT NULL CHECK (comment <> ''),
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE comments
    ADD FOREIGN KEY (imgid)
    REFERENCES images(id)
    ON DELETE CASCADE;
