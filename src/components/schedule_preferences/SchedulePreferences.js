import React, { useState } from "react";
import UserPreferences from "../user_preferences/UserPreferences";
import ProtectedSchedule from "../protected_schedule/ProtectedSchedule";
import { useSelector, useDispatch } from "react-redux";
import { schedulesApi } from "../../api/schedulesApi";
import { setSchedules } from "../../redux/actions/schedulesActions"; // Importar la acción
import "./SchedulePreferences.css";

const SchedulePreferences = () => {
  const dispatch = useDispatch();
  const selectedCourses = useSelector((state) => state.courses.selectedCourses);
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSavePreferences = async () => {
    const token = "e81c1adc0d949d945774869dcae37e3dc64b488e";

    setLoading(true);
    setError(null);

    try {
      const formData = {
        cursos: selectedCourses.map((course) => course.url.split('/').filter(Boolean).pop()),
        permite_solapamiento: allowOverlap,
      };

      const data = await schedulesApi(token, formData);
      dispatch(setSchedules(data.data)); // Guardar los horarios en Redux
      console.log("Horarios guardados en Redux:", data.data);
    } catch (error) {
      setError(error.message || "Error al obtener los horarios");
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default SchedulePreferences;
