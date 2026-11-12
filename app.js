// Servidor web de la API REST (Node.js + Express)

const express = require('express');

// Puerto del servidor web local
const PUERTO = 10000;

const app = express();

// Ruta de prueba: confirma que el servidor esta encendido
app.get('/', (peticion, respuesta) => {
  respuesta.send('Servidor API REST funcionando');
});

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
