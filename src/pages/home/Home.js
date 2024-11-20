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

// Función para verificar si dos bloques de tiempo se superponen
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

// Definimos las clases numéricas para los cursos
const courseClassMapping = {};

const Home = () => {
  const horarios = useSelector((state) => state.schedules.data);
  const [selectedSchedule, setSelectedSchedule] = useState(0); // Estado para el horario seleccionado

  // Maneja la selección de un horario
  const handleScheduleChange = (event) => {
    setSelectedSchedule(event.target.value);
  };

  // Obtener el horario seleccionado si existe
  const schedule = horarios && horarios.length > 0 ? horarios[selectedSchedule] : [];

  // Filtrar bloques de tipo CLAS, AYUD, LABT para el horario semanal
  const weeklySchedule = schedule.filter((bloque) =>
    ["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  // Filtrar bloques de tipo PRBA, EXAM, u otros eventos especiales
  const specialEvents = schedule.filter(
    (bloque) => !["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  // Función para asignar un color único a cada curso basado en su nombre
  const getCourseColor = (courseName) => {
    const hash = Array.from(courseName).reduce((hash, char) => {
      return hash + char.charCodeAt(0);
    }, 0);
    const colors = [
      "course-1", "course-2", "course-3", "course-4", 
      "course-5", "course-6", "course-7"
    ];
    return colors[hash % colors.length]; // Asigna un color basado en el hash
  };

  // Función para obtener la clase de tipo de clase (A, L, C)
  const getClassTypeClass = (tipo) => {
    if (tipo.startsWith("A")) {
      return "type-A";
    } else if (tipo.startsWith("L")) {
      return "type-L";
    } else if (tipo.startsWith("C")) {
      return "type-C";
    }
    return ""; // Si no es A, L o C
  };

  // Función para verificar si un curso está en el rango de un bloque de tiempo
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

  // Función para encontrar cursos que se superponen
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

  // Función para renderizar la información de cada curso
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
      const courseColorClass = getCourseColor(bloque.nombre_curso);
      const courseTypeClass = getClassTypeClass(bloque.tipo);

      return (
        <div
          key={index}
          className={`${courseColorClass} ${courseTypeClass} ${isOverlapping ? "conflict" : ""}`}
        >
          <div className="course-name">{bloque.nombre_curso}</div>
          <div className="course-nrc">NRC: {bloque.nrc}</div>
          <div className="course-sala">Sala: {bloque.sala}</div>
          <div className="course-tipo">{bloque.tipo}</div>
        </div>
      );
    });
  };

  // Renderizar eventos especiales
  const renderSpecialEvents = () => {
    return (
      <div className="special-events">
        <h2>Eventos Especiales</h2>
        {specialEvents.length > 0 ? (
          specialEvents.map((evento, index) => (
            <div key={index} className="event-item">
              <h3>{evento.nombre_curso} (NRC: {evento.nrc})</h3>
              <p><strong>Tipo:</strong> {evento.tipo}</p>
              <p><strong>Fecha:</strong> {evento.fecha_inicio} - {evento.fecha_fin}</p>
              <p><strong>Hora:</strong> {evento.hora_inicio} - {evento.hora_fin}</p>
              <p><strong>Sala:</strong> {evento.sala}</p>
            </div>
          ))
        ) : (
          <p>No hay eventos especiales para mostrar.</p>
        )}
      </div>
    );
  };

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
              <td>{`${slot.start} - ${slot.end}`}</td>
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
        {horarios.length > 0 ? (
          horarios.map((_, index) => (
            <option key={index} value={index}>
              Horario {index + 1}
            </option>
          ))
        ) : (
          <option value="0">Horario vacío</option>
        )}
      </select>

      {/* Mostrar el horario semanal en formato tabla */}
      {renderSchedule()}

      {/* Mostrar eventos especiales */}
      {renderSpecialEvents()}
    </div>
  );
};

export default Home;
