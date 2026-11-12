package com.inasistencias.inasistencias.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador de la pagina de inicio del sistema de inasistencias.
 */
@Controller
public class HomeController {

    /**
     * Muestra la pagina de inicio ("en construccion").
     * Si hay un operario con sesion iniciada, se envia su nombre a la vista.
     *
     * @param sesion sesion HTTP del usuario
     * @param modelo datos que se envian a la plantilla
     * @return nombre de la plantilla home.html
     */
    @GetMapping("/")
    public String mostrarInicio(HttpSession sesion, Model modelo) {
        modelo.addAttribute("nombreOperario", sesion.getAttribute(LoginController.ATRIBUTO_SESION));
        return "home";
    }
}
