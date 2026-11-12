// Modelo Inasistencia: define la estructura de los documentos de la coleccion "inasistencias".
// Los campos son los mismos del formulario "Registro de inasistencias" del front-end.

const mongoose = require('mongoose');

const esquemaInasistencia = new mongoose.Schema({
  // Numero que identifica la inasistencia (no se repite)
  idInasistencia: {
    type: Number,
    required: [true, 'El campo idInasistencia es obligatorio'],
    min: [1, 'idInasistencia debe ser mayor que 0'],
    unique: true,
  },
  // Documento del integrante de la comunidad educativa
  documento: {
    type: Number,
    required: [true, 'El campo documento es obligatorio'],
    min: [1, 'documento debe ser mayor que 0'],
  },
  // Fecha y hora en que se registra la inasistencia
  fechaHora: {
    type: Date,
    required: [true, 'El campo fechaHora es obligatorio'],
  },
  // Horario al que no asistio
  idHorario: {
    type: Number,
    required: [true, 'El campo idHorario es obligatorio'],
    min: [1, 'idHorario debe ser mayor que 0'],
  },
  // Dia de la inasistencia
  fechaInasistencia: {
    type: Date,
    required: [true, 'El campo fechaInasistencia es obligatorio'],
  },
  // Descripcion de la novedad
  novedades: {
    type: String,
    required: [true, 'El campo novedades es obligatorio'],
    trim: true,
  },
});

// Mongoose crea la coleccion "inasistencias" a partir del nombre del modelo
module.exports = mongoose.model('Inasistencia', esquemaInasistencia);
