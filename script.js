/* =====================================================================
   SCRIPT - S.I. REGISTRO Y CONTROL DE INASISTENCIAS
   Evidencia: GA7-220501096-AA4-EV03 - Componente front-end
   Integrado con la API REST de inasistencias (AA5-EV04, carpeta API-REST)

   Funciones del archivo:
     1. Menú hamburguesa (mostrar / ocultar en pantallas pequeñas)
     2. Fecha y hora actual en el formulario
     3. Registro de la inasistencia: se envía a la API (servicio web)

   Este archivo también lo usan las páginas del proyecto Java (login y
   operarios) para el menú; por eso el formulario se maneja solo si existe.
   ===================================================================== */

"use strict"; // Modo estricto: ayuda a detectar errores de código

// Ancho (en px) a partir del cual el menú deja de ser hamburguesa.
// Debe coincidir con el @media (max-width: 600px) de estilos.css
const ANCHO_MOVIL = 600;

// Dirección del servicio web que guarda las inasistencias (API Node.js)
const URL_API_INASISTENCIAS = "http://localhost:10000/inasistencias";

// ---------- Elementos de la página que se van a usar ----------
const menu = document.getElementById("menu");
const botonHamburguesa = document.getElementById("btn-hamburguesa");
const listaMenu = document.getElementById("lista-menu");
const formulario = document.getElementById("form-inasistencia");
const campoFechaHora = document.getElementById("fecha-hora");
const mensaje = document.getElementById("mensaje-formulario");


/* ---------------------------------------------------------------------
   1. MENÚ HAMBURGUESA
   --------------------------------------------------------------------- */

// Muestra el menú si está oculto y lo oculta si está visible
function alternarMenu() {
    // classList.toggle agrega la clase si no está y la quita si está.
    // Devuelve true cuando el menú queda abierto.
    const estaAbierto = menu.classList.toggle("menu--abierto");

    // Informa a los lectores de pantalla el estado actual del menú
    botonHamburguesa.setAttribute("aria-expanded", String(estaAbierto));
}

// Cierra el menú y deja el botón en su estado inicial
function cerrarMenu() {
    menu.classList.remove("menu--abierto");
    botonHamburguesa.setAttribute("aria-expanded", "false");
}

if (menu && botonHamburguesa && listaMenu) {
    // Evento: clic en la hamburguesa
    botonHamburguesa.addEventListener("click", alternarMenu);

    // Evento: al elegir una opción del menú, se cierra (comodidad en el celular)
    listaMenu.addEventListener("click", function (evento) {
        if (evento.target.tagName === "A") {
            cerrarMenu();
        }
    });

    // Evento: si la ventana se agranda, se reinicia el menú para evitar
    // que quede en un estado raro al pasar de celular a computador
    window.addEventListener("resize", function () {
        if (window.innerWidth > ANCHO_MOVIL) {
            cerrarMenu();
        }
    });
}


/* ---------------------------------------------------------------------
   2. FECHA Y HORA ACTUAL
   --------------------------------------------------------------------- */

// Escribe en el campo "Fecha y Hora Actual" el momento presente
function ponerFechaActual() {
    const ahora = new Date();

    // toISOString() entrega la hora UTC; se resta la diferencia de zona
    // horaria para obtener la hora local de quien usa la página
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());

    // El campo datetime-local necesita el formato AAAA-MM-DDTHH:MM
    campoFechaHora.value = ahora.toISOString().slice(0, 16);
}


/* ---------------------------------------------------------------------
   3. REGISTRO DE LA INASISTENCIA (envío a la API)
   --------------------------------------------------------------------- */

// Muestra un mensaje debajo del formulario (verde si todo salió bien, rojo si hubo error)
function mostrarMensaje(texto, esError) {
    // textContent inserta solo texto (no HTML), lo cual es más seguro
    mensaje.textContent = texto;
    mensaje.classList.toggle("mensaje--error", esError);
    mensaje.hidden = false;
}

// Convierte los datos del formulario al formato que espera la API
function armarInasistencia() {
    // FormData recoge todos los campos que tienen atributo name
    const datos = Object.fromEntries(new FormData(formulario));

    return {
        idInasistencia: Number(datos.idInasistencia),
        documento: Number(datos.documento),
        // La fecha y hora local se envía con zona horaria (formato ISO)
        fechaHora: new Date(datos.fechaHora).toISOString(),
        idHorario: Number(datos.idHorario),
        fechaInasistencia: datos.fechaInasistencia,
        novedades: datos.novedades.trim()
    };
}

// Envía la inasistencia a la API con una petición POST
async function registrarInasistencia(evento) {
    // Evita que la página se recargue al enviar
    evento.preventDefault();

    const inasistencia = armarInasistencia();
    const botonEnviar = formulario.querySelector("button[type='submit']");
    botonEnviar.disabled = true;

    try {
        const respuesta = await fetch(URL_API_INASISTENCIAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inasistencia)
        });
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            // La API explica el problema (dato faltante, Id repetido, etc.)
            mostrarMensaje("No se registró: " + cuerpo.mensaje + ".", true);
            return;
        }

        mostrarMensaje(
            "Inasistencia N° " + cuerpo.idInasistencia +
            " registrada para el documento " + cuerpo.documento + ".",
            false
        );

        // Limpia el formulario y vuelve a poner la fecha actual
        formulario.reset();
        ponerFechaActual();
    } catch (error) {
        // No hubo respuesta: la API está apagada o no se puede alcanzar
        mostrarMensaje(
            "No se pudo conectar con la API de inasistencias. " +
            "Verifique que el servidor Node.js esté encendido (puerto 10000).",
            true
        );
    } finally {
        botonEnviar.disabled = false;
    }
}


/* ---------------------------------------------------------------------
   INICIO: acciones que se ejecutan al cargar la página
   --------------------------------------------------------------------- */
if (formulario) {
    formulario.addEventListener("submit", registrarInasistencia);
    ponerFechaActual();
}
