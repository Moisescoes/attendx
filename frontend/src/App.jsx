import React, { useState } from "react";
import AdminDashboard from "./components/AdminDashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import { useData } from "./DataContextAPI.jsx";

function traducirRol(rol) {
  if (rol === "ADMIN") return "Administrador";
  if (rol === "TEACHER") return "Docente";
  if (rol === "STUDENT") return "Alumno";
  return rol;
}

function App() {
  const { users, loading, bootstrapError, login } = useData();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const u = await login(form.email, form.password);
      setUser(u);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setForm({ email: "", password: "" });
  };

  const admins = users.filter((u) => u.role === "ADMIN");
  const teachers = users.filter((u) => u.role === "TEACHER");
  const students = users.filter((u) => u.role === "STUDENT");

  if (!user) {
    return (
      <div className="app app-auth">
        <div className="card login-card">
          <div className="login-header">
            <div className="logo-circle">AX</div>
            <div>
              <h1>ATTENDX</h1>
              <p className="subtitle">
                Plataforma inteligente de control de asistencias para
                administradores, docentes y alumnos.
              </p>
            </div>
          </div>

          {loading && <p className="info">Cargando datos iniciales...</p>}
          {bootstrapError && (
            <p className="error">
              {bootstrapError} Verifica que el backend esté levantado.
            </p>
          )}

          <div className="login-layout">
            <div className="login-demo">
              <h2>Cuentas de demostración</h2>
              <div className="demo-cols">
                <div>
                  <p className="demo-title">Administrador</p>
                  <ul className="demo-list">
                    {admins.map((u) => (
                      <li key={u.id}>
                        {u.name} – {u.email} /{" "}
                        <span className="pill">1234</span>
                      </li>
                    ))}
                    {admins.length === 0 && <li>Sin datos</li>}
                  </ul>
                </div>
                <div>
                  <p className="demo-title">Docente</p>
                  <ul className="demo-list">
                    {teachers.map((u) => (
                      <li key={u.id}>
                        {u.name} – {u.email} /{" "}
                        <span className="pill">1234</span>
                      </li>
                    ))}
                    {teachers.length === 0 && <li>Sin datos</li>}
                  </ul>
                </div>
                <div>
                  <p className="demo-title">Alumnos</p>
                  <ul className="demo-list">
                    {students.map((u) => (
                      <li key={u.id}>
                        {u.name} – {u.email} /{" "}
                        <span className="pill">1234</span>
                      </li>
                    ))}
                    {students.length === 0 && <li>Sin datos</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="login-form-wrapper">
              <form onSubmit={handleLogin} className="form">
                <h2>Iniciar sesión</h2>
                <label>
                  Correo institucional
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="usuario@uaem.edu.mx"
                    required
                  />
                </label>
                <label>
                  Contraseña
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </label>
                {error && <p className="error">{error}</p>}
                <button
                  type="submit"
                  className="btn primary btn-full"
                  disabled={loading}
                >
                  Entrar a la plataforma
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo-circle small">AX</div>
          <span className="topbar-title">
            AttendX · Plataforma de control de asistencias
          </span>
        </div>
        <div className="user-info">
          <div className="user-badge">
            <div className="user-avatar">
              {user.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="user-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{traducirRol(user.role)}</span>
            </div>
          </div>
          <button className="btn secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="main">
        {user.role === "ADMIN" && <AdminDashboard />}
        {user.role === "TEACHER" && <TeacherDashboard currentUser={user} />}
        {user.role === "STUDENT" && <StudentDashboard currentUser={user} />}
      </main>
    </div>
  );
}

export default App;
