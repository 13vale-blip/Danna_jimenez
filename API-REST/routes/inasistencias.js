// Rutas del CRUD de inasistencias
// Create: POST /inasistencias · Read: GET /inasistencias y GET /inasistencias/:id
// Update: PATCH /inasistencias/:id · Delete: DELETE /inasistencias/:id
// El :id es el _id que MongoDB asigna a cada documento.

const express = require('express');
const mongoose = require('mongoose');
const Inasistencia = require('../models/Inasistencia');

const router = express.Router();

// Campos que se pueden modificar con PATCH (idInasistencia no se edita)
const CAMPOS_EDITABLES = ['documento', 'fechaHora', 'idHorario', 'fechaInasistencia', 'novedades'];

// Revisa que el id tenga el formato de un ObjectId de MongoDB
function esIdValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Convierte un error en una respuesta JSON con el codigo HTTP adecuado
function responderError(respuesta, error) {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return respuesta.status(400).json({ mensaje: 'Datos no validos', errores: error.message });
  }
  if (error.code === 11000) {
    return respuesta.status(409).json({ mensaje: 'Ya existe una inasistencia con ese idInasistencia' });
  }
  return respuesta.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
}

// CREATE: registra una inasistencia
router.post('/', async (peticion, respuesta) => {
  try {
    const { idInasistencia, documento, fechaHora, idHorario, fechaInasistencia, novedades } = peticion.body;
    const nuevaInasistencia = new Inasistencia({
      idInasistencia, documento, fechaHora, idHorario, fechaInasistencia, novedades,
    });
    const inasistenciaGuardada = await nuevaInasistencia.save();
    respuesta.status(201).json(inasistenciaGuardada);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// READ: lista todas las inasistencias (la registrada mas reciente primero)
router.get('/', async (peticion, respuesta) => {
  try {
    const inasistencias = await Inasistencia.find().sort({ fechaHora: -1 });
    respuesta.json(inasistencias);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// READ: consulta una inasistencia por su _id
router.get('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }
  try {
    const inasistencia = await Inasistencia.findById(id);
    if (!inasistencia) {
      return respuesta.status(404).json({ mensaje: 'Inasistencia no encontrada' });
    }
    respuesta.json(inasistencia);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// UPDATE: modifica uno o varios campos de una inasistencia
router.patch('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }
  if (peticion.body.idInasistencia !== undefined) {
    return respuesta.status(400).json({ mensaje: 'El idInasistencia no se puede modificar' });
  }

  // Solo se actualizan los campos editables que lleguen en el cuerpo
  const cambios = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (peticion.body[campo] !== undefined) cambios[campo] = peticion.body[campo];
  }
  if (Object.keys(cambios).length === 0) {
    return respuesta.status(400).json({ mensaje: 'Envie al menos un campo para actualizar: ' + CAMPOS_EDITABLES.join(', ') });
  }

  try {
    const inasistenciaActualizada = await Inasistencia.findByIdAndUpdate(id, { $set: cambios }, {
      returnDocument: 'after', // devuelve el documento ya modificado
      runValidators: true, // aplica las reglas del modelo
    });
    if (!inasistenciaActualizada) {
      return respuesta.status(404).json({ mensaje: 'Inasistencia no encontrada' });
    }
    respuesta.json(inasistenciaActualizada);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// DELETE: elimina una inasistencia por su _id
router.delete('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }
  try {
    const inasistenciaEliminada = await Inasistencia.findByIdAndDelete(id);
    if (!inasistenciaEliminada) {
      return respuesta.status(404).json({ mensaje: 'Inasistencia no encontrada' });
    }
    respuesta.json({ mensaje: 'Inasistencia eliminada', inasistencia: inasistenciaEliminada });
  } catch (error) {
    responderError(respuesta, error);
  }
});

module.exports = router;
