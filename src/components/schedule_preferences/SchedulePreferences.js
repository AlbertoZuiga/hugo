// SchedulePreferences.js
import React, { useState } from "react";
import UserPreferences from "../user_preferences/UserPreferences";
import ProtectedSchedule from "../protected_schedule/ProtectedSchedule";
import { useSelector } from "react-redux";
import { schedulesApi } from "../../api/schedulesApi"; // Importar la función de la API
import "./SchedulePreferences.css";

const SchedulePreferences = () => {
  const selectedCourses = useSelector((state) => state.courses.selectedCourses); // Obtener cursos seleccionados de Redux
  const [allowOverlap, setAllowOverlap] = useState(true); // Estado para solapamiento
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para errores
  const [horarios, setHorarios] = useState(null); // Guardar los datos de la API

  const handleSavePreferences = async () => {
    const token = "e81c1adc0d949d945774869dcae37e3dc64b488e"; // Token de autorización

    setLoading(true);
    setError(null);

    try {
      // Construir formData con los IDs de los cursos seleccionados y el estado de solapamiento
      const formData = {
        cursos: selectedCourses.map((course) => course.url.split('/').filter(Boolean).pop()), // IDs de cursos
        permite_solapamiento: allowOverlap, // Permite solapamiento
      };

      // Llamada a la API
      const data = await schedulesApi(token, formData);
      setHorarios(data); // Guardar los datos recibidos
      console.log("Horarios recibidos:", data);
    } catch (error) {
      setError(error.message || "Error al obtener los horarios"); // Manejar el error
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  return (
    <div className="schedule-preferences">
      <ProtectedSchedule />
      <UserPreferences />

      <div className="solapamiento">
        <label>
          Permitir solapamiento de horarios
          <input
            type="checkbox"
            checked={allowOverlap}
            onChange={() => setAllowOverlap((prev) => !prev)}
          />
        </label>
      </div>

      <button onClick={handleSavePreferences} disabled={loading}>
        {loading ? "Guardando..." : "Guardar Preferencias"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {horarios && <pre>{JSON.stringify(horarios, null, 2)}</pre>} {/* Mostrar los horarios */}
    </div>
  );
};

export default SchedulePreferences;
