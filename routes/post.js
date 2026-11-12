// Rutas del CRUD de publicaciones (posts)
// Create: POST /posts · Read: GET /posts y GET /posts/:id
// Update: PATCH /posts/:id · Delete: DELETE /posts/:id

const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const router = express.Router();

// Revisa que el id tenga el formato de un ObjectId de MongoDB
function esIdValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Convierte un error en una respuesta JSON con el codigo HTTP adecuado
function responderError(respuesta, error) {
  if (error.name === 'ValidationError') {
    return respuesta.status(400).json({ mensaje: 'Datos no validos', errores: error.message });
  }
  return respuesta.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
}

// CREATE: crea una publicacion con title y description
router.post('/', async (peticion, respuesta) => {
  try {
    const nuevoPost = new Post({
      title: peticion.body.title,
      description: peticion.body.description,
    });
    const postGuardado = await nuevoPost.save();
    respuesta.status(201).json(postGuardado);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// READ: lista todas las publicaciones (la mas reciente primero)
router.get('/', async (peticion, respuesta) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    respuesta.json(posts);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// READ: consulta una publicacion por su _id
router.get('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return respuesta.status(404).json({ mensaje: 'Publicacion no encontrada' });
    }
    respuesta.json(post);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// UPDATE: modifica el title y/o la description de una publicacion
router.patch('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }

  // Solo se actualizan los campos que lleguen en el cuerpo de la peticion
  const cambios = {};
  if (peticion.body.title !== undefined) cambios.title = peticion.body.title;
  if (peticion.body.description !== undefined) cambios.description = peticion.body.description;

  if (Object.keys(cambios).length === 0) {
    return respuesta.status(400).json({ mensaje: 'Envie title y/o description para actualizar' });
  }

  try {
    const postActualizado = await Post.findByIdAndUpdate(id, { $set: cambios }, {
      returnDocument: 'after', // devuelve el documento ya modificado
      runValidators: true, // aplica las reglas del modelo (campos obligatorios)
    });
    if (!postActualizado) {
      return respuesta.status(404).json({ mensaje: 'Publicacion no encontrada' });
    }
    respuesta.json(postActualizado);
  } catch (error) {
    responderError(respuesta, error);
  }
});

// DELETE: elimina una publicacion por su _id
router.delete('/:id', async (peticion, respuesta) => {
  const { id } = peticion.params;
  if (!esIdValido(id)) {
    return respuesta.status(400).json({ mensaje: 'El id no es valido' });
  }
  try {
    const postEliminado = await Post.findByIdAndDelete(id);
    if (!postEliminado) {
      return respuesta.status(404).json({ mensaje: 'Publicacion no encontrada' });
    }
    respuesta.json({ mensaje: 'Publicacion eliminada', post: postEliminado });
  } catch (error) {
    responderError(respuesta, error);
  }
});

module.exports = router;
