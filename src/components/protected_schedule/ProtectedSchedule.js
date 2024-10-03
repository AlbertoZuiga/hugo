import React, { useState } from 'react';
import './ProtectedSchedule.css'; // Asegúrate de crear este archivo para los estilos

const ProtectedSchedule = () => {
  const timeSlots = [
    { start: "08:30", end: "09:20" },
    { start: "09:30", end: "10:20" },
    { start: "10:30", end: "11:20" },
    { start: "11:30", end: "12:20" },
    { start: "12:30", end: "13:20" },
    { start: "13:30", end: "14:20" },
    { start: "14:30", end: "15:20" },
    { start: "15:30", end: "16:20" },
    { start: "16:30", end: "17:20" },
    { start: "17:30", end: "18:20" },
    { start: "18:30", end: "19:20" },
    { start: "19:30", end: "20:20" },
    { start: "20:30", end: "21:20" },
  ];

  const daysOfWeek = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

  // Estado para almacenar los horarios protegidos
  const [protectedTimes, setProtectedTimes] = useState(
    timeSlots.map(() => daysOfWeek.reduce((acc, day) => {
      acc[day] = false; // Por defecto, todos los días están disponibles
      return acc;
    }, {}))
  );

  const handleToggle = (slotIndex, day) => {
    // Actualiza el estado alternando el checkbox correspondiente
    setProtectedTimes((prev) => {
      const newProtectedTimes = [...prev]; // Copia el estado anterior
      newProtectedTimes[slotIndex] = {
        ...newProtectedTimes[slotIndex],
        [day]: !newProtectedTimes[slotIndex][day], // Alterna el estado solo de ese día
      };
      return newProtectedTimes; // Retorna el nuevo estado
    });
  };

  return (
    <div className="protected-schedule">
      <h1>Selecciona tus horarios protegidos</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="time-column">Hora</th>
            {daysOfWeek.map((day) => (
              <th key={day} className="day-column">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, index) => (
            <tr key={index}>
              <td className="time-column">{`${slot.start} - ${slot.end}`}</td>
              {daysOfWeek.map((day) => (
                <td 
                  key={day}
                  onClick={() => handleToggle(index, day)} // Manejo de clic en la celda
                  className={`day-cell ${protectedTimes[index][day] ? 'selected' : ''}`} // Clase CSS según el estado
                >
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={protectedTimes[index][day]}
                      readOnly // Hacer el checkbox de solo lectura
                      className="hidden-checkbox" // Oculta el checkbox visualmente
                    />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => console.log(protectedTimes)}>
        Guardar Horarios Protegidos
      </button>
    </div>
  );
};

export default ProtectedSchedule;
