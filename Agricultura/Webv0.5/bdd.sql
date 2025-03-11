create database riego;
use riego;

create table usuarios(
id int primary key not null auto_increment,
name varchar(50) not null,
email varchar(50) not null, 
pass varchar(100) not null
);
insert into usuarios(name,email,pass) values("admin","a@a.com","0701");
select* from usuarios;
CREATE TABLE Riegos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  temperatura FLOAT NOT NULL,
  humedad FLOAT NOT NULL
);

CREATE TABLE datos_sensor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperatura FLOAT NOT NULL,
  humedad FLOAT NOT NULL,
  fecha DATETIME NOT NULL
);

CREATE TABLE riegos_programados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  temperatura FLOAT NOT NULL,
  humedad FLOAT NOT NULL
);

select * from riegos;
