const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, nombre, apellidos, email, rol FROM usuarios"
    );
    const users = rows.map((u) => ({
      id: u.id,
      name: u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre,
      email: u.email,
      role: u.rol
    }));
    res.json(users);
  } catch (err) {
    console.error("Error en GET /users", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const [nombre, ...apellidosArr] = name.split(" ");
    const apellidos = apellidosArr.join(" ");
    const result = await query(
      "INSERT INTO usuarios (nombre, apellidos, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellidos, email, password, role]
    );
    const insertedId = result.insertId;
    const rows = await query(
      "SELECT id, nombre, apellidos, email, rol FROM usuarios WHERE id = ?",
      [insertedId]
    );
    const u = rows[0];
    res.status(201).json({
      id: u.id,
      name: u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre,
      email: u.email,
      role: u.rol
    });
  } catch (err) {
    console.error("Error en POST /users", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;
    if (!id || !name || !email || !role) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    const [nombre, ...apellidosArr] = name.split(" ");
    const apellidos = apellidosArr.join(" ");
    let params = [nombre, apellidos, email, role, id];
    let sql =
      "UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, rol = ?";

    if (password) {
      sql =
        "UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, password = ?, rol = ? WHERE id = ?";
      params = [nombre, apellidos, email, password, role, id];
    } else {
      sql += " WHERE id = ?";
    }

    await query(sql, params);
    const rows = await query(
      "SELECT id, nombre, apellidos, email, rol FROM usuarios WHERE id = ?",
      [id]
    );
    const u = rows[0];
    res.json({
      id: u.id,
      name: u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre,
      email: u.email,
      role: u.rol
    });
  } catch (err) {
    console.error("Error en PUT /users/:id", err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }
    await query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error en DELETE /users/:id", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
