// Modelo Post: define la estructura de los documentos de la coleccion "posts"

const mongoose = require('mongoose');

const esquemaPost = new mongoose.Schema({
  // Titulo de la publicacion (obligatorio)
  title: {
    type: String,
    required: [true, 'El campo title es obligatorio'],
    trim: true,
  },
  // Descripcion de la publicacion (obligatoria)
  description: {
    type: String,
    required: [true, 'El campo description es obligatorio'],
    trim: true,
  },
  // Fecha de creacion; si no se envia, toma la fecha y hora actual
  date: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose crea la coleccion "posts" a partir del nombre del modelo "Post"
module.exports = mongoose.model('Post', esquemaPost);
