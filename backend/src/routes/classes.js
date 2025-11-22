const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, nombre AS name, grupo, id_docente FROM clases"
    );
    const classes = rows.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.grupo,
      teacherId: c.id_docente
    }));
    res.json(classes);
  } catch (err) {
    console.error("Error en GET /classes", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, group, teacherId } = req.body;
    if (!name || !group) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const result = await query(
      "INSERT INTO clases (nombre, grupo, id_docente, activa) VALUES (?, ?, ?, 1)",
      [name, group, teacherId || null]
    );
    const insertedId = result.insertId;
    const rows = await query(
      "SELECT id, nombre AS name, grupo, id_docente FROM clases WHERE id = ?",
      [insertedId]
    );
    const c = rows[0];
    res.status(201).json({
      id: c.id,
      name: c.name,
      group: c.grupo,
      teacherId: c.id_docente
    });
  } catch (err) {
    console.error("Error en POST /classes", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, group, teacherId } = req.body;
    if (!id || !name || !group) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    await query(
      "UPDATE clases SET nombre = ?, grupo = ?, id_docente = ? WHERE id = ?",
      [name, group, teacherId || null, id]
    );
    const rows = await query(
      "SELECT id, nombre AS name, grupo, id_docente FROM clases WHERE id = ?",
      [id]
    );
    const c = rows[0];
    res.json({
      id: c.id,
      name: c.name,
      group: c.grupo,
      teacherId: c.id_docente
    });
  } catch (err) {
    console.error("Error en PUT /classes/:id", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }
    await query("DELETE FROM inscripciones WHERE id_clase = ?", [id]);
    await query("DELETE FROM clases WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error en DELETE /classes/:id", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/:id/students", async (req, res) => {
  try {
    const classId = Number(req.params.id);
    if (!classId) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const rows = await query(
      `SELECT i.id, i.id_clase AS classId, i.id_estudiante AS studentId
       FROM inscripciones i
       WHERE i.id_clase = ?`,
      [classId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error en GET /classes/:id/students", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.put("/:id/students", async (req, res) => {
  try {
    const classId = Number(req.params.id);
    const { studentIds } = req.body;
    if (!classId || !Array.isArray(studentIds)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    await query("DELETE FROM inscripciones WHERE id_clase = ?", [classId]);
    if (studentIds.length > 0) {
      const values = studentIds.map((sid) => [classId, sid]);
      await query(
        "INSERT INTO inscripciones (id_clase, id_estudiante) VALUES " +
          values.map(() => "(?, ?)").join(","),
        values.flat()
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error en PUT /classes/:id/students", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
