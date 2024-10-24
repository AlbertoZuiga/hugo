import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Home.css";

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

// Definimos las clases numéricas para los cursos
const courseClassMapping = {};

const Home = () => {
  const horarios = useSelector((state) => state.schedules.data);
  const [selectedSchedule, setSelectedSchedule] = useState(0); // Estado para el horario seleccionado

  // Maneja la selección de un horario
  const handleScheduleChange = (event) => {
    setSelectedSchedule(event.target.value);
  };

  // Si no hay horarios, mostrar un mensaje
  if (!horarios || horarios.length === 0) {
    return <div>No hay horarios disponibles</div>;
  }

  // Obtener el horario seleccionado
  const schedule = horarios[selectedSchedule];

  // Filtrar bloques de tipo CLAS, AYUD, LABT para el horario semanal
  const weeklySchedule = schedule.filter((bloque) =>
    ["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  // Filtrar bloques de tipo PRBA, EXAM, u otros eventos especiales
  const specialEvents = schedule.filter(
    (bloque) => !["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  const renderSchedule = () => {
    // Organizar los bloques por día de la semana
    const daysOfWeek = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    weeklySchedule.forEach((bloque) => {
      daysOfWeek[bloque.dia_semana].push(bloque);
    });

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
          {timeSlots.map((slot, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <div>{`${slot.start} - ${slot.end}`}</div>
              </td>
              <td>{renderCourseInfo(daysOfWeek[1], slot)}</td>
              <td>{renderCourseInfo(daysOfWeek[2], slot)}</td>
              <td>{renderCourseInfo(daysOfWeek[3], slot)}</td>
              <td>{renderCourseInfo(daysOfWeek[4], slot)}</td>
              <td>{renderCourseInfo(daysOfWeek[5], slot)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCourseInfo = (daySchedule, slot) => {
    const courses = daySchedule.filter((bloque) =>
      isTimeWithinSlot(bloque.hora_inicio, bloque.hora_fin, slot.start, slot.end)
    );

    if (courses.length === 0) {
      return ""; // No hay cursos en este bloque de tiempo
    }

    const overlappingCourses = findOverlappingCourses(courses);

    return courses.map((bloque, index) => {
      const isOverlapping = overlappingCourses.includes(bloque.nrc);
      const courseClass = getCourseClass(bloque.nombre_curso);

      return (
        <div
          key={index}
          className={`${courseClass} ${isOverlapping ? "conflict" : ""}`}
        >
          <div className="course-name">{bloque.nombre_curso}</div>
          <div className="course-sala">Sala: {bloque.sala}</div>
          <div className="course-tipo">{bloque.tipo}</div>
        </div>
      );
    });
  };

  const renderSpecialEvents = () => {
    return (
      <div className="special-events">
        <h2>Eventos Especiales</h2>
        {specialEvents.map((evento, index) => (
          <div key={index} className="event-item">
            <h3>{evento.nombre_curso}</h3>
            <p>
              <strong>Tipo:</strong> {evento.tipo}
            </p>
            <p>
              <strong>Fecha:</strong> {evento.fecha_inicio} - {evento.fecha_fin}
            </p>
            <p>
              <strong>Hora:</strong> {evento.hora_inicio} - {evento.hora_fin}
            </p>
            <p>
              <strong>Sala:</strong> {evento.sala}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const isTimeWithinSlot = (startTime, endTime, slotStart, slotEnd) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const [slotStartHour, slotStartMinute] = slotStart.split(":").map(Number);
    const [slotEndHour, slotEndMinute] = slotEnd.split(":").map(Number);

    const courseStart = startHour * 60 + startMinute;
    const courseEnd = endHour * 60 + endMinute;
    const slotStartMin = slotStartHour * 60 + slotStartMinute;
    const slotEndMin = slotEndHour * 60 + slotEndMinute;

    return courseStart < slotEndMin && courseEnd > slotStartMin;
  };

  const findOverlappingCourses = (courses) => {
    const overlapping = [];
    for (let i = 0; i < courses.length; i++) {
      const bloque1 = courses[i];
      for (let j = i + 1; j < courses.length; j++) {
        const bloque2 = courses[j];
        if (
          isTimeOverlap(
            bloque1.hora_inicio,
            bloque1.hora_fin,
            bloque2.hora_inicio,
            bloque2.hora_fin
          )
        ) {
          overlapping.push(bloque1.nrc, bloque2.nrc);
        }
      }
    }
    return overlapping;
  };

  const isTimeOverlap = (start1, end1, start2, end2) => {
    const [startHour1, startMinute1] = start1.split(":").map(Number);
    const [endHour1, endMinute1] = end1.split(":").map(Number);
    const [startHour2, startMinute2] = start2.split(":").map(Number);
    const [endHour2, endMinute2] = end2.split(":").map(Number);

    const start1Min = startHour1 * 60 + startMinute1;
    const end1Min = endHour1 * 60 + endMinute1;
    const start2Min = startHour2 * 60 + startMinute2;
    const end2Min = endHour2 * 60 + endMinute2;

    return start1Min < end2Min && start2Min < end1Min;
  };

  const getCourseClass = (courseName) => {
    if (!courseClassMapping[courseName]) {
      const nextClassNumber = Object.keys(courseClassMapping).length + 1;
      courseClassMapping[courseName] = `course course-${nextClassNumber}`;
    }
    return courseClassMapping[courseName];
  };

  return (
    <div>
      <h1>Horarios Generados</h1>

      {/* Dropdown para seleccionar el horario */}
      <label htmlFor="schedule-select">Selecciona un Horario:</label>
      <select
        id="schedule-select"
        onChange={handleScheduleChange}
        value={selectedSchedule}
      >
        {horarios.map((_, index) => (
          <option key={index} value={index}>
            Horario {index + 1}
          </option>
        ))}
      </select>

      {/* Mostrar el horario en formato tabla */}
      {renderSchedule()}

      {/* Mostrar eventos especiales en una lista */}
      {renderSpecialEvents()}
    </div>
  );
};

export default Home;
