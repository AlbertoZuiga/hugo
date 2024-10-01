import React from "react";
import "./Schedule.css"; // Importa el archivo CSS

const Schedule = ({ schedule }) => {
  // Crear una matriz de horarios
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

  const renderSchedule = () => {
    return (
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot.start}>
              <td>
                <div>{`${slot.start} - ${slot.end}`}</div>
              </td>
              <td>{renderCourseInfo(schedule.lunes, slot)}</td>
              <td>{renderCourseInfo(schedule.martes, slot)}</td>
              <td>{renderCourseInfo(schedule.miercoles, slot)}</td>
              <td>{renderCourseInfo(schedule.jueves, slot)}</td>
              <td>{renderCourseInfo(schedule.viernes, slot)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCourseInfo = (daySchedule, slot) => {
    // Iteramos sobre todos los ramos del día
    const courses = Object.entries(daySchedule).filter(
      ([courseName, details]) => {
        // Verificamos si el curso está dentro del bloque de tiempo actual
        return isTimeWithinSlot(
          details.hora_inicio,
          details.hora_termino,
          slot.start,
          slot.end
        );
      }
    );

    // Si no hay cursos en este bloque, devolvemos una celda vacía
    if (courses.length === 0) {
      return ""; // Devolvemos una cadena vacía para celdas sin clase
    }

    // Si hay cursos, los mostramos con el formato requerido
    return courses.map(([courseName, details]) => (
      <div key={courseName}>
        <strong>{courseName}</strong>
        <br />
        Sala: {details.sala}
        <br />
        {details.tipo}
      </div>
    ));
  };

  // Verifica si el curso cae dentro del bloque de tiempo
  const isTimeWithinSlot = (startTime, endTime, slotStart, slotEnd) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const [slotStartHour, slotStartMinute] = slotStart.split(":").map(Number);
    const [slotEndHour, slotEndMinute] = slotEnd.split(":").map(Number);

    const courseStart = startHour * 60 + startMinute;
    const courseEnd = endHour * 60 + endMinute;
    const slotStartMin = slotStartHour * 60 + slotStartMinute;
    const slotEndMin = slotEndHour * 60 + slotEndMinute;

    // Retorna true si el curso empieza o termina dentro del intervalo de tiempo
    return courseStart < slotEndMin && courseEnd > slotStartMin;
  };

  return (
    <div>
      {renderSchedule()}
    </div>
  );
};

export default Schedule;
