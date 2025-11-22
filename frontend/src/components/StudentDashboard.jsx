import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useData } from "../DataContextAPI.jsx";

function StudentDashboard({ currentUser }) {
  const { classes, enrollments, attendance } = useData();

  const myClassIds = useMemo(
    () =>
      enrollments
        .filter((e) => e.studentId === currentUser.id)
        .map((e) => e.classId),
    [enrollments, currentUser.id]
  );

  const myClasses = useMemo(
    () => classes.filter((c) => myClassIds.includes(c.id)),
    [classes, myClassIds]
  );

  const [selectedClassId, setSelectedClassId] = useState(
    myClasses[0]?.id || null
  );

  const myAttendanceForSelected = useMemo(() => {
    if (!selectedClassId) return [];
    return attendance.filter(
      (a) => a.classId === selectedClassId && a.studentId === currentUser.id
    );
  }, [attendance, selectedClassId, currentUser.id]);

  const stats = useMemo(() => {
    if (myAttendanceForSelected.length === 0) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };
    }
    const total = myAttendanceForSelected.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    myAttendanceForSelected.forEach((r) => {
      if (r.status === "A") present++;
      if (r.status === "F") absent++;
      if (r.status === "R") late++;
    });
    const percentage = Math.round((present / total) * 100);
    return { total, present, absent, late, percentage };
  }, [myAttendanceForSelected]);

  const handleExportPdf = () => {
    if (!selectedClassId) return;
    const clase = myClasses.find((c) => c.id === selectedClassId);
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AttendX - Reporte de asistencias", 14, 18);
    doc.setFontSize(11);
    doc.text(`Alumno: ${currentUser.name}`, 14, 26);
    doc.text(
      `Clase: ${clase ? clase.name : ""} (${clase ? clase.group : ""})`,
      14,
      32
    );
    doc.text(
      `Asistencias: ${stats.present}  Faltas: ${stats.absent}  Retardos: ${stats.late}`,
      14,
      38
    );
    doc.text(`Porcentaje de asistencia: ${stats.percentage}%`, 14, 44);

    const startY = 54;
    doc.setFontSize(10);
    doc.text("Fecha", 14, startY);
    doc.text("Estado", 60, startY);
    doc.line(14, startY + 2, 196, startY + 2);

    let y = startY + 8;
    myAttendanceForSelected.forEach((r) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const st = r.status;
      const readable =
        st === "A"
          ? "Asistencia"
          : st === "F"
          ? "Falta"
          : st === "R"
          ? "Retardo"
          : "-";
      doc.text(r.date, 14, y);
      doc.text(readable, 60, y);
      y += 7;
    });

    doc.save(
      `reporte_${currentUser.name.replace(/\s+/g, "_")}_${clase
        ? clase.name.replace(/\s+/g, "_")
        : "clase"}.pdf`
    );
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <button className="sidebar-btn active">Mis asistencias</button>
      </aside>
      <section className="content">
        <div className="content-section">
          <div className="content-header">
            <h2 className="section-title">Resumen de asistencias</h2>
          </div>
          <div className="content-grid">
            <div className="card-surface">
              <h3>Mis clases</h3>
              <div className="class-list">
                {myClasses.length === 0 && (
                  <p className="hint">
                    Aún no estás inscrito en ninguna clase.
                  </p>
                )}
                {myClasses.map((c) => (
                  <div
                    key={c.id}
                    className={
                      "class-card" +
                      (selectedClassId === c.id ? " active" : "")
                    }
                    onClick={() => setSelectedClassId(c.id)}
                  >
                    <h3>{c.name}</h3>
                    <p>Grupo {c.group}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-surface">
              {!selectedClassId && (
                <p className="hint">
                  Selecciona una de tus clases para ver el detalle de
                  asistencias.
                </p>
              )}
              {selectedClassId && (
                <>
                  <div className="chart-card">
                    <h3>Porcentaje de asistencia</h3>
                    <p className="info">
                      {stats.percentage}% de asistencias en {stats.total} sesiones.
                    </p>
                    <div className="bar-wrapper">
                      <div
                        className="bar-fill"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn secondary-ghost"
                        onClick={handleExportPdf}
                        disabled={stats.total === 0}
                      >
                        Descargar reporte PDF
                      </button>
                    </div>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAttendanceForSelected.length === 0 && (
                          <tr>
                            <td className="empty-cell" colSpan={2}>
                              Aún no hay asistencias registradas para esta
                              clase.
                            </td>
                          </tr>
                        )}
                        {myAttendanceForSelected.map((r) => (
                          <tr key={r.id}>
                            <td>{r.date}</td>
                            <td>
                              {r.status === "A" && (
                                <span className="tag">Asistencia</span>
                              )}
                              {r.status === "F" && (
                                <span
                                  className="tag"
                                  style={{
                                    borderColor: "#f87171",
                                    background: "rgba(239,68,68,0.35)"
                                  }}
                                >
                                  Falta
                                </span>
                              )}
                              {r.status === "R" && (
                                <span
                                  className="tag"
                                  style={{
                                    borderColor: "#facc15",
                                    background: "rgba(234,179,8,0.35)"
                                  }}
                                >
                                  Retardo
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
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

export default StudentDashboard;
