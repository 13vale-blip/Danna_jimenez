/* =====================================================================
   SCRIPT - S.I. REGISTRO Y CONTROL DE INASISTENCIAS
   Evidencia: GA7-220501096-AA4-EV03 - Componente front-end

   Funciones del archivo:
     1. Menú hamburguesa (mostrar / ocultar en pantallas pequeñas)
     2. Fecha y hora actual en el formulario
     3. Registro de la inasistencia con mensaje de confirmación
   ===================================================================== */

"use strict"; // Modo estricto: ayuda a detectar errores de código

// Ancho (en px) a partir del cual el menú deja de ser hamburguesa.
// Debe coincidir con el @media (max-width: 600px) de estilos.css
const ANCHO_MOVIL = 600;

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
   3. REGISTRO DE LA INASISTENCIA
   --------------------------------------------------------------------- */

// Muestra un mensaje de confirmación debajo del formulario
function mostrarMensaje(texto) {
    // textContent inserta solo texto (no HTML), lo cual es más seguro
    mensaje.textContent = texto;
    mensaje.hidden = false;
}

// Evento: envío del formulario
formulario.addEventListener("submit", function (evento) {
    // Evita que la página se recargue al enviar
    evento.preventDefault();

    // FormData recoge todos los campos que tienen atributo name
    const datos = Object.fromEntries(new FormData(formulario));

    // Por ahora no hay servidor: los datos se muestran en la consola.
    // En la fase de back-end se enviarán a la API (servicio web).
    console.log("Inasistencia registrada:", datos);

    mostrarMensaje(
        "Inasistencia N° " + datos.idInasistencia +
        " registrada para el documento " + datos.documento + "."
    );

    // Limpia el formulario y vuelve a poner la fecha actual
    formulario.reset();
    ponerFechaActual();
});


/* ---------------------------------------------------------------------
   INICIO: acciones que se ejecutan al cargar la página
   --------------------------------------------------------------------- */
ponerFechaActual();
