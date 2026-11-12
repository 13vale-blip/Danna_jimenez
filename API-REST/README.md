# API REST · Node.js + Express + MongoDB Atlas

Evidencia **GA7-220501096-AA5-EV04 – API del proyecto**
SENA · Tecnología en Análisis y Desarrollo de Software (ADSO) · Ficha 3235885 · Grupo colaborativo #10

**Aprendices:** Danna Valentina Jiménez Durango · María José Almanza
**Instructor:** Leonardo Lestra Salguero

## Descripción

API REST que gestiona publicaciones (*posts*) guardadas en MongoDB Atlas. Implementa el CRUD completo (crear, consultar, actualizar y eliminar) y se probó con Postman.
El detalle de cada ruta está en [ENDPOINTS.md](ENDPOINTS.md).

| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Mensaje de prueba del servidor |
| POST | `/posts` | Crear publicación |
| GET | `/posts` | Listar publicaciones |
| GET | `/posts/:id` | Consultar una publicación |
| PATCH | `/posts/:id` | Actualizar una publicación |
| DELETE | `/posts/:id` | Eliminar una publicación |

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 22 | Entorno para ejecutar JavaScript del lado del servidor |
| Express 5 | Servidor web y rutas |
| Mongoose 9 | Modelo de datos y conexión a MongoDB |
| body-parser | Lee el cuerpo JSON de las peticiones |
| dotenv | Carga la cadena de conexión desde `.env` |
| nodemon | Reinicia el servidor al guardar cambios (desarrollo) |
| MongoDB Atlas | Base de datos en la nube (clúster gratuito M0, AWS, Virginia) |
| Postman | Pruebas de las peticiones HTTP |

## Estructura

```
API-REST/
├── app.js            servidor Express (puerto 10000) y conexión a MongoDB
├── models/
│   └── Post.js       modelo: title, description (obligatorios) y date (por defecto, la fecha actual)
├── routes/
│   └── post.js       rutas del CRUD
├── .env.example      plantilla de la variable MONGO_URI
├── ENDPOINTS.md      documentación de las rutas
└── package.json
```

## Cómo ejecutar

1. Instalar las dependencias:

   ```
   npm install
   ```

2. Copiar `.env.example` como `.env` y poner la cadena de conexión de MongoDB Atlas en `MONGO_URI` (Atlas → Connect → Drivers → Node.js). El archivo `.env` no se sube al repositorio porque contiene el usuario y la contraseña.
3. Iniciar el servidor:

   ```
   npm test     (con nodemon, se reinicia al guardar)
   npm start    (con node)
   ```

4. En la consola deben aparecer «Servidor escuchando en http://localhost:10000» y «Conectado a la base de datos». Si la conexión falla, aparece «Error al conectar la base de datos».
5. Abrir `http://localhost:10000` o probar las rutas en Postman.

## Nota de seguridad

En **Network Access** de MongoDB Atlas se permitió el acceso desde `0.0.0.0/0` (cualquier IP) solo porque es un ejercicio académico. En un proyecto real se deben autorizar únicamente las IP de los servidores que se conectan a la base de datos.
