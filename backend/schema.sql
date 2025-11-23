-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: control_asistencias
-- ------------------------------------------------------
-- Server version	8.4.5

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
  `estado` enum('A','F','R') COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id_pase_lista` (`id_pase_lista`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`id_pase_lista`) REFERENCES `pases_lista` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,1,3,'A',NULL),(2,1,4,'F',NULL),(3,1,5,'A',NULL),(4,2,3,'A',NULL),(5,2,5,'R',NULL),(6,3,3,'A',NULL),(7,4,3,'A',NULL),(8,4,4,'F',NULL),(9,4,5,'R',NULL),(13,6,3,'A',NULL),(14,6,4,'F',NULL),(15,6,5,'R',NULL),(16,5,3,'A',NULL),(17,5,4,'F',NULL),(18,5,5,'F',NULL),(19,7,3,'A',NULL),(20,7,4,'F',NULL),(21,7,5,'R',NULL),(22,8,3,'A',NULL),(23,8,4,'F',NULL),(24,8,5,'A',NULL),(25,8,6,'A',NULL),(26,9,3,'A',NULL),(27,9,4,'A',NULL),(28,9,5,'A',NULL),(29,9,6,'A',NULL);
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
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_clase` (`id_clase`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `pases_lista_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pases_lista_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pases_lista`
--

LOCK TABLES `pases_lista` WRITE;
/*!40000 ALTER TABLE `pases_lista` DISABLE KEYS */;
INSERT INTO `pases_lista` VALUES (1,1,2,'2025-03-01','08:00:00','08:10:00',NULL,1),(2,1,2,'2025-03-02','08:00:00','08:10:00',NULL,1),(3,2,2,'2025-03-01','09:00:00','09:10:00',NULL,1),(4,1,2,'2025-11-21','23:16:59',NULL,NULL,1),(5,1,2,'2025-11-22','08:16:14',NULL,NULL,1),(6,1,2,'2025-11-20','08:47:17',NULL,NULL,1),(7,3,2,'2025-11-22','09:25:40',NULL,NULL,1),(8,1,2,'2025-11-23','09:28:12',NULL,NULL,1),(9,1,2,'2025-11-12','09:28:45',NULL,NULL,1);
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
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('ADMIN','TEACHER','STUDENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricula` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_empleado` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Porfirio','Alexander Beltran Rojo','porfirio.beltran@uaem.edu.mx','1234','ADMIN',NULL,'ADM-001'),(2,'Sergio','Valdez Mota','sergio.valdez@uaem.edu.mx','1234','TEACHER',NULL,'DOC-001'),(3,'Diana Denisse','Camara Chavez','diana.camara@uaem.edu.mx','1234','STUDENT','ALU-001',NULL),(4,'Ernesto Fabrizzio','Cazares Hernandez','ernesto.cazares@uaem.edu.mx','1234','STUDENT','ALU-002',NULL),(5,'Moises','Conde Escobar','moises.conde@uaem.edu.mx','1234','STUDENT','ALU-003',NULL),(6,'Victor','Villalba Esquivel','victor.villalba@uaem.edu.mx','1','STUDENT',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22 11:14:45
