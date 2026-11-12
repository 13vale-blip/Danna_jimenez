package com.inasistencias.inasistencias.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidad que representa la tabla "operarios" del esquema inasistencias.
 * Cada atributo se relaciona con una columna de la tabla.
 * Las columnas de llaves foraneas tienen espacios en el nombre, por eso
 * se escriben entre comillas invertidas dentro de @Column.
 */
@Entity
@Table(name = "operarios")
public class Operarios {

    /** Identificador del operario (llave primaria, no se edita). */
    @Id
    @Column(name = "Id_Login")
    private Long idLogin;

    /** Nombre del operario; tambien se usa como usuario en el login. */
    @Column(name = "Nombre_Operario", length = 100)
    private String nombreOperario;

    /** Contrasena (maximo 8 caracteres, segun el diseno de la base de datos). */
    @Column(name = "Password", length = 8)
    private String password;

    /** Confirmacion de la contrasena; debe ser igual a password. */
    @Column(name = "Confirmar_Password", length = 8)
    private String confirmarPassword;

    /** Llave foranea hacia la tabla "tipos operarios". */
    @Column(name = "`TIPOS OPERARIOS_Id_Tipo_Operario`", nullable = false)
    private Integer idTipoOperario;

    /** Llave foranea hacia la tabla "tipos documentos". */
    @Column(name = "`TIPOS DOCUMENTOS_Id_Tipo_Documento`", nullable = false)
    private Integer idTipoDocumento;

    /** Constructor vacio requerido por JPA. */
    public Operarios() {
    }

    // ----- Metodos de acceso (getters y setters) -----

    public Long getIdLogin() {
        return idLogin;
    }

    public void setIdLogin(Long idLogin) {
        this.idLogin = idLogin;
    }

    public String getNombreOperario() {
        return nombreOperario;
    }

    public void setNombreOperario(String nombreOperario) {
        this.nombreOperario = nombreOperario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmarPassword() {
        return confirmarPassword;
    }

    public void setConfirmarPassword(String confirmarPassword) {
        this.confirmarPassword = confirmarPassword;
    }

    public Integer getIdTipoOperario() {
        return idTipoOperario;
    }

    public void setIdTipoOperario(Integer idTipoOperario) {
        this.idTipoOperario = idTipoOperario;
    }

    public Integer getIdTipoDocumento() {
        return idTipoDocumento;
    }

    public void setIdTipoDocumento(Integer idTipoDocumento) {
        this.idTipoDocumento = idTipoDocumento;
    }
}
