# Inasistencias · Aplicación web Java (Spring Boot + MySQL)

Evidencia **GA7-220501096-AA5-EV03 – Diseño y desarrollo de servicios web – proyecto**
Parte del proyecto formativo [S.I. Registro y Control de Inasistencias](../README.md).
SENA · ADSO · Ficha 3235885 · Grupo colaborativo #10 · Aprendices: Danna Valentina Jiménez Durango y María José Almanza · Instructor: Leonardo Lestra Salguero

## Qué hace

- **Publica el front-end** del proyecto (los archivos `index.html`, `estilos.css`, `script.js` e `Imagenes/` de la raíz del repositorio) como página de inicio en `http://localhost:8080`.
- **Validación Operarios (login)** en `/login`: valida el nombre del operario y su contraseña contra la tabla `operarios`. Si son correctos entra al módulo Operarios; si no, muestra «Los datos de operario o contraseña son incorrectos». `/logout` cierra la sesión.
- **Módulo 1. Operarios** en `/operarios`: CRUD completo (registrar, consultar, editar y eliminar). Solo se puede entrar después de iniciar sesión.

Las pantallas de login y operarios usan el encabezado, el menú, el pie y los colores del front-end.

### Validaciones del CRUD

- El ID es obligatorio y no se puede repetir al registrar.
- La contraseña y su confirmación deben ser iguales (máximo 8 caracteres).
- El tipo de operario y el tipo de documento deben existir en sus tablas.
- El ID (`Id_Login`) no se puede modificar al editar; si la contraseña se deja en blanco, se conserva la actual.
- Eliminar pide confirmación en el navegador.

## Servicios (rutas)

| Método | Ruta | Descripción | Requiere sesión |
|---|---|---|---|
| GET | `/` | Página de inicio (front-end del proyecto) | No |
| GET | `/login` | Formulario de Validación Operarios | No |
| POST | `/login` | Valida usuario y contraseña (`usuario`, `password`) | No |
| GET | `/logout` | Cierra la sesión | No |
| GET | `/operarios` | Consulta (Read): lista de operarios | Sí |
| GET | `/operarios/nuevo` | Formulario de registro | Sí |
| POST | `/operarios/guardar` | Create: registra un operario | Sí |
| GET | `/operarios/editar/{id}` | Formulario de edición con los datos cargados | Sí |
| POST | `/operarios/actualizar/{id}` | Update: guarda los cambios (el ID no cambia) | Sí |
| POST | `/operarios/eliminar/{id}` | Delete: elimina el operario | Sí |

## Tecnologías

| Herramienta | Versión |
|---|---|
| JDK (Oracle) | 27 |
| Spring Boot | 4.1.2 (Spring Web MVC, Spring Data JPA, Thymeleaf, MySQL Driver) |
| Maven | wrapper incluido (`mvnw`) |
| MySQL Server | 8.0 |
| IDE | IntelliJ IDEA |

## Estructura

```
src/main/java/com/inasistencias/inasistencias/
├── InasistenciasApplication.java   clase principal
├── config/
│   ├── WebConfig.java              publica el front-end y protege /operarios
│   └── SesionInterceptor.java      envía al login si no hay sesión
├── controller/
│   ├── HomeController.java         página de inicio (front-end)
│   ├── LoginController.java        login y cierre de sesión
│   ├── OperariosController.java    CRUD de operarios
│   └── SesionControllerAdvice.java nombre del operario para las plantillas
├── modelo/
│   └── Operarios.java              entidad de la tabla operarios
└── repository/
    └── OperariosRepository.java    acceso a datos (Spring Data JPA)
src/main/resources/
├── application.properties          conexión a MySQL
├── static/css/modulo.css           estilos de login y operarios
└── templates/                      fragmentos, login, operarios, operario-form
database/inasistencias.sql          script de la base de datos
```

## Base de datos

Esquema `inasistencias` con las tablas `tipos operarios`, `tipos documentos` y `operarios`. Los nombres con espacios vienen del diagrama del proyecto, por eso en SQL van entre comillas invertidas. El script está en [`database/inasistencias.sql`](database/inasistencias.sql) e incluye datos de ejemplo (operario `Maria Vargas`, contraseña `12345`).

## Cómo ejecutar

1. Ejecutar `database/inasistencias.sql` en MySQL (por ejemplo, desde MySQL Workbench).
2. Crear la variable de entorno `DB_PASSWORD` con la contraseña del usuario `root` de MySQL. La contraseña **no** se guarda en el repositorio.
3. Abrir esta carpeta (`inasistencias/`) en IntelliJ IDEA y ejecutar `InasistenciasApplication`, o desde una terminal en esta carpeta:

   ```
   mvnw.cmd spring-boot:run
   ```

4. Abrir `http://localhost:8080`. Para que el formulario de inasistencias guarde, también debe estar encendida la API de la carpeta [`API-REST/`](../API-REST/).

> El front-end se busca en la carpeta superior (`..`) o en la carpeta actual. Si se ejecuta desde otra ubicación, se indica con la propiedad `frontend.ruta`.

## Nota de seguridad

Las contraseñas se guardan en texto plano y con máximo 8 caracteres porque así está definido el diseño de la base de datos del ejercicio. En un sistema real se deben guardar cifradas, por ejemplo con BCrypt (Spring Security).
