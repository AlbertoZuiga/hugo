// UserPreferences.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Importar el hook useSelector de Redux
import "./UserPreferences.css"; // Asegúrate de tener este archivo CSS

// Componente para cada curso
const CourseItem = ({ course }) => {
  return (
    <div
      style={{
        padding: "10px",
        margin: "5px 0",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
      className="course-item"
    >
      <div>{course.nombre}</div> {/* Ajustar para el nombre del curso */}
    </div>
  );
};

// Componente para las preferencias de usuario
const UserPreferences = () => {
  const selectedCourses = useSelector((state) => state.courses.selectedCourses); // Obtener cursos seleccionados de Redux
  const [coursePreferences, setCoursePreferences] = useState([]); // Estado local para los cursos

  // Sincronizar los cursos seleccionados con el estado local
  useEffect(() => {
    if (selectedCourses.length > 0) {
      setCoursePreferences(
        selectedCourses.map((course) => ({
          ...course,
          required: false, // Añadir un campo `required` para cada curso
        }))
      );
    }
  }, [selectedCourses]);

  return (
    <div className="preferences-list">
      <h2>Preferencias de cursos</h2>
      {coursePreferences.map((course) => (
        <CourseItem
          key={course.url} // Usar URL como clave única
          course={course}
        />
      ))}
    </div>
  );
};

export default UserPreferences;
