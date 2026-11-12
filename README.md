# S.I. Registro y Control de Inasistencias

Proyecto formativo de la Institución Educativa **«Aprendices del Saber»**.
SENA · Tecnología en Análisis y Desarrollo de Software (ADSO) · Ficha 3235885 · Grupo colaborativo #10

**Aprendices:** Danna Valentina Jiménez Durango · María José Almanza
**Instructor:** Leonardo Lestra Salguero

El repositorio reúne las tres partes del sistema, que funcionan juntas:

| Carpeta | Evidencia | Qué es |
|---|---|---|
| raíz (`index.html`, `estilos.css`, `script.js`, `Imagenes/`) | GA7-220501096-**AA4-EV03** · Componente front-end | Página de la institución (responsive) con el menú y el formulario de inasistencias |
| [`inasistencias/`](inasistencias/) | GA7-220501096-**AA5-EV03** · Diseño y desarrollo de servicios web – proyecto | Aplicación Java Spring Boot + MySQL: publica el front-end, login de operarios y CRUD del Módulo 1. Operarios |
| [`API-REST/`](API-REST/) | GA7-220501096-**AA5-EV04** · API del proyecto | API REST Node.js + Express + MongoDB Atlas: CRUD de inasistencias, probada con Postman |

## Cómo se conectan

```
Navegador ──► http://localhost:8080   (Spring Boot, carpeta inasistencias/)
               ├── /             front-end: página de la institución
               ├── /login        «Validación Operarios» del menú
               └── /operarios    CRUD de operarios ──► MySQL (esquema inasistencias)

Formulario «Registro de inasistencias» ──fetch──► http://localhost:10000/inasistencias
                                                  (API Node.js, carpeta API-REST/) ──► MongoDB Atlas
```

- El menú **Validación Operarios** lleva a `/operarios`; si el operario no ha iniciado sesión, el sistema lo envía primero al login.
- El formulario **Registro de inasistencias** envía los datos a la API con `fetch` y muestra la confirmación o el error que responde la API.
- Las páginas de login y operarios usan el mismo encabezado, menú, pie y colores del front-end.

## Cómo ejecutar el sistema completo

Requisitos: JDK 27, MySQL Server 8.0, Node.js 22 y una cuenta de MongoDB Atlas.

1. **Base de datos MySQL:** ejecutar [`inasistencias/database/inasistencias.sql`](inasistencias/database/inasistencias.sql) y crear la variable de entorno `DB_PASSWORD` con la contraseña de `root`.
2. **API (puerto 10000):** en `API-REST/`, copiar `.env.example` como `.env` con la cadena de conexión de Atlas y ejecutar:
   ```
   npm install
   npm test
   ```
3. **Aplicación web (puerto 8080):** abrir la carpeta `inasistencias/` en IntelliJ IDEA y ejecutar `InasistenciasApplication`, o en una terminal dentro de `inasistencias/`:
   ```
   mvnw.cmd spring-boot:run
   ```
4. Abrir **http://localhost:8080**. Usuario de prueba: `Maria Vargas` / `12345`.

> La aplicación Java busca el front-end en la carpeta superior (`..`). Si se ejecuta desde otra ubicación, se puede indicar con la propiedad `frontend.ruta`.

## Seguridad

- Las contraseñas no están en el repositorio: MySQL usa la variable de entorno `DB_PASSWORD` y la API usa el archivo `.env` (excluido en `.gitignore`).
- La aplicación Java solo publica `index.html`, `estilos.css`, `script.js` e `Imagenes/`; el resto de archivos del repositorio no se puede abrir desde el navegador.
- La API solo acepta peticiones del navegador que vengan de `http://localhost:8080` (CORS).
