// UserPreferences.js
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
      <div>{course.name}</div>
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
  const [coursePreferences, setCoursePreferences] = useState([]);
  const [avoidGaps, setAvoidGaps] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener cursos de la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/selected_courses");

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        // Mapea los datos a un formato adecuado
        setCoursePreferences(
          data.map((course) => ({
            name: course.title,
            required: false,
          }))
        );
      } catch (error) {
        setErrorMessage(
          "Hubo un error al cargar los cursos. Intenta nuevamente."
        );
        console.error("Error al obtener los cursos:", error);
      }
    };

    fetchCourses();
  }, []);

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
            key={course.name}
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
