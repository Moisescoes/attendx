const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const bootstrapRoutes = require("./routes/bootstrap");
const usersRoutes = require("./routes/users");
const classesRoutes = require("./routes/classes");
const attendanceRoutes = require("./routes/attendance");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API AttendX - Control de asistencias" });
});

app.use("/api/auth", authRoutes);
app.use("/api/bootstrap", bootstrapRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/attendance", attendanceRoutes);

const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log("API server running on port", port);
});
