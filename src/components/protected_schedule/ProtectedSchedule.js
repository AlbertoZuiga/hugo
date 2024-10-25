import React, { useState } from "react";
import "./ProtectedSchedule.css";

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

const daysOfWeek = ["lunes", "martes", "miercoles", "jueves", "viernes"];

const ProtectedSchedule = ({ onScheduleChange }) => {
  const [protectedTimes, setProtectedTimes] = useState(
    timeSlots.map(() =>
      daysOfWeek.reduce((acc, day) => {
        acc[day] = false;
        return acc;
      }, {})
    )
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState(null); // 'select' or 'deselect'
  const [dragStart, setDragStart] = useState({ row: null, col: null });

  const handleMouseDown = (slotIndex, dayIndex) => {
    const isSelected = protectedTimes[slotIndex][daysOfWeek[dayIndex]];
    setIsDragging(true);
    setDragAction(isSelected ? "deselect" : "select");
    setDragStart({ row: slotIndex, col: dayIndex });
    toggleCell(slotIndex, dayIndex, isSelected);
  };

  const handleMouseEnter = (slotIndex, dayIndex) => {
    if (isDragging) {
      handleToggleArea(dragStart.row, dragStart.col, slotIndex, dayIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onScheduleChange(formatProtectedTimes(protectedTimes)); // Llama a la función para enviar los datos formateados
  };

  const toggleCell = (slotIndex, dayIndex, isSelected) => {
    setProtectedTimes((prev) => {
      const newProtectedTimes = [...prev];
      newProtectedTimes[slotIndex] = {
        ...newProtectedTimes[slotIndex],
        [daysOfWeek[dayIndex]]: !isSelected,
      };
      return newProtectedTimes;
    });
  };

  const handleToggleArea = (startRow, startCol, endRow, endCol) => {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    setProtectedTimes((prev) => {
      const newProtectedTimes = [...prev];

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          newProtectedTimes[row] = {
            ...newProtectedTimes[row],
            [daysOfWeek[col]]: dragAction === "select",
          };
        }
      }
      return newProtectedTimes;
    });
  };

  // Formatea los horarios protegidos en el formato esperado por el backend
  const formatProtectedTimes = (times) => {
    const formattedTimes = [];

    times.forEach((slot, slotIndex) => {
      daysOfWeek.forEach((day, dayIndex) => {
        if (slot[day]) {
          formattedTimes.push({
            dia_de_semana: dayIndex + 1,
            hora_inicio: timeSlots[slotIndex].start,
            hora_fin: timeSlots[slotIndex].end,
          });
        }
      });
    });

    return formattedTimes;
  };

  return (
    <div
      className="protected-schedule"
      onMouseUp={handleMouseUp}
    >
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
              {daysOfWeek.map((day, dayIndex) => (
                <td
                  key={day}
                  onMouseDown={() => handleMouseDown(index, dayIndex)}
                  onMouseEnter={() => handleMouseEnter(index, dayIndex)}
                  className={`day-cell ${
                    protectedTimes[index][day] ? "selected" : ""
                  }`}
                >
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={protectedTimes[index][day]}
                      readOnly
                      className="hidden-checkbox"
                    />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProtectedSchedule;
