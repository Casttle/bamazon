drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

create table products(
item_id int auto_increment not null primary key,
product_name varchar(30) null,
price decimal(10,2) null,
stock_quantity int null
);

insert into products(product_name,price,stock_quantity)
values ("bananas",.39,150),("bread",2.39,30),("bland cereal",1.99,200),("sugar cereal",4.99,50),("milk",2.59,90),
	   ("stereo",49.95,20),("flat screen",1499.99,3),("pants",39.49,80),("dirty sock",5000.01,320),("fruit bowl",24.99,5);

select * from products;