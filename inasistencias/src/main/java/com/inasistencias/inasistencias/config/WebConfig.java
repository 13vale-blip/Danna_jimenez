package com.inasistencias.inasistencias.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Configuracion web del proyecto integrado.
 *
 * 1. Publica el front-end del proyecto formativo (index.html, estilos.css,
 *    script.js e Imagenes/), que esta en la raiz del repositorio, sin copiarlo.
 *    Solo se publican esos archivos: el resto de carpetas del repositorio
 *    (por ejemplo API-REST/.env) nunca queda accesible desde el navegador.
 * 2. Registra el interceptor que exige iniciar sesion para entrar a /operarios.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger LOG = LoggerFactory.getLogger(WebConfig.class);

    /** Archivos sueltos del front-end que se publican (y nada mas). */
    private static final String[] ARCHIVOS_FRONTEND = {"/index.html", "/estilos.css", "/script.js"};

    /** Carpeta de imagenes del front-end. */
    private static final String CARPETA_IMAGENES = "Imagenes";

    /** Carpeta del front-end; si esta vacia se busca automaticamente. */
    private final String rutaConfigurada;

    private final SesionInterceptor sesionInterceptor;

    public WebConfig(@Value("${frontend.ruta:}") String rutaConfigurada,
                     SesionInterceptor sesionInterceptor) {
        this.rutaConfigurada = rutaConfigurada;
        this.sesionInterceptor = sesionInterceptor;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registro) {
        Path carpetaFrontend = buscarCarpetaFrontend();
        if (carpetaFrontend == null) {
            LOG.warn("No se encontro el front-end (index.html y estilos.css). "
                    + "Ejecute el proyecto desde la carpeta inasistencias o configure frontend.ruta.");
            return;
        }
        LOG.info("Front-end publicado desde {}", carpetaFrontend);
        registro.addResourceHandler(ARCHIVOS_FRONTEND)
                .addResourceLocations(carpetaFrontend.toUri().toString());
        registro.addResourceHandler("/" + CARPETA_IMAGENES + "/**")
                .addResourceLocations(carpetaFrontend.resolve(CARPETA_IMAGENES).toUri().toString());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registro) {
        // Todo el modulo Operarios requiere haber iniciado sesion
        registro.addInterceptor(sesionInterceptor).addPathPatterns("/operarios", "/operarios/**");
    }

    /**
     * Busca la carpeta que contiene index.html y estilos.css.
     * Primero la ruta configurada; luego la carpeta padre (cuando se ejecuta
     * desde inasistencias/) y por ultimo la carpeta actual (raiz del repositorio).
     */
    private Path buscarCarpetaFrontend() {
        List<String> candidatas = new ArrayList<>();
        if (!rutaConfigurada.isBlank()) {
            candidatas.add(rutaConfigurada);
        }
        candidatas.add("..");
        candidatas.add(".");

        for (String candidata : candidatas) {
            Path carpeta = Path.of(candidata).toAbsolutePath().normalize();
            if (Files.isRegularFile(carpeta.resolve("index.html"))
                    && Files.isRegularFile(carpeta.resolve("estilos.css"))) {
                return carpeta;
            }
        }
        return null;
    }
}
