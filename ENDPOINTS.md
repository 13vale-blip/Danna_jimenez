# Endpoints de la API REST

URL base: `http://localhost:10000`

En Postman, las peticiones que llevan datos (POST y PATCH) se configuran en **Body → raw → JSON**.
Reemplace `:id` por el valor `_id` que devuelve el POST.

| Operación CRUD | Método | Ruta | Cuerpo (JSON) | Respuesta correcta |
|---|---|---|---|---|
| Prueba del servidor | GET | `/` | — | `200` texto «Servidor API REST funcionando» |
| **Create** | POST | `/posts` | `title`, `description` | `201` publicación creada con su `_id` y `date` |
| **Read** (todas) | GET | `/posts` | — | `200` lista de publicaciones |
| **Read** (una) | GET | `/posts/:id` | — | `200` publicación |
| **Update** | PATCH | `/posts/:id` | `title` y/o `description` | `200` publicación ya modificada |
| **Delete** | DELETE | `/posts/:id` | — | `200` mensaje y publicación eliminada |

## 1. Create · POST /posts

```
POST http://localhost:10000/posts
Content-Type: application/json

{
  "title": "Primer post",
  "description": "Prueba de la API REST con Node.js y MongoDB"
}
```

Respuesta `201 Created`:

```json
{
  "title": "Primer post",
  "description": "Prueba de la API REST con Node.js y MongoDB",
  "_id": "6af56138a55c7d7424c60f16",
  "date": "2026-11-12T06:48:24.864Z",
  "__v": 0
}
```

## 2. Read · GET /posts/:id

```
GET http://localhost:10000/posts/6af56138a55c7d7424c60f16
```

Respuesta `200 OK`: el mismo documento. `GET /posts` devuelve todas las publicaciones, de la más reciente a la más antigua.

## 3. Update · PATCH /posts/:id

```
PATCH http://localhost:10000/posts/6af56138a55c7d7424c60f16
Content-Type: application/json

{
  "title": "Post modificado"
}
```

Respuesta `200 OK`: el documento con el `title` nuevo. Solo cambian los campos enviados.

## 4. Delete · DELETE /posts/:id

```
DELETE http://localhost:10000/posts/6af56138a55c7d7424c60f16
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Publicacion eliminada",
  "post": { "_id": "6af56138a55c7d7424c60f16", "title": "Post modificado", "...": "..." }
}
```

## Respuestas de error

| Código | Cuándo ocurre | Ejemplo de mensaje |
|---|---|---|
| `400` | Falta `title` o `description`, o vienen vacíos | `Datos no validos` |
| `400` | El `:id` no tiene formato de ObjectId | `El id no es valido` |
| `400` | El cuerpo no es un JSON válido | `El cuerpo de la peticion no es un JSON valido` |
| `400` | PATCH sin `title` ni `description` | `Envie title y/o description para actualizar` |
| `404` | No existe una publicación con ese `_id` | `Publicacion no encontrada` |
| `500` | Error del servidor o de la base de datos | `Error en el servidor` |
