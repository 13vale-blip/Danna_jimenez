package com.inasistencias.inasistencias.repository;

import com.inasistencias.inasistencias.modelo.Operarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Repositorio de la entidad Operarios.
 * Al extender JpaRepository obtiene los metodos basicos del CRUD:
 * findAll, findById, existsById, save y deleteById.
 */
public interface OperariosRepository extends JpaRepository<Operarios, Long> {

    /**
     * Busca un operario por nombre y contrasena (se usa en el login).
     *
     * @param nombreOperario nombre escrito en el formulario
     * @param password       contrasena escrita en el formulario
     * @return el operario si los datos coinciden, o vacio si no
     */
    Optional<Operarios> findByNombreOperarioAndPassword(String nombreOperario, String password);

    /**
     * Cuenta cuantos tipos de operario tienen el id indicado (0 si no existe).
     */
    @Query(value = "SELECT COUNT(*) FROM `tipos operarios` WHERE Id_Tipo_Operario = :idTipoOperario",
            nativeQuery = true)
    long contarTipoOperario(@Param("idTipoOperario") Integer idTipoOperario);

    /**
     * Cuenta cuantos tipos de documento tienen el id indicado (0 si no existe).
     */
    @Query(value = "SELECT COUNT(*) FROM `tipos documentos` WHERE Id_Tipo_Documento = :idTipoDocumento",
            nativeQuery = true)
    long contarTipoDocumento(@Param("idTipoDocumento") Integer idTipoDocumento);
}
