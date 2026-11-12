// Servidor web de la API REST (Node.js + Express + MongoDB Atlas)

// Carga las variables del archivo .env (MONGO_URI) sin mostrar avisos en consola
require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');

// Puerto del servidor web local
const PUERTO = 10000;

const app = express();

// Ruta de prueba: confirma que el servidor esta encendido
app.get('/', (peticion, respuesta) => {
  respuesta.send('Servidor API REST funcionando');
});

// Conexion a la base de datos MongoDB Atlas.
// La cadena de conexion (usuario y contrasena) se lee del archivo .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.error('Error al conectar la base de datos:', error.message));

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
