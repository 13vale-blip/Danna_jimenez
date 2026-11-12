package com.inasistencias.inasistencias.controller;

import com.inasistencias.inasistencias.modelo.Operarios;
import com.inasistencias.inasistencias.repository.OperariosRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

/**
 * Controlador del Modulo 1: Operarios.
 * Implementa el CRUD: Create (registrar), Read (consultar),
 * Update (editar) y Delete (eliminar).
 */
@Controller
@RequestMapping("/operarios")
public class OperariosController {

    /** Longitud maxima de la contrasena segun la tabla (VARCHAR(8)). */
    private static final int LONGITUD_MAXIMA_PASSWORD = 8;

    /** Longitud maxima del nombre segun la tabla (VARCHAR(100)). */
    private static final int LONGITUD_MAXIMA_NOMBRE = 100;

    private final OperariosRepository operariosRepository;

    /** Spring inyecta el repositorio por el constructor. */
    public OperariosController(OperariosRepository operariosRepository) {
        this.operariosRepository = operariosRepository;
    }

    // ===================== READ: consultar =====================

    /**
     * Consulta todos los operarios y los muestra en una tabla.
     */
    @GetMapping
    public String listarOperarios(Model modelo) {
        modelo.addAttribute("operarios", operariosRepository.findAll());
        return "operarios";
    }

    // ===================== CREATE: registrar =====================

    /**
     * Muestra el formulario vacio para registrar un operario.
     */
    @GetMapping("/nuevo")
    public String mostrarFormularioRegistro(Model modelo) {
        modelo.addAttribute("operario", new Operarios());
        modelo.addAttribute("esEdicion", false);
        return "operario-form";
    }

    /**
     * Recibe el formulario de registro, valida los datos y guarda el operario.
     */
    @PostMapping("/guardar")
    public String registrarOperario(@ModelAttribute("operario") Operarios operario,
                                    BindingResult resultadoBinding,
                                    Model modelo,
                                    RedirectAttributes redireccion) {
        String error = validarCamposNumericos(resultadoBinding);

        if (error == null && operario.getIdLogin() == null) {
            error = "El ID del operario es obligatorio.";
        }
        if (error == null && operariosRepository.existsById(operario.getIdLogin())) {
            error = "Ya existe un operario con el ID " + operario.getIdLogin() + ".";
        }
        if (error == null) {
            error = validarDatosOperario(operario);
        }

        if (error != null) {
            // Se devuelve el formulario con los datos escritos y el mensaje de error
            modelo.addAttribute("mensajeError", error);
            modelo.addAttribute("esEdicion", false);
            return "operario-form";
        }

        operario.setNombreOperario(operario.getNombreOperario().trim());
        operariosRepository.save(operario);
        redireccion.addFlashAttribute("mensajeExito",
                "Operario " + operario.getNombreOperario() + " registrado correctamente.");
        return "redirect:/operarios";
    }

    // ===================== UPDATE: editar =====================

    /**
     * Muestra el formulario de edicion con los datos actuales del operario.
     */
    @GetMapping("/editar/{idLogin}")
    public String mostrarFormularioEdicion(@PathVariable Long idLogin,
                                           Model modelo,
                                           RedirectAttributes redireccion) {
        Optional<Operarios> operario = operariosRepository.findById(idLogin);
        if (operario.isEmpty()) {
            redireccion.addFlashAttribute("mensajeError", "No existe un operario con el ID " + idLogin + ".");
            return "redirect:/operarios";
        }
        modelo.addAttribute("operario", operario.get());
        modelo.addAttribute("esEdicion", true);
        return "operario-form";
    }

    /**
     * Recibe el formulario de edicion y actualiza el operario.
     * El ID se toma de la URL, no del formulario, para que no se pueda cambiar.
     */
    @PostMapping("/actualizar/{idLogin}")
    public String actualizarOperario(@PathVariable Long idLogin,
                                     @ModelAttribute("operario") Operarios operario,
                                     BindingResult resultadoBinding,
                                     Model modelo,
                                     RedirectAttributes redireccion) {
        Optional<Operarios> operarioActual = operariosRepository.findById(idLogin);
        if (operarioActual.isEmpty()) {
            redireccion.addFlashAttribute("mensajeError", "No existe un operario con el ID " + idLogin + ".");
            return "redirect:/operarios";
        }

        // El Id_Login no se edita: se fuerza el valor de la URL
        operario.setIdLogin(idLogin);

        // Si no se escribe una contrasena nueva, se conserva la actual
        if (estaVacio(operario.getPassword()) && estaVacio(operario.getConfirmarPassword())) {
            operario.setPassword(operarioActual.get().getPassword());
            operario.setConfirmarPassword(operarioActual.get().getConfirmarPassword());
        }

        String error = validarCamposNumericos(resultadoBinding);
        if (error == null) {
            error = validarDatosOperario(operario);
        }

        if (error != null) {
            modelo.addAttribute("mensajeError", error);
            modelo.addAttribute("esEdicion", true);
            return "operario-form";
        }

        operario.setNombreOperario(operario.getNombreOperario().trim());
        operariosRepository.save(operario);
        redireccion.addFlashAttribute("mensajeExito",
                "Operario con ID " + idLogin + " actualizado correctamente.");
        return "redirect:/operarios";
    }

    // ===================== DELETE: eliminar =====================

    /**
     * Elimina el operario indicado. La confirmacion se pide en el navegador
     * antes de enviar el formulario (ventana "confirm" en operarios.html).
     */
    @PostMapping("/eliminar/{idLogin}")
    public String eliminarOperario(@PathVariable Long idLogin, RedirectAttributes redireccion) {
        if (!operariosRepository.existsById(idLogin)) {
            redireccion.addFlashAttribute("mensajeError", "No existe un operario con el ID " + idLogin + ".");
            return "redirect:/operarios";
        }
        operariosRepository.deleteById(idLogin);
        redireccion.addFlashAttribute("mensajeExito", "Operario con ID " + idLogin + " eliminado.");
        return "redirect:/operarios";
    }

    // ===================== Validaciones =====================

    /** Indica si un texto es nulo o esta vacio. */
    private boolean estaVacio(String texto) {
        return texto == null || texto.isEmpty();
    }

    /**
     * Revisa si algun campo numerico (ID o tipos) trae texto que no es un numero.
     *
     * @return mensaje de error, o null si no hay errores de conversion
     */
    private String validarCamposNumericos(BindingResult resultadoBinding) {
        if (resultadoBinding.hasErrors()) {
            return "El ID, el tipo de operario y el tipo de documento deben ser números enteros.";
        }
        return null;
    }

    /**
     * Validaciones comunes para registrar y editar.
     *
     * @return mensaje de error, o null si los datos son validos
     */
    private String validarDatosOperario(Operarios operario) {
        String nombre = operario.getNombreOperario();
        String password = operario.getPassword();
        String confirmarPassword = operario.getConfirmarPassword();

        if (nombre == null || nombre.isBlank()) {
            return "El nombre del operario es obligatorio.";
        }
        if (nombre.trim().length() > LONGITUD_MAXIMA_NOMBRE) {
            return "El nombre del operario admite máximo " + LONGITUD_MAXIMA_NOMBRE + " caracteres.";
        }
        if (password == null || password.isEmpty()) {
            return "La contraseña es obligatoria.";
        }
        if (password.length() > LONGITUD_MAXIMA_PASSWORD) {
            return "La contraseña admite máximo " + LONGITUD_MAXIMA_PASSWORD + " caracteres.";
        }
        if (!password.equals(confirmarPassword)) {
            return "La contraseña y la confirmación no coinciden.";
        }
        if (operario.getIdTipoOperario() == null
                || operariosRepository.contarTipoOperario(operario.getIdTipoOperario()) == 0) {
            return "El tipo de operario indicado no existe.";
        }
        if (operario.getIdTipoDocumento() == null
                || operariosRepository.contarTipoDocumento(operario.getIdTipoDocumento()) == 0) {
            return "El tipo de documento indicado no existe.";
        }
        return null;
    }
}
