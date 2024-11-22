import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas"; // Importamos html2canvas
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

const Home = () => {
  const horarios = useSelector((state) => state.schedules.data);
  const [selectedSchedule, setSelectedSchedule] = useState(0); // Estado para el horario seleccionado
  const [courseDetails, setCourseDetails] = useState({});

  // Maneja la selección de un horario
  const handleScheduleChange = (event) => {
    setSelectedSchedule(event.target.value);
  };
  

  // Obtener el horario seleccionado si existe
  const schedule = useMemo(() => {
    return horarios && horarios.length > 0 ? horarios[selectedSchedule] : [];
  }, [horarios, selectedSchedule]);

  // Ordenar cursos por sección
  const sortedCourses = useMemo(() => {
    if (!schedule) return [];
    const coursesInSchedule = schedule.map((bloque) => bloque.seccion || "Desconocido");
    return Array.from(new Set(coursesInSchedule)).sort();
  }, [schedule]);

  // Filtrar bloques de tipo CLAS, AYUD, LABT para el horario semanal
  const weeklySchedule = schedule.filter((bloque) =>
    ["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  // Filtrar bloques de tipo PRBA, EXAM, u otros eventos especiales
  const specialEvents = schedule.filter(
    (bloque) => !["CLAS", "AYUD", "LABT"].includes(bloque.tipo)
  );

  // Función para obtener la clase de tipo de clase (A, L, C)
  const getClassTypeClass = (tipo) => {
    if (tipo.startsWith("A")) {
      return "type-A";
    } else if (tipo.startsWith("L")) {
      return "type-L";
    } else if (tipo.startsWith("C")) {
      return "type-C";
    }
    return "";
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

  const fetchCourseDetails = async (seccion) => {
    try {
      const response = await fetch(`http://localhost:8000/secciones/${seccion}`);
      if (!response.ok) throw new Error(`Error al buscar el curso: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener detalles del curso:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllCourseDetails = async () => {
      const details = {};
      for (const bloque of schedule) {
        if (!details[bloque.seccion]) {
          const data = await fetchCourseDetails(bloque.seccion);
          if (data) {
            details[bloque.seccion] = data;
          }
        }
      }
      setCourseDetails(details);
    };

    fetchAllCourseDetails();
  }, [schedule]);
  

  // Función para renderizar la información de cada curso
  const renderCourseInfo = (daySchedule, slot) => {
    const courses = daySchedule.filter((bloque) =>
      isTimeWithinSlot(bloque.hora_inicio, bloque.hora_fin, slot.start, slot.end)
    );

    if (courses.length === 0) {
      return "";
    }

    console.log(courses[0])

    return courses.map((bloque, index) => {
      const courseName = courseDetails[bloque.seccion]?.nombre_curso || "Sin Nombre";

      return(
      <div
        key={index}
        className={`course course-${sortedCourses.indexOf(bloque.seccion) + 1} ${getClassTypeClass(
          bloque.tipo
        )}`}
      >
        <div className="course-name">{courseName || "Sin Nombre"}</div>
        <div className="course-seccion">Sección: {bloque.seccion}</div>
        <div className="course-sala">Sala: {bloque.sala}</div>
        <div className="course-tipo">{bloque.tipo}</div>
      </div>);
    });
  };
  const renderCourseInfoForCSV = (daySchedule, slot) => {
    const courses = daySchedule.filter((bloque) =>
      isTimeWithinSlot(bloque.hora_inicio, bloque.hora_fin, slot.start, slot.end)
    );
  
    if (courses.length === 0) {
      return ""; // No hay cursos, devolver cadena vacía
    }
  
    // En lugar de retornar JSX, retornamos una representación de texto con la información relevante
    return courses.map((bloque) => {
      const courseName = courseDetails[bloque.seccion]?.nombre_curso || "Sin Nombre";
      const seccion = bloque.seccion || "Sin Sección";
      const sala = bloque.sala || "Sin Sala";
      const tipo = bloque.tipo || "Sin Tipo";
  
      // Crear una cadena con la información del curso
      return `${courseName} (Sección: ${seccion}, Sala: ${sala}, Tipo: ${tipo})`;
    }).join("; "); // Los cursos separados por un punto y coma
  };
  

  // Función para renderizar eventos especiales
  const renderSpecialEvents = () => (
    <div className="special-events">
      <h2>Eventos Especiales</h2>
      {specialEvents.length > 0 ? (
        specialEvents.map((evento, index) => (
          <div key={index} className="event-item">
            <h3>{evento.nombre_curso} (Sección: {evento.seccion})</h3>
            <p><strong>Tipo:</strong> {evento.tipo}</p>
            <p>
              <strong>Fecha:</strong> {evento.fecha_inicio} - {evento.fecha_fin}
            </p>
            <p>
              <strong>Hora:</strong> {evento.hora_inicio} - {evento.hora_fin}
            </p>
            <p><strong>Sala:</strong> {evento.sala}</p>
          </div>
        ))
      ) : (
        <p>No hay eventos especiales para mostrar.</p>
      )}
    </div>
  );

  const daysOfWeek = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  weeklySchedule.forEach((bloque) => {
    daysOfWeek[bloque.dia_semana].push(bloque);
  });
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
          {timeSlots.map((slot, index) => (
            <tr key={index}>
              <td>{slot.start} - {slot.end}</td>
              {[1, 2, 3, 4, 5].map((day) => (
                <td key={day}>{renderCourseInfo(daysOfWeek[day], slot)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const convertScheduleToCSV = () => {
    const header = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const rows = timeSlots.map((slot) => {
      const row = [
        `${slot.start} - ${slot.end}`,
        ...[1, 2, 3, 4, 5].map((day) => renderCourseInfoForCSV(daysOfWeek[day], slot))
      ];
      return row.join(",");  // Une cada celda con coma
    });
  
    return [header.join(","), ...rows].join("\n");  // Junta el header y las filas con saltos de línea
  };  
  
  const downloadScheduleCSV = () => {
    const csvData = convertScheduleToCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "horario.csv";  // Nombre del archivo a descargar
    link.click();  // Simula el clic para iniciar la descarga
  };

    // Función para capturar el contenido y descargarlo como PNG
    const downloadScheduleAsPNG = () => {
      const element = document.getElementById("schedule-container"); // Seleccionamos el contenedor que queremos capturar
      html2canvas(element).then((canvas) => {
        // Creamos un enlace para descargar la imagen
        const link = document.createElement("a");
        link.download = "horario.png"; // Nombre del archivo de imagen
        link.href = canvas.toDataURL("image/png"); // Convertimos el canvas a URL en formato PNG
        link.click(); // Simulamos el clic para descargar la imagen
      });
    };  

  return (
    <div className="home-container">
      <h1>Horarios</h1>
      <select onChange={handleScheduleChange} value={selectedSchedule}>
        {horarios.map((horario, index) => (
          <option key={index} value={index}>
            {horario.nombre || `Horario ${index + 1}`}
          </option>
        ))}
      </select>
      {schedule && schedule.length > 0 ? (
        <>
          <button onClick={downloadScheduleCSV}>Descargar horario (CSV)</button>
          <button onClick={downloadScheduleAsPNG}>Descargar horario (PNG)</button>
          <div id="schedule-container">
            {renderSchedule()}
          </div>
          {renderSpecialEvents()}
        </>
      ) : (
        <p>No hay horarios disponibles.</p>
      )}
    </div>
  );
};

export default Home;
