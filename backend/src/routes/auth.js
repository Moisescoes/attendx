const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    const rows = await query(
      "SELECT id, nombre, apellidos, email, rol FROM usuarios WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const u = rows[0];
    const fullName = u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre;

    res.json({
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.rol
    });
  } catch (err) {
    console.error("Error en /auth/login", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
