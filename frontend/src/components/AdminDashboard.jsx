import React, { useMemo, useState } from "react";
import { useData } from "../DataContextAPI.jsx";

function AdminDashboard() {
  const {
    users,
    classes,
    enrollments,
    createUser,
    updateUser,
    deleteUser,
    createClass,
    updateClass,
    deleteClass,
    setClassStudents
  } = useData();

  const [section, setSection] = useState("users");

  const [userForm, setUserForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "TEACHER"
  });

  const [classForm, setClassForm] = useState({
    id: null,
    name: "",
    group: "",
    teacherId: ""
  });

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const teachers = useMemo(
    () => users.filter((u) => u.role === "TEACHER"),
    [users]
  );
  const students = useMemo(
    () => users.filter((u) => u.role === "STUDENT"),
    [users]
  );

  const handleUserEdit = (u) => {
    setUserForm({
      id: u.id,
      name: u.name,
      email: u.email,
      password: "",
      role: u.role
    });
  };

  const resetUserForm = () => {
    setUserForm({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "TEACHER"
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.role) return;
    if (userForm.id) {
      await updateUser(userForm.id, {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password || undefined,
        role: userForm.role
      });
    } else {
      await createUser({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password || "1234",
        role: userForm.role
      });
    }
    resetUserForm();
  };

  const handleClassEdit = (c) => {
    setClassForm({
      id: c.id,
      name: c.name,
      group: c.group,
      teacherId: c.teacherId || ""
    });
  };

  const resetClassForm = () => {
    setClassForm({
      id: null,
      name: "",
      group: "",
      teacherId: ""
    });
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    if (!classForm.name || !classForm.group) return;
    const payload = {
      name: classForm.name,
      group: classForm.group,
      teacherId: classForm.teacherId || null
    };
    if (classForm.id) {
      await updateClass(classForm.id, payload);
    } else {
      await createClass(payload);
    }
    resetClassForm();
  };

  const handleToggleStudentInClass = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleLoadClassStudents = (classId) => {
    setSelectedClassId(classId);
    const current = enrollments
      .filter((e) => e.classId === classId)
      .map((e) => e.studentId);
    setSelectedStudents(current);
  };

  const handleSaveClassStudents = async () => {
    if (!selectedClassId) return;
    await setClassStudents(selectedClassId, selectedStudents);
  };

  const totalByTeacher = useMemo(() => {
    const counts = {};
    classes.forEach((c) => {
      if (!c.teacherId) return;
      counts[c.teacherId] = (counts[c.teacherId] || 0) + 1;
    });
    return counts;
  }, [classes]);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <button
          className={`sidebar-btn ${section === "users" ? "active" : ""}`}
          onClick={() => setSection("users")}
        >
          Usuarios
        </button>
        <button
          className={`sidebar-btn ${section === "classes" ? "active" : ""}`}
          onClick={() => setSection("classes")}
        >
          Clases
        </button>
        <button
          className={`sidebar-btn ${section === "enrollments" ? "active" : ""}`}
          onClick={() => setSection("enrollments")}
        >
          Inscripciones
        </button>
      </aside>

      <section className="content">
        {section === "users" && (
          <div className="content-section">
            <div className="content-header">
              <h2 className="section-title">Gestión de usuarios</h2>
            </div>
            <div className="content-grid">
              <div className="card-surface">
                <h3>Crear / editar usuario</h3>
                <form className="form small" onSubmit={handleUserSubmit}>
                  <label>
                    Nombre completo
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Correo
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Rol
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({ ...userForm, role: e.target.value })
                      }
                    >
                      <option value="ADMIN">Administrador</option>
                      <option value="TEACHER">Docente</option>
                      <option value="STUDENT">Alumno</option>
                    </select>
                  </label>
                  <label>
                    Contraseña
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      placeholder={
                        userForm.id
                          ? "Deja en blanco para mantener la actual"
                          : "Por defecto 1234"
                      }
                    />
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="btn primary">
                      {userForm.id ? "Actualizar usuario" : "Crear usuario"}
                    </button>
                    {userForm.id && (
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={resetUserForm}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="card-surface">
                <div className="table-header">
                  <h3>Usuarios registrados</h3>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 && (
                        <tr>
                          <td className="empty-cell" colSpan={4}>
                            No hay usuarios registrados.
                          </td>
                        </tr>
                      )}
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className="tag">
                              {u.role === "ADMIN" && "Administrador"}
                              {u.role === "TEACHER" && "Docente"}
                              {u.role === "STUDENT" && "Alumno"}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn tiny secondary-ghost"
                                type="button"
                                onClick={() => handleUserEdit(u)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn tiny danger-ghost"
                                type="button"
                                onClick={() => deleteUser(u.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card-surface">
              <h3>Clases por docente</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Correo</th>
                      <th>Total de clases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length === 0 && (
                      <tr>
                        <td className="empty-cell" colSpan={3}>
                          No hay docentes registrados.
                        </td>
                      </tr>
                    )}
                    {teachers.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                        <td>{totalByTeacher[t.id] || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === "classes" && (
          <div className="content-section">
            <div className="content-header">
              <h2 className="section-title">Gestión de clases</h2>
            </div>
            <div className="content-grid">
              <div className="card-surface">
                <h3>Crear / editar clase</h3>
                <form className="form small" onSubmit={handleClassSubmit}>
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={classForm.name}
                      onChange={(e) =>
                        setClassForm({ ...classForm, name: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Grupo
                    <input
                      type="text"
                      value={classForm.group}
                      onChange={(e) =>
                        setClassForm({ ...classForm, group: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Docente
                    <select
                      value={classForm.teacherId}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          teacherId: e.target.value ? Number(e.target.value) : ""
                        })
                      }
                    >
                      <option value="">Sin asignar</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="btn primary">
                      {classForm.id ? "Actualizar clase" : "Crear clase"}
                    </button>
                    {classForm.id && (
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={resetClassForm}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="card-surface">
                <div className="table-header">
                  <h3>Clases registradas</h3>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Grupo</th>
                        <th>Docente</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.length === 0 && (
                        <tr>
                          <td className="empty-cell" colSpan={4}>
                            No hay clases registradas.
                          </td>
                        </tr>
                      )}
                      {classes.map((c) => {
                        const teacher = teachers.find((t) => t.id === c.teacherId);
                        return (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.group}</td>
                            <td>
                              {teacher ? (
                                teacher.name
                              ) : (
                                <span className="text-muted">Sin asignar</span>
                              )}
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="btn tiny secondary-ghost"
                                  type="button"
                                  onClick={() => handleClassEdit(c)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn tiny danger-ghost"
                                  type="button"
                                  onClick={() => deleteClass(c.id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "enrollments" && (
          <div className="content-section">
            <div className="content-header">
              <h2 className="section-title">Inscripción de alumnos a clases</h2>
            </div>
            <div className="content-grid">
              <div className="card-surface">
                <h3>Clases</h3>
                <div className="class-list">
                  {classes.length === 0 && (
                    <p className="hint">
                      Primero crea clases en la pestaña anterior.
                    </p>
                  )}
                  {classes.map((c) => (
                    <div
                      key={c.id}
                      className={
                        "class-card" +
                        (selectedClassId === c.id ? " active" : "")
                      }
                      onClick={() => handleLoadClassStudents(c.id)}
                    >
                      <h3>{c.name}</h3>
                      <p>Grupo {c.group}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-surface">
                <h3>Alumnos inscritos</h3>
                {!selectedClassId && (
                  <p className="hint">
                    Selecciona una clase de la izquierda para asignar alumnos.
                  </p>
                )}
                {selectedClassId && (
                  <>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Inscribir</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.length === 0 && (
                            <tr>
                              <td className="empty-cell" colSpan={3}>
                                No hay usuarios con rol ALUMNO.
                              </td>
                            </tr>
                          )}
                          {students.map((s) => (
                            <tr key={s.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(s.id)}
                                  onChange={() => handleToggleStudentInClass(s.id)}
                                />
                              </td>
                              <td>{s.name}</td>
                              <td>{s.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn primary"
                        onClick={handleSaveClassStudents}
                      >
                        Guardar inscripciones
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
