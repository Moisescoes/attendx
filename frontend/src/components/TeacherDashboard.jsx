import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useData } from "../DataContextAPI.jsx";

function TeacherDashboard({ currentUser }) {
  const { classes, users, enrollments, saveAttendance, getAttendanceForDate } =
    useData();

  const myClasses = useMemo(
    () => classes.filter((c) => c.teacherId === currentUser.id),
    [classes, currentUser.id]
  );

  const students = useMemo(
    () => users.filter((u) => u.role === "STUDENT"),
    [users]
  );

  const [selectedClassId, setSelectedClassId] = useState(
    myClasses[0]?.id || null
  );
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [statuses, setStatuses] = useState({});
  const [loadingDay, setLoadingDay] = useState(false);
  const [message, setMessage] = useState("");

  const studentsInSelectedClass = useMemo(() => {
    if (!selectedClassId) return [];
    const ids = enrollments
      .filter((e) => e.classId === selectedClassId)
      .map((e) => e.studentId);
    return students.filter((s) => ids.includes(s.id));
  }, [selectedClassId, enrollments, students]);

  const handlePickClass = (id) => {
    setSelectedClassId(id);
    setStatuses({});
    setMessage("");
  };

  const handleStatusChange = (studentId, status) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleLoadExisting = async () => {
    if (!selectedClassId || !date) return;
    setLoadingDay(true);
    setMessage("");
    try {
      const data = await getAttendanceForDate(selectedClassId, date);
      if (!data || !data.records || data.records.length === 0) {
        setStatuses({});
        setMessage("Aún no hay pase guardado para esta fecha.");
        return;
      }
      const map = {};
      data.records.forEach((r) => {
        map[r.studentId] = r.status;
      });
      setStatuses(map);
      setMessage("Pase de lista cargado desde la base de datos.");
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar el pase de lista.");
    } finally {
      setLoadingDay(false);
    }
  };

  const handleSave = async () => {
    if (!selectedClassId || !date) return;
    setLoadingDay(true);
    setMessage("");
    try {
      await saveAttendance(selectedClassId, currentUser.id, date, statuses);
      setMessage("Pase de lista guardado correctamente.");
    } catch (err) {
      console.error(err);
      setMessage("Error al guardar el pase de lista.");
    } finally {
      setLoadingDay(false);
    }
  };

  const handleExportPdf = () => {
    if (!selectedClassId || !date) return;
    const clase = myClasses.find((c) => c.id === selectedClassId);
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AttendX - Pase de lista", 14, 18);
    doc.setFontSize(11);
    doc.text(`Docente: ${currentUser.name}`, 14, 26);
    doc.text(
      `Clase: ${clase ? clase.name : ""} (${clase ? clase.group : ""})`,
      14,
      32
    );
    doc.text(`Fecha: ${date}`, 14, 38);

    const startY = 48;
    doc.setFontSize(10);
    doc.text("Nombre", 14, startY);
    doc.text("Correo", 80, startY);
    doc.text("Estado", 160, startY);
    doc.line(14, startY + 2, 196, startY + 2);

    let y = startY + 8;
    studentsInSelectedClass.forEach((s) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const st = statuses[s.id] || "-";
      const readable =
        st === "A"
          ? "Asistencia"
          : st === "F"
          ? "Falta"
          : st === "R"
          ? "Retardo"
          : "-";
      doc.text(s.name, 14, y);
      doc.text(s.email, 80, y);
      doc.text(readable, 160, y);
      y += 7;
    });

    doc.save(
      `pase_${clase ? clase.name.replace(/\s+/g, "_") : "clase"}_${date}.pdf`
    );
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <button className="sidebar-btn active">Pase de lista</button>
      </aside>
      <section className="content">
        <div className="content-section">
          <div className="content-header">
            <h2 className="section-title">Pase de lista diario</h2>
          </div>
          <div className="content-grid">
            <div className="card-surface">
              <h3>Tus clases</h3>
              <div className="class-list">
                {myClasses.length === 0 && (
                  <p className="hint">
                    Aún no tienes clases asignadas. Pide al administrador que te
                    asigne grupos.
                  </p>
                )}
                {myClasses.map((c) => (
                  <div
                    key={c.id}
                    className={
                      "class-card" +
                      (selectedClassId === c.id ? " active" : "")
                    }
                    onClick={() => handlePickClass(c.id)}
                  >
                    <h3>{c.name}</h3>
                    <p>Grupo {c.group}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-surface">
              <h3>Pase de lista</h3>
              {!selectedClassId && (
                <p className="hint">
                  Selecciona una de tus clases en la izquierda para comenzar a
                  pasar lista.
                </p>
              )}
              {selectedClassId && (
                <>
                  <div className="attendance-toolbar">
                    <label>
                      Fecha
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={handleLoadExisting}
                      disabled={loadingDay}
                    >
                      Cargar pase guardado
                    </button>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={handleSave}
                      disabled={loadingDay}
                    >
                      Guardar pase
                    </button>
                    <button
                      type="button"
                      className="btn secondary-ghost"
                      onClick={handleExportPdf}
                      disabled={studentsInSelectedClass.length === 0}
                    >
                      Exportar PDF
                    </button>
                  </div>
                  <p className="hint">
                    Da clic en <b>A</b> (asistencia), <b>F</b> (falta) o{" "}
                    <b>R</b> (retardo). El botón seleccionado se ilumina para
                    indicar el estado guardado.
                  </p>
                  {message && (
                    <p
                      className={
                        message.toLowerCase().includes("error")
                          ? "error"
                          : "info"
                      }
                    >
                      {message}
                    </p>
                  )}
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Alumno</th>
                          <th>Correo</th>
                          <th>Marcar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsInSelectedClass.length === 0 && (
                          <tr>
                            <td className="empty-cell" colSpan={3}>
                              Esta clase aún no tiene alumnos inscritos.
                            </td>
                          </tr>
                        )}
                        {studentsInSelectedClass.map((s) => {
                          const status = statuses[s.id];
                          return (
                            <tr
                              key={s.id}
                              className={
                                status ? `row-status-${status}` : undefined
                              }
                            >
                              <td>{s.name}</td>
                              <td>{s.email}</td>
                              <td>
                                <div className="attendance-buttons">
                                  <button
                                    type="button"
                                    className={
                                      "btn tiny success attendance-toggle " +
                                      (status === "A"
                                        ? "toggle-active"
                                        : "ghost")
                                    }
                                    onClick={() =>
                                      handleStatusChange(s.id, "A")
                                    }
                                  >
                                    A
                                  </button>
                                  <button
                                    type="button"
                                    className={
                                      "btn tiny danger attendance-toggle " +
                                      (status === "F"
                                        ? "toggle-active"
                                        : "ghost")
                                    }
                                    onClick={() =>
                                      handleStatusChange(s.id, "F")
                                    }
                                  >
                                    F
                                  </button>
                                  <button
                                    type="button"
                                    className={
                                      "btn tiny warning attendance-toggle " +
                                      (status === "R"
                                        ? "toggle-active"
                                        : "ghost")
                                    }
                                    onClick={() =>
                                      handleStatusChange(s.id, "R")
                                    }
                                  >
                                    R
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
