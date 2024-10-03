import React, { useState } from "react";
import ProtectedSchedule from "../protected_schedule/ProtectedSchedule";
import "./SchedulePreferences.css"; // Asegúrate de tener estilos

const SchedulePreferences = () => {
  const [coursePreferences, setCoursePreferences] = useState([]);
  const [avoidGaps, setAvoidGaps] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  const handleCourseChange = (e) => {
    setNewCourse(e.target.value);
  };

  const handlePreferenceSubmit = (e) => {
    e.preventDefault();
    if (newCourse) {
      setCoursePreferences((prev) => [
        ...prev,
        { name: newCourse, required: isRequired },
      ]);
      setNewCourse("");
      setIsRequired(false);
    }
  };

  return (
    <div className="schedule-preferences">
      <ProtectedSchedule />
      <h1>Selecciona tus preferencias de horario</h1>

      <div className="course-preferences">
        <h2>Preferencias de cursos</h2>
        <form onSubmit={handlePreferenceSubmit}>
          <input
            type="text"
            value={newCourse}
            onChange={handleCourseChange}
            placeholder="Nombre del ramo"
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isRequired}
              onChange={() => setIsRequired((prev) => !prev)}
            />
            Necesario
          </label>
          <button type="submit">Agregar Curso</button>
        </form>

        <ul>
          {coursePreferences.map((course, index) => (
            <li key={index}>
              {course.name} {course.required ? "(Necesario)" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="avoid-gaps">
        <h2>Evitar ventanas de horario</h2>
        <label>
          <input
            type="checkbox"
            checked={avoidGaps}
            onChange={() => setAvoidGaps((prev) => !prev)}
          />
          Sí, evitar ventanas
        </label>
      </div>

      <button
        onClick={() =>
          console.log({ coursePreferences, avoidGaps })
        }
      >
        Guardar Preferencias
      </button>
    </div>
  );
};

export default SchedulePreferences;
