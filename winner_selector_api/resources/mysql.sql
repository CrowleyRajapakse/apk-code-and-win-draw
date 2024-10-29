DROP DATABASE apk_draw;
CREATE DATABASE apk_draw;
USE apk_draw;

CREATE TABLE secondary_winners (
    id int AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    winners JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grand_winner (
    id int AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    winner JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);