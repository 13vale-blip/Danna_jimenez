package com.inasistencias.inasistencias.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador de la pagina de inicio.
 * El inicio es el front-end del proyecto formativo (index.html de la raiz
 * del repositorio), que publica WebConfig.
 */
@Controller
public class HomeController {

    /**
     * Muestra la pagina principal de la institucion.
     *
     * @return reenvio interno al index.html del front-end
     */
    @GetMapping("/")
    public String mostrarInicio() {
        return "forward:/index.html";
    }
}
