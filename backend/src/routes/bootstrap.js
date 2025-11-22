const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/", async (req, res) => {
  try {
    const usuarios = await query(
      "SELECT id, nombre, apellidos, email, rol FROM usuarios"
    );

    const classes = await query(
      "SELECT id, nombre AS name, grupo, id_docente FROM clases"
    );

    const enrollments = await query(
      "SELECT id, id_clase AS classId, id_estudiante AS studentId FROM inscripciones"
    );

    const attendanceRows = await query(
      `SELECT a.id,
              p.id_clase AS classId,
              a.id_estudiante AS studentId,
              DATE_FORMAT(p.fecha, '%Y-%m-%d') AS date,
              a.estado AS status
       FROM asistencias a
       JOIN pases_lista p ON a.id_pase_lista = p.id`
    );

    const users = usuarios.map((u) => ({
      id: u.id,
      name: u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre,
      email: u.email,
      role: u.rol
    }));

    const classesMapped = classes.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.grupo,
      teacherId: c.id_docente
    }));

    res.json({
      users,
      classes: classesMapped,
      enrollments,
      attendance: attendanceRows
    });
  } catch (err) {
    console.error("Error en /bootstrap", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
