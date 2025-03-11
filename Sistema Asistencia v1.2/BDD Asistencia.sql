CREATE DATABASE asistencia;

USE asistencia;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_time DATETIME,
    exit_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



INSERT INTO users (email,password,role) VALUES ("daniel@gmail.com","1234","admin"), ("b@b.com","1234","admin"),("a@a.com","1234","employee");
SELECT * FROM users;
SELECT * FROM attendance;