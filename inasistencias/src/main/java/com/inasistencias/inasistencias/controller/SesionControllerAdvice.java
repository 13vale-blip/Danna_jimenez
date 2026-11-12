package com.inasistencias.inasistencias.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Envia a todas las plantillas el nombre del operario que inicio sesion,
 * para mostrarlo en la barra del modulo junto al enlace "Salir".
 */
@ControllerAdvice
public class SesionControllerAdvice {

    @ModelAttribute("operarioActual")
    public Object operarioActual(HttpSession sesion) {
        return sesion.getAttribute(LoginController.ATRIBUTO_SESION);
    }
}
