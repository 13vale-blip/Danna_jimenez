// Servidor web de la API REST (Node.js + Express + MongoDB Atlas)

// Carga las variables del archivo .env (MONGO_URI) sin mostrar avisos en consola
require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rutasPost = require('./routes/post');

// Puerto del servidor web local
const PUERTO = 10000;

const app = express();

// body-parser convierte el cuerpo JSON de las peticiones en un objeto (peticion.body)
app.use(bodyParser.json());

// Rutas del CRUD de publicaciones
app.use('/posts', rutasPost);

// Si el cuerpo no es un JSON valido, responde en JSON en lugar de una pagina de error
app.use((error, peticion, respuesta, siguiente) => {
  if (error.type === 'entity.parse.failed') {
    return respuesta.status(400).json({ mensaje: 'El cuerpo de la peticion no es un JSON valido' });
  }
  siguiente(error);
});

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
