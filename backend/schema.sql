CREATE DATABASE IF NOT EXISTS control_asistencias CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE control_asistencias;

DROP TABLE IF EXISTS asistencias;
DROP TABLE IF EXISTS pases_lista;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS clases;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN','TEACHER','STUDENT') NOT NULL,
  matricula VARCHAR(50) NULL,
  numero_empleado VARCHAR(50) NULL
);

CREATE TABLE clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  grupo VARCHAR(50) NOT NULL,
  id_docente INT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_docente) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_clase INT NOT NULL,
  id_estudiante INT NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_clase) REFERENCES clases(id) ON DELETE CASCADE,
  FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE pases_lista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_clase INT NOT NULL,
  id_docente INT NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NULL,
  hora_fin TIME NULL,
  observaciones TEXT NULL,
  completado TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (id_clase) REFERENCES clases(id) ON DELETE CASCADE,
  FOREIGN KEY (id_docente) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pase_lista INT NOT NULL,
  id_estudiante INT NOT NULL,
  estado ENUM('A','F','R') NOT NULL,
  observaciones TEXT NULL,
  FOREIGN KEY (id_pase_lista) REFERENCES pases_lista(id) ON DELETE CASCADE,
  FOREIGN KEY (id_estudiante) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Usuarios de ejemplo
INSERT INTO usuarios (nombre, apellidos, email, password, rol, numero_empleado)
VALUES
  ('Porfirio', 'Alexander Beltran Rojo', 'porfirio.beltran@uaem.edu.mx', '1234', 'ADMIN', 'ADM-001'),
  ('Sergio', 'Valdez Mota', 'sergio.valdez@uaem.edu.mx', '1234', 'TEACHER', 'DOC-001');

INSERT INTO usuarios (nombre, apellidos, email, password, rol, matricula)
VALUES
  ('Diana Denisse', 'Camara Chavez', 'diana.camara@uaem.edu.mx', '1234', 'STUDENT', 'ALU-001'),
  ('Ernesto Fabrizzio', 'Cazares Hernandez', 'ernesto.cazares@uaem.edu.mx', '1234', 'STUDENT', 'ALU-002'),
  ('Moises', 'Conde Escobar', 'moises.conde@uaem.edu.mx', '1234', 'STUDENT', 'ALU-003');

INSERT INTO clases (nombre, grupo, id_docente, activa)
VALUES
  ('Matemáticas I', '3A', 2, 1),
  ('Programación Web', '3B', 2, 1);

INSERT INTO inscripciones (id_clase, id_estudiante, activa)
VALUES
  (1, 3, 1),
  (1, 4, 1),
  (1, 5, 1),
  (2, 3, 1),
  (2, 5, 1);

INSERT INTO pases_lista (id_clase, id_docente, fecha, hora_inicio, hora_fin, completado)
VALUES
  (1, 2, '2025-03-01', '08:00:00', '08:10:00', 1),
  (1, 2, '2025-03-02', '08:00:00', '08:10:00', 1),
  (2, 2, '2025-03-01', '09:00:00', '09:10:00', 1);

INSERT INTO asistencias (id_pase_lista, id_estudiante, estado)
VALUES
  (1, 3, 'A'),
  (1, 4, 'F'),
  (1, 5, 'A'),
  (2, 3, 'A'),
  (2, 5, 'R'),
  (3, 3, 'A');
