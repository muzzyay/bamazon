DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products(
id integer(50) not null auto_increment,
product_name varchar(50) not null,
department varchar(40) not null,
price integer(40) not null,
stock_quantity integer(40) not null,
product_sales integer(40) not null default 0,
primary key(id)
);

INSERT INTO products(product_name, department, price, stock_quantity)
VALUES("Pixel 3", "Smartphones", 750, 4000), ("Keyboard", "Hardware", 20, 10000), ("Fifa 19", "Video Games", 60, 20000), 
("Iphone XR","Smartphones", 1000, 10000), ("Mouse", "Hardware", 10, 20000), ("Battlefield", "Video Games", 40, 2000),
("Memory Card", "Hardware", 15, 25000), ("Galaxy S9", "Smartphones", 800, 9000), ("Madden 19", "Video Games", 35, 1500),
("Hard Drive", "Hardware", 100, 2000), ("GTA V", "Video Games", 30, 1000), ("Iphone 5", "Smartphones", 250, 3),
("Fifa 18", "Video Games", 10, 2), ("Sound Card", "Hardware", 50, 1), ("GTA IV", "Video Games", 10, 4);

CREATE TABLE departments(
department_id integer(30) not null auto_increment,
department_name varchar(30) not null,
over_head_costs integer(30) not null,
primary key(department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Smartphones", 10000), ("Hardware", 1500), ("Video Games", 5000);