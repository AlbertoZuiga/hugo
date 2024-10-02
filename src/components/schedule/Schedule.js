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

  // Definimos las clases numéricas para los cursos
  const courseClassMapping = {};

  // Función que asigna un número único a cada curso
  const getCourseClass = (courseName) => {
    if (!courseClassMapping[courseName]) {
      const nextClassNumber = Object.keys(courseClassMapping).length + 1;
      courseClassMapping[courseName] = `course course-${nextClassNumber}`;
    }
    return courseClassMapping[courseName];
  };

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
    const courses = Object.entries(daySchedule).filter(([, details]) =>
      isTimeWithinSlot(
        details.hora_inicio,
        details.hora_termino,
        slot.start,
        slot.end
      )
    );

    if (courses.length === 0) {
      return ""; // No hay cursos en este bloque de tiempo
    }

    const overlappingCourses = findOverlappingCourses(courses);

    return courses.map(([courseName, details]) => {
      const isOverlapping = overlappingCourses.includes(courseName);
      const courseClass = getCourseClass(courseName);

      return (
        <div
          key={courseName}
          className={`${courseClass} ${isOverlapping ? "conflict" : ""}`}
        >
          <div className="course-name">{courseName}</div>
          <div className="course-sala">Sala: {details.sala}</div>
          <div className="course-tipo">{details.tipo}</div>
        </div>
      );
    });
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
      const [courseName1, details1] = courses[i];
      for (let j = i + 1; j < courses.length; j++) {
        const [courseName2, details2] = courses[j];
        if (
          isTimeOverlap(
            details1.hora_inicio,
            details1.hora_termino,
            details2.hora_inicio,
            details2.hora_termino
          )
        ) {
          overlapping.push(courseName1, courseName2);
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

  return <div>{renderSchedule()}</div>;
};

export default Schedule;
