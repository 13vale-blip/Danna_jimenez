package com.inasistencias.inasistencias.controller;

import com.inasistencias.inasistencias.modelo.Operarios;
import com.inasistencias.inasistencias.repository.OperariosRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

/**
 * Controlador del login de operarios.
 * Valida el nombre del operario y su contrasena contra la tabla "operarios".
 */
@Controller
public class LoginController {

    /** Nombre del atributo de sesion donde se guarda el operario que ingreso. */
    public static final String ATRIBUTO_SESION = "operarioActual";

    /** Mensaje que se muestra cuando los datos no coinciden. */
    private static final String MENSAJE_ERROR = "Los datos de operario o contraseña son incorrectos";

    private final OperariosRepository operariosRepository;

    /** Spring inyecta el repositorio por el constructor. */
    public LoginController(OperariosRepository operariosRepository) {
        this.operariosRepository = operariosRepository;
    }

    /**
     * Muestra el formulario de ingreso.
     */
    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";
    }

    /**
     * Recibe el formulario de ingreso y valida los datos.
     *
     * @param usuario  nombre del operario
     * @param password contrasena escrita
     * @param sesion   sesion HTTP, donde se guarda el operario si ingresa
     * @param modelo   datos para la vista en caso de error
     * @return redireccion al inicio si es correcto, o el login con el mensaje de error
     */
    @PostMapping("/login")
    public String validarLogin(@RequestParam("usuario") String usuario,
                               @RequestParam("password") String password,
                               HttpSession sesion,
                               Model modelo) {
        Optional<Operarios> operario =
                operariosRepository.findByNombreOperarioAndPassword(usuario.trim(), password);

        if (operario.isPresent()) {
            // Datos correctos: se guarda el nombre en la sesion y se va al inicio
            sesion.setAttribute(ATRIBUTO_SESION, operario.get().getNombreOperario());
            return "redirect:/";
        }

        // Datos incorrectos: se vuelve al login con el mensaje y el usuario escrito
        modelo.addAttribute("mensajeError", MENSAJE_ERROR);
        modelo.addAttribute("usuario", usuario);
        return "login";
    }

    /**
     * Cierra la sesion del operario y vuelve al login.
     */
    @GetMapping("/logout")
    public String cerrarSesion(HttpSession sesion) {
        sesion.invalidate();
        return "redirect:/login";
    }
}
