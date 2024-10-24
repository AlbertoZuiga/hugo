// UserPreferences.js
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux"; // Importar el hook useSelector de Redux
import "./UserPreferences.css"; // Asegúrate de tener este archivo CSS

const ItemType = "COURSE";

// Componente para cada curso
const CourseItem = ({ course, index, moveCourse, toggleRequired }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveCourse(item.index, index);
        item.index = index; // Actualiza el índice
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "10px",
        margin: "5px 0",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
      className={isDragging ? "dragging" : "course-item"}
    >
      <div>{course.nombre}</div> {/* Ajustar para el nombre del curso */}
      <div>
        <input
          type="checkbox"
          checked={course.required}
          onChange={toggleRequired}
        />
      </div>
    </div>
  );
};

// Componente para las preferencias de usuario
const UserPreferences = () => {
  const selectedCourses = useSelector((state) => state.courses.selectedCourses); // Obtener cursos seleccionados de Redux
  const [coursePreferences, setCoursePreferences] = useState([]); // Estado local para los cursos ordenados
  const [avoidGaps, setAvoidGaps] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sincronizar los cursos seleccionados con el estado local
  useEffect(() => {
    if (selectedCourses.length > 0) {
      setCoursePreferences(
        selectedCourses.map((course) => ({
          ...course,
          required: false, // Añadir un campo `required` para cada curso
        }))
      );
    } else {
      setErrorMessage("No has seleccionado ningún curso.");
    }
  }, [selectedCourses]);

  // Función para mover un curso en la lista
  const moveCourse = (fromIndex, toIndex) => {
    const updatedCourses = [...coursePreferences];
    const [movedCourse] = updatedCourses.splice(fromIndex, 1);
    updatedCourses.splice(toIndex, 0, movedCourse);
    setCoursePreferences(updatedCourses);
  };

  // Función para alternar el estado de obligatorio
  const toggleRequired = (index) => {
    setCoursePreferences((prevPreferences) =>
      prevPreferences.map((course, i) =>
        i === index ? { ...course, required: !course.required } : course
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="preferences-list">
        <h2>Preferencias de cursos (Ordenar por prioridad)</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {coursePreferences.map((course, index) => (
          <CourseItem
            key={course.url} // Usar URL como clave única
            index={index}
            course={course}
            moveCourse={moveCourse}
            toggleRequired={() => toggleRequired(index)}
          />
        ))}

        <div className="avoid-gaps">
          <label>
            Evitar ventanas
            <input
              type="checkbox"
              checked={avoidGaps}
              onChange={() => setAvoidGaps((prev) => !prev)}
            />
          </label>
        </div>
      </div>
    </DndProvider>
  );
};

export default UserPreferences;
