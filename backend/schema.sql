-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: control_asistencias
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'd63dd488-c720-11f0-b4ae-28e70e91acad:1-49';

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pase_lista` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `estado` enum('A','F','R') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id_pase_lista` (`id_pase_lista`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_pase_lista`) REFERENCES `pases_lista` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,1,3,'A',NULL),(2,1,4,'F',NULL),(3,1,5,'A',NULL),(4,2,3,'A',NULL),(5,2,5,'R',NULL),(6,3,3,'A',NULL),(7,4,3,'A',NULL),(8,4,4,'F',NULL),(9,4,5,'R',NULL),(13,6,3,'A',NULL),(14,6,4,'F',NULL),(15,6,5,'R',NULL),(16,5,3,'A',NULL),(17,5,4,'F',NULL),(18,5,5,'F',NULL),(19,7,3,'A',NULL),(20,7,4,'F',NULL),(21,7,5,'R',NULL),(26,9,3,'A',NULL),(27,9,4,'A',NULL),(28,9,5,'A',NULL),(29,9,6,'A',NULL),(30,8,3,'A',NULL),(31,8,4,'F',NULL),(32,8,5,'R',NULL),(33,8,6,'R',NULL),(34,10,3,'A',NULL),(35,10,4,'A',NULL),(36,10,5,'A',NULL),(37,10,6,'A',NULL),(38,11,3,'A',NULL),(39,11,4,'A',NULL),(40,11,5,'F',NULL),(41,11,6,'R',NULL),(42,12,3,'A',NULL),(43,12,4,'A',NULL),(44,12,5,'A',NULL),(45,12,6,'A',NULL);
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clases`
--

DROP TABLE IF EXISTS `clases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_docente` int DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clases`
--

LOCK TABLES `clases` WRITE;
/*!40000 ALTER TABLE `clases` DISABLE KEYS */;
INSERT INTO `clases` VALUES (1,'Matemáticas I','3A',2,1),(2,'Programación Web','3B',2,1),(3,'Ingenieria de programacion','3A',2,1);
/*!40000 ALTER TABLE `clases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_clase` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_clase` (`id_clase`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
INSERT INTO `inscripciones` VALUES (18,1,3,1),(19,1,4,1),(20,1,5,1),(21,1,6,1),(22,2,3,1),(23,2,5,1),(24,2,6,1),(25,2,4,1),(26,3,4,1),(27,3,3,1),(28,3,5,1),(29,3,6,1);
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pases_lista`
--

DROP TABLE IF EXISTS `pases_lista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pases_lista` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_clase` int NOT NULL,
  `id_docente` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_clase` (`id_clase`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `pases_lista_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pases_lista_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pases_lista`
--

LOCK TABLES `pases_lista` WRITE;
/*!40000 ALTER TABLE `pases_lista` DISABLE KEYS */;
INSERT INTO `pases_lista` VALUES (1,1,2,'2025-03-01','08:00:00','08:10:00',NULL,1),(2,1,2,'2025-03-02','08:00:00','08:10:00',NULL,1),(3,2,2,'2025-03-01','09:00:00','09:10:00',NULL,1),(4,1,2,'2025-11-21','23:16:59',NULL,NULL,1),(5,1,2,'2025-11-22','08:16:14',NULL,NULL,1),(6,1,2,'2025-11-20','08:47:17',NULL,NULL,1),(7,3,2,'2025-11-22','09:25:40',NULL,NULL,1),(8,1,2,'2025-11-23','09:28:12',NULL,NULL,1),(9,1,2,'2025-11-12','09:28:45',NULL,NULL,1),(10,1,2,'2025-11-24','07:23:26',NULL,NULL,1),(11,2,2,'2025-11-24','07:54:12',NULL,NULL,1),(12,1,2,'2025-11-25','17:07:01',NULL,NULL,1);
/*!40000 ALTER TABLE `pases_lista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('ADMIN','TEACHER','STUDENT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricula` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_empleado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Porfirio','Alexander Beltran Rojo','porfirio.beltran@uaem.edu.mx','1234','ADMIN',NULL,'ADM-001'),(2,'Sergio','Valdez Mota','sergio.valdez@uaem.edu.mx','1234','TEACHER',NULL,'DOC-001'),(3,'Diana Denisse','Camara Chavez','diana.camara@uaem.edu.mx','1234','STUDENT','ALU-001',NULL),(4,'Ernesto Fabrizzio','Cazares Hernandez','ernesto.cazares@uaem.edu.mx','1234','STUDENT','ALU-002',NULL),(5,'Moises','Conde Escobar','moises.conde@uaem.edu.mx','1234','STUDENT','ALU-003',NULL),(6,'Victor','Villalba Esquivel','victor.villalba@uaem.edu.mx','1','STUDENT',NULL,NULL),(7,'Alejandro','Gimeno Rios','alejandro.gimeno@uaem.edu.mx','1234','STUDENT','ALU-004',NULL),(8,'David Salvador','Chávez Flores','david.chavez@uaem.edu.mx','1234','STUDENT','ALU-005',NULL),(9,'Diego Emiliano','Romo Lozano','diego.romo@uaem.edu.mx','1234','STUDENT','ALU-006',NULL),(10,'Edson Osvaldo','Morales Hernandez','edson.morales@uaem.edu.mx','1234','STUDENT','ALU-007',NULL),(11,'Gerardo','Cabrera Orihuela','gerardo.cabrera@uaem.edu.mx','1234','STUDENT','ALU-008',NULL),(12,'Grecia Naomi','Ocampo Mendoza','grecia.ocampo@uaem.edu.mx','1234','STUDENT','ALU-009',NULL),(13,'Ian Taillu','Villamil Flores','ian.villamil@uaem.edu.mx','1234','STUDENT','ALU-010',NULL),(14,'Jesús Alfonso','Nava Estrada','jesus.nava@uaem.edu.mx','1234','STUDENT','ALU-011',NULL),(15,'José Alberto','Pérez Torres','jose.perez@uaem.edu.mx','1234','STUDENT','ALU-012',NULL),(16,'José Antonio','Bazan González','jose.bazan@uaem.edu.mx','1234','STUDENT','ALU-013',NULL),(17,'José Antonio','Esquivel Alvarez','jose.esquivel@uaem.edu.mx','1234','STUDENT','ALU-014',NULL),(18,'Juan Cristian','Osorio Martínez','juan.osorio@uaem.edu.mx','1234','STUDENT','ALU-015',NULL),(19,'Juan','Gonzales Jimenez','juan.gonzales@uaem.edu.mx','1234','STUDENT','ALU-016',NULL),(20,'Keyla','Flores Rayo','keyla.flores@uaem.edu.mx','1234','STUDENT','ALU-017',NULL),(21,'Mario Alejandro','Martinez González','mario.martinez@uaem.edu.mx','1234','STUDENT','ALU-018',NULL),(22,'Mauricio Clemente','Clemente Barragán','mauricio.clemente@uaem.edu.mx','1234','STUDENT','ALU-019',NULL),(23,'Porfirio Alexander','Beltran Rojo','porfirio.beltran.rojo@uaem.edu.mx','1234','STUDENT','ALU-020',NULL),(24,'Roberto Antonio','Neri Rifas','roberto.neri@uaem.edu.mx','1234','STUDENT','ALU-021',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 11:23:27
