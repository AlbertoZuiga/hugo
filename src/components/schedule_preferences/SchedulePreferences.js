// SchedulePreferences.js
import React from "react";
import UserPreferences from "../user_preferences/UserPreferences"; // Asegúrate de importar el nuevo componente
import ProtectedSchedule from "../protected_schedule/ProtectedSchedule";
import "./SchedulePreferences.css"; // Asegúrate de tener este archivo CSS

const SchedulePreferences = () => {
  return (
    <div className="schedule-preferences">

      <ProtectedSchedule />

      <UserPreferences />

      <button onClick={() => console.log("Guardar preferencias")}>
        Guardar Preferencias
      </button>
    </div>
  );
};

export default SchedulePreferences;
