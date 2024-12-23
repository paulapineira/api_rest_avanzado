﻿
# api_rest_avanzado

##Pasos para ejecutar el desafio de joyas

Instalar las Dependencias: Ejecuta npm install para crear la carpeta node_modules

Configurar las siguientes variables con tus datos (esto se debe hacer en el server.js):

user=your_postgres_user
host=localhost
database=your_database_name
password=your_postgres_password
port=5432

Para realizar este desafío necesitarás ejecutar el siguiente script sql en tu terminal psql para
crear la base de datos y la tabla que utilizaremos:

CREATE DATABASE joyas;
\c joyas;
CREATE TABLE inventario (id SERIAL, nombre VARCHAR(50), categoria
VARCHAR(50), metal VARCHAR(50), precio INT, stock INT);
INSERT INTO inventario values
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000 , 2),
(DEFAULT, 'Collar History', 'collar', 'plata', 15000 , 5),
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000 , 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000 , 4),
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000 , 4),
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000 , 2);

Iniciar el Proyecto: Ejecuta npm start o node server.js para correr el servidor.
