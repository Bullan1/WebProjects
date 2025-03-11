create database banco2;
use banco2;

create table clientes(
id_cliente int primary key auto_increment,
run varchar(50),
nombre varchar(50),
direccion varchar(100),
email varchar(255),
telefono varchar(100)
);

create table tipo_cuentas(
id_tipo int primary key auto_increment,
nombre varchar(100)
);

create table cuentas (
id_cuenta int primary key auto_increment,
numero int,
fecha_apertura date,
id_tipo int,
id_cliente int,
foreign key (id_tipo) references tipo_cuentas(id_tipo),
foreign key (id_cliente) references clientes(id_cliente)
);

create table transacciones(
id_transacciones int primary key auto_increment,
monto int,
fecha date,
tipo_transaccion varchar(255),
id_cuenta int,
foreign key (id_cuenta) references cuentas(id_cuenta)
);

insert into tipo_Cuentas(nombre) values("Corriente"),("RUT"),("Vista"),("Ahorro");

Create table users(
id_user int primary key auto_increment,
nombre varchar(100),
email varchar(100),
pass varchar(100)
);
select * from users;
Select * from clientes;

Select * from cuentas;
