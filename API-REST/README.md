# API REST de inasistencias · Node.js + Express + MongoDB Atlas

Evidencia **GA7-220501096-AA5-EV04 – API del proyecto**
Parte del proyecto formativo [S.I. Registro y Control de Inasistencias](../README.md).
SENA · ADSO · Ficha 3235885 · Grupo colaborativo #10 · Aprendices: Danna Valentina Jiménez Durango y María José Almanza · Instructor: Leonardo Lestra Salguero

## Descripción

Servicio web que guarda las **inasistencias** registradas desde el formulario «Registro de inasistencias» del front-end del proyecto. Implementa el CRUD completo sobre MongoDB Atlas y se probó con Postman.
El detalle de cada ruta está en [ENDPOINTS.md](ENDPOINTS.md).

| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Mensaje de prueba del servidor |
| POST | `/inasistencias` | Registrar inasistencia |
| GET | `/inasistencias` | Listar inasistencias |
| GET | `/inasistencias/:id` | Consultar una inasistencia |
| PATCH | `/inasistencias/:id` | Actualizar una inasistencia |
| DELETE | `/inasistencias/:id` | Eliminar una inasistencia |

## Integración con el proyecto

- El front-end (raíz del repositorio) lo publica la aplicación Java en `http://localhost:8080`.
- Al enviar el formulario de inasistencias, `script.js` hace un `POST` a `http://localhost:10000/inasistencias` y muestra la respuesta de la API.
- Como la página y la API están en puertos distintos, la API habilita **CORS** solo para `http://localhost:8080` (se puede cambiar con la variable `ORIGEN_FRONTEND`).

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 22 | Entorno para ejecutar JavaScript del lado del servidor |
| Express 5 | Servidor web y rutas |
| Mongoose 9 | Modelo de datos y conexión a MongoDB |
| body-parser | Lee el cuerpo JSON de las peticiones |
| cors | Permite que el front-end (puerto 8080) consuma la API |
| dotenv | Carga la cadena de conexión desde `.env` |
| nodemon | Reinicia el servidor al guardar cambios (desarrollo) |
| MongoDB Atlas | Base de datos en la nube (clúster gratuito M0, AWS, Virginia) |
| Postman | Pruebas de las peticiones HTTP |

## Estructura

```
API-REST/
├── app.js                   servidor Express (puerto 10000), CORS y conexión a MongoDB
├── models/
│   └── Inasistencia.js      modelo con los campos del formulario
├── routes/
│   └── inasistencias.js     rutas del CRUD
├── .env.example             plantilla de las variables MONGO_URI y ORIGEN_FRONTEND
├── ENDPOINTS.md             documentación de las rutas
└── package.json
```

### Modelo `Inasistencia`

| Campo | Tipo | Regla |
|---|---|---|
| `idInasistencia` | Number | obligatorio, mayor que 0, no se repite, no se edita |
| `documento` | Number | obligatorio, documento del integrante de la comunidad educativa |
| `fechaHora` | Date | obligatorio, fecha y hora del registro |
| `idHorario` | Number | obligatorio |
| `fechaInasistencia` | Date | obligatorio |
| `novedades` | String | obligatorio |

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
5. Probar las rutas en Postman o registrar una inasistencia desde el formulario del front-end (`http://localhost:8080`, con la aplicación Java encendida).

## Nota de seguridad

En **Network Access** de MongoDB Atlas se permitió el acceso desde `0.0.0.0/0` (cualquier IP) solo porque es un ejercicio académico. En un proyecto real se deben autorizar únicamente las IP de los servidores que se conectan a la base de datos.
