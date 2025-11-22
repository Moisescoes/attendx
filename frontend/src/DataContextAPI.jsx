import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState("");
  const [data, setData] = useState({
    users: [],
    classes: [],
    enrollments: [],
    attendance: []
  });

  useEffect(() => {
    loadBootstrap();
  }, []);

  async function loadBootstrap() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bootstrap`);
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(json);
      setBootstrapError("");
    } catch (err) {
      console.error(err);
      setBootstrapError("No se pudo cargar la información del servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error al iniciar sesión");
    }
    const user = await res.json();
    return user;
  }

  async function createUser(payload) {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al crear usuario");
    const user = await res.json();
    setData((prev) => ({ ...prev, users: [...prev.users, user] }));
    return user;
  }

  async function updateUser(id, payload) {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    const user = await res.json();
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === id ? user : u))
    }));
    return user;
  }

  async function deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar usuario");
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id)
    }));
  }

  async function createClass(payload) {
    const res = await fetch(`${API_URL}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al crear clase");
    const clase = await res.json();
    setData((prev) => ({ ...prev, classes: [...prev.classes, clase] }));
    return clase;
  }

  async function updateClass(id, payload) {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al actualizar clase");
    const clase = await res.json();
    setData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === id ? clase : c))
    }));
    return clase;
  }

  async function deleteClass(id) {
    const res = await fetch(`${API_URL}/classes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar clase");
    setData((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
      enrollments: prev.enrollments.filter((e) => e.classId !== id),
      attendance: prev.attendance.filter((a) => a.classId !== id)
    }));
  }

  async function setClassStudents(classId, studentIds) {
    const res = await fetch(`${API_URL}/classes/${classId}/students`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds })
    });
    if (!res.ok) throw new Error("Error al asignar alumnos");
    const newEnrollments = studentIds.map((sid, idx) => ({
      id: Date.now() + idx,
      classId,
      studentId: sid
    }));
    setData((prev) => ({
      ...prev,
      enrollments: [
        ...prev.enrollments.filter((e) => e.classId !== classId),
        ...newEnrollments
      ]
    }));
  }

  async function saveAttendance(classId, teacherId, date, mapStatus) {
    const records = Object.entries(mapStatus)
      .filter(([, status]) => status)
      .map(([studentId, status]) => ({
        studentId: Number(studentId),
        status
      }));

    const res = await fetch(`${API_URL}/attendance/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, teacherId, date, records })
    });
    if (!res.ok) throw new Error("Error al guardar asistencia");

    const historyRes = await fetch(
      `${API_URL}/attendance/history?classId=${classId}`
    );
    if (historyRes.ok) {
      const list = await historyRes.json();
      setData((prev) => ({
        ...prev,
        attendance: [
          ...prev.attendance.filter((a) => a.classId !== classId),
          ...list
        ]
      }));
    }
  }

  async function getAttendanceForDate(classId, date) {
    const res = await fetch(
      `${API_URL}/attendance?classId=${classId}&date=${date}`
    );
    if (!res.ok) throw new Error("Error al obtener asistencia");
    const json = await res.json();
    return json;
  }

  const value = {
    ...data,
    loading,
    bootstrapError,
    reloadAll: loadBootstrap,
    login,
    createUser,
    updateUser,
    deleteUser,
    createClass,
    updateClass,
    deleteClass,
    setClassStudents,
    saveAttendance,
    getAttendanceForDate
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider");
  return ctx;
}
