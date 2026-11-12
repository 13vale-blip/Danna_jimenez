package com.inasistencias.inasistencias.config;

import com.inasistencias.inasistencias.controller.LoginController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor de seguridad: si el operario no ha iniciado sesion,
 * lo envia al formulario de login antes de entrar al modulo Operarios.
 */
@Component
public class SesionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest peticion, HttpServletResponse respuesta, Object manejador)
            throws Exception {
        HttpSession sesion = peticion.getSession(false);
        boolean haIniciadoSesion = sesion != null && sesion.getAttribute(LoginController.ATRIBUTO_SESION) != null;

        if (!haIniciadoSesion) {
            respuesta.sendRedirect(peticion.getContextPath() + "/login");
            return false;
        }
        return true;
    }
}
