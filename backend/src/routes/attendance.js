const express = require("express");
const router = express.Router();
const { query, pool } = require("../db");

router.get("/", async (req, res) => {
  try {
    const classId = Number(req.query.classId);
    const date = req.query.date;
    if (!classId || !date) {
      return res
        .status(400)
        .json({ error: "classId y date son requeridos" });
    }

    const pases = await query(
      "SELECT * FROM pases_lista WHERE id_clase = ? AND fecha = ? LIMIT 1",
      [classId, date]
    );

    if (pases.length === 0) {
      return res.json({ paseLista: null, records: [] });
    }

    const pase = pases[0];
    const records = await query(
      `SELECT a.id,
              a.id_estudiante AS studentId,
              a.estado AS status,
              a.observaciones
       FROM asistencias a
       WHERE a.id_pase_lista = ?`,
      [pase.id]
    );

    res.json({
      paseLista: {
        id: pase.id,
        classId: pase.id_clase,
        teacherId: pase.id_docente,
        date: pase.fecha
      },
      records
    });
  } catch (err) {
    console.error("Error en GET /attendance", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/save", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { classId, teacherId, date, records } = req.body;
    if (!classId || !teacherId || !date || !Array.isArray(records)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    await connection.beginTransaction();

    const [pases] = await connection.execute(
      "SELECT * FROM pases_lista WHERE id_clase = ? AND fecha = ? LIMIT 1",
      [classId, date]
    );

    let paseId;
    if (pases.length === 0) {
      const [result] = await connection.execute(
        "INSERT INTO pases_lista (id_clase, id_docente, fecha, hora_inicio, completado) VALUES (?, ?, ?, CURTIME(), 1)",
        [classId, teacherId, date]
      );
      paseId = result.insertId;
    } else {
      paseId = pases[0].id;
      await connection.execute("DELETE FROM asistencias WHERE id_pase_lista = ?", [
        paseId
      ]);
    }

    const cleanRecords = records.filter(
      (r) => r.studentId && r.status && ["A", "F", "R"].includes(r.status)
    );

    if (cleanRecords.length > 0) {
      const values = cleanRecords.map((r) => [
        paseId,
        r.studentId,
        r.status,
        r.observaciones || null
      ]);
      const placeholders = values.map(() => "(?, ?, ?, ?)").join(",");
      await connection.execute(
        "INSERT INTO asistencias (id_pase_lista, id_estudiante, estado, observaciones) VALUES " +
          placeholders,
        values.flat()
      );
    }

    await connection.commit();

    res.json({ ok: true, paseId });
  } catch (err) {
    console.error("Error en POST /attendance/save", err);
    await connection.rollback();
    res.status(500).json({ error: "Error interno" });
  } finally {
    connection.release();
  }
});

router.get("/history", async (req, res) => {
  try {
    const classId = Number(req.query.classId);
    if (!classId) {
      return res.status(400).json({ error: "classId es requerido" });
    }

    const rows = await query(
      `SELECT a.id,
              p.id_clase AS classId,
              a.id_estudiante AS studentId,
              DATE_FORMAT(p.fecha, '%Y-%m-%d') AS date,
              a.estado AS status
       FROM asistencias a
       JOIN pases_lista p ON a.id_pase_lista = p.id
       WHERE p.id_clase = ?
       ORDER BY p.fecha DESC`,
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error en GET /attendance/history", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
