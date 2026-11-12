# Endpoints de la API REST de inasistencias

URL base: `http://localhost:10000`

En Postman, las peticiones que llevan datos (POST y PATCH) se configuran en **Body → raw → JSON**.
Reemplace `:id` por el valor `_id` que devuelve el POST.

| Operación CRUD | Método | Ruta | Cuerpo (JSON) | Respuesta correcta |
|---|---|---|---|---|
| Prueba del servidor | GET | `/` | — | `200` texto «API REST de inasistencias funcionando» |
| **Create** | POST | `/inasistencias` | los 6 campos del modelo | `201` inasistencia creada con su `_id` |
| **Read** (todas) | GET | `/inasistencias` | — | `200` lista de inasistencias |
| **Read** (una) | GET | `/inasistencias/:id` | — | `200` inasistencia |
| **Update** | PATCH | `/inasistencias/:id` | uno o varios campos editables | `200` inasistencia ya modificada |
| **Delete** | DELETE | `/inasistencias/:id` | — | `200` mensaje e inasistencia eliminada |

Campos editables con PATCH: `documento`, `fechaHora`, `idHorario`, `fechaInasistencia`, `novedades`. El `idInasistencia` no se puede modificar.

## 1. Create · POST /inasistencias

```
POST http://localhost:10000/inasistencias
Content-Type: application/json

{
  "idInasistencia": 101,
  "documento": 1020304050,
  "fechaHora": "2026-11-12T08:15:00",
  "idHorario": 5,
  "fechaInasistencia": "2026-11-12",
  "novedades": "No asistió a la primera clase"
}
```

Respuesta `201 Created`:

```json
{
  "idInasistencia": 101,
  "documento": 1020304050,
  "fechaHora": "2026-11-12T13:15:00.000Z",
  "idHorario": 5,
  "fechaInasistencia": "2026-11-12T00:00:00.000Z",
  "novedades": "No asistió a la primera clase",
  "_id": "6af56d7de58baa6a8d84c23e",
  "__v": 0
}
```

Las fechas se guardan en UTC (la hora de Colombia es UTC−5).

## 2. Read · GET /inasistencias/:id

```
GET http://localhost:10000/inasistencias/6af56d7de58baa6a8d84c23e
```

Respuesta `200 OK`: el mismo documento. `GET /inasistencias` devuelve todas las inasistencias, de la registrada más reciente a la más antigua.

## 3. Update · PATCH /inasistencias/:id

```
PATCH http://localhost:10000/inasistencias/6af56d7de58baa6a8d84c23e
Content-Type: application/json

{
  "novedades": "Llegó con excusa médica"
}
```

Respuesta `200 OK`: el documento con la novedad nueva. Solo cambian los campos enviados.

## 4. Delete · DELETE /inasistencias/:id

```
DELETE http://localhost:10000/inasistencias/6af56d7de58baa6a8d84c23e
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Inasistencia eliminada",
  "inasistencia": { "_id": "6af56d7de58baa6a8d84c23e", "idInasistencia": 101, "...": "..." }
}
```

## Respuestas de error

| Código | Cuándo ocurre | Mensaje |
|---|---|---|
| `400` | Falta un campo obligatorio o tiene un tipo incorrecto | `Datos no validos` (con el detalle) |
| `400` | El `:id` no tiene formato de ObjectId | `El id no es valido` |
| `400` | El cuerpo no es un JSON válido | `El cuerpo de la peticion no es un JSON valido` |
| `400` | PATCH sin campos o intentando cambiar `idInasistencia` | `Envie al menos un campo...` / `El idInasistencia no se puede modificar` |
| `404` | No existe una inasistencia con ese `_id` | `Inasistencia no encontrada` |
| `409` | Ya existe una inasistencia con ese `idInasistencia` | `Ya existe una inasistencia con ese idInasistencia` |
| `500` | Error del servidor o de la base de datos | `Error en el servidor` |

## Uso desde el front-end

El formulario «Registro de inasistencias» (`index.html` en la raíz del repositorio) envía este mismo `POST` desde `script.js`:

```js
fetch("http://localhost:10000/inasistencias", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(inasistencia)
});
```
