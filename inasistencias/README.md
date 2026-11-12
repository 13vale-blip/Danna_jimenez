# Inasistencias · Módulo Operarios (Spring Boot + MySQL)

Evidencia **GA7-220501096-AA5-EV03 – Diseño y desarrollo de servicios web – proyecto**
SENA · Tecnología en Análisis y Desarrollo de Software (ADSO) · Ficha 3235885 · Grupo colaborativo #10

**Aprendices:** Danna Valentina Jiménez Durango · María José Almanza
**Instructor:** Leonardo Lestra Salguero

## Descripción

Aplicación web en Java con Spring Boot que se conecta a la base de datos MySQL `inasistencias`. Incluye:

- **Página de inicio** (`/`), en construcción.
- **Login de operario** (`/login`): valida el nombre del operario y su contraseña contra la tabla `operarios`. Si los datos no coinciden muestra «Los datos de operario o contraseña son incorrectos».
- **Módulo 1. Operarios** (`/operarios`): CRUD completo (registrar, consultar, editar y eliminar).

### Validaciones del CRUD

- El ID es obligatorio y no se puede repetir al registrar.
- La contraseña y su confirmación deben ser iguales (máximo 8 caracteres).
- El tipo de operario y el tipo de documento deben existir en sus tablas.
- El ID (`Id_Login`) no se puede modificar al editar.
- Al editar, si la contraseña se deja en blanco se conserva la actual.
- Eliminar pide confirmación en el navegador.

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
├── controller/
│   ├── HomeController.java         página de inicio
│   ├── LoginController.java        login y cierre de sesión
│   └── OperariosController.java    CRUD de operarios
├── modelo/
│   └── Operarios.java              entidad de la tabla operarios
└── repository/
    └── OperariosRepository.java    acceso a datos (Spring Data JPA)
src/main/resources/
├── application.properties          conexión a MySQL
├── static/css/estilos.css
└── templates/                      home, login, operarios, operario-form
database/inasistencias.sql          script de la base de datos
```

## Base de datos

Esquema `inasistencias` con las tablas `tipos operarios`, `tipos documentos` y `operarios`. Los nombres con espacios vienen del diagrama del proyecto, por eso en SQL van entre comillas invertidas. El script está en [`database/inasistencias.sql`](database/inasistencias.sql) e incluye datos de ejemplo (operario `Maria Vargas`).

## Cómo ejecutar

1. Ejecutar `database/inasistencias.sql` en MySQL (por ejemplo, desde MySQL Workbench).
2. Crear la variable de entorno `DB_PASSWORD` con la contraseña del usuario `root` de MySQL. La contraseña **no** se guarda en el repositorio.
3. Abrir el proyecto en IntelliJ IDEA y ejecutar `InasistenciasApplication`, o desde la terminal:

   ```
   mvnw.cmd spring-boot:run
   ```

4. Abrir `http://localhost:8080` en el navegador.

## Nota de seguridad

Las contraseñas se guardan en texto plano y con máximo 8 caracteres porque así está definido el diseño de la base de datos del ejercicio. En un sistema real se deben guardar cifradas, por ejemplo con BCrypt (Spring Security).
