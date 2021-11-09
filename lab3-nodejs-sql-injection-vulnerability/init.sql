USE lab1;

CREATE TABLE users (
    user VARCHAR(355) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL
);

INSERT INTO users (user, password) VALUES ('admin', 'admin'), ('homer', 'simpson');
