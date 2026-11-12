-- Script de la base de datos del proyecto (esquema inasistencias, MySQL 8)
-- Nombres tomados del diagrama del instructor. Las tablas con espacios van entre comillas invertidas.

CREATE DATABASE IF NOT EXISTS inasistencias;
USE inasistencias;

CREATE TABLE `tipos operarios` (
  Id_Tipo_Operario INT NOT NULL PRIMARY KEY,
  Nombre_Tipo_Operario VARCHAR(30)
);

CREATE TABLE `tipos documentos` (
  Id_Tipo_Documento INT NOT NULL PRIMARY KEY,
  Nombre_Tipo_Documento VARCHAR(30)
);

CREATE TABLE operarios (
  Id_Login INT NOT NULL PRIMARY KEY,
  Nombre_Operario VARCHAR(100),
  Password VARCHAR(8),
  Confirmar_Password VARCHAR(8),
  `TIPOS OPERARIOS_Id_Tipo_Operario` INT NOT NULL,
  `TIPOS DOCUMENTOS_Id_Tipo_Documento` INT NOT NULL,
  FOREIGN KEY (`TIPOS OPERARIOS_Id_Tipo_Operario`) REFERENCES `tipos operarios`(Id_Tipo_Operario),
  FOREIGN KEY (`TIPOS DOCUMENTOS_Id_Tipo_Documento`) REFERENCES `tipos documentos`(Id_Tipo_Documento)
);

-- Datos de ejemplo
INSERT INTO `tipos operarios` VALUES (1,'Administrador'),(2,'Auxiliar');
INSERT INTO `tipos documentos` VALUES (1,'CC'),(2,'TI');
INSERT INTO operarios VALUES (1,'Maria Vargas','12345','12345',1,1);
