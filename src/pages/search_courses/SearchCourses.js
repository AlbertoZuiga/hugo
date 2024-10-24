import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { coursesApi } from "../../api/coursesApi";
import { addCourse, removeCourse } from "../../redux/actions/courseActions";
import { schedulesApi } from "../../api/schedulesApi";
import { setSchedules } from "../../redux/actions/schedulesActions"; // Importar la acción
import "./SearchCourses.css";
import ProtectedSchedule from "../../components/protected_schedule/ProtectedSchedule";

const SearchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false); // Estado para controlar la vista
  const [avoidTimeConflicts, setAvoidTimeConflicts] = useState(false); // Estado para el checkbox
  const dispatch = useDispatch();
  const selectedCourses = useSelector((state) => state.courses.selectedCourses);
  const token = localStorage.getItem("authToken");

  // Efecto para obtener los cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await coursesApi(token);
        setCourses(data);

        // Validar los cursos seleccionados frente a los datos actuales de la API
        const validSelectedCourses = selectedCourses.filter((selectedCourse) =>
          data.some((apiCourse) => apiCourse.url === selectedCourse.url)
        );

        // Actualizar el estado de los cursos seleccionados si hay discrepancias
        if (validSelectedCourses.length !== selectedCourses.length) {
          validSelectedCourses.forEach((course) => dispatch(addCourse(course)));
          const invalidCourses = selectedCourses.filter(
            (selectedCourse) => !validSelectedCourses.includes(selectedCourse)
          );
          invalidCourses.forEach((course) => dispatch(removeCourse(course)));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, dispatch]);

  // Manejo de la selección de cursos
  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.url === course.url)) {
      dispatch(removeCourse(course));
    } else {
      dispatch(addCourse(course));
    }
    sendPreferences(); // Enviar preferencias al hacer click en un curso
  };

  // Manejo del botón para alternar vistas
  const toggleView = () => {
    setShowSelectedOnly((prev) => !prev); // Alternar entre mostrar solo seleccionados o todos
    sendPreferences(); // Enviar preferencias al cambiar la vista
  };

  // Manejo del cambio del checkbox
  const handleCheckboxChange = () => {
    setAvoidTimeConflicts((prev) => !prev); // Alternar el estado del checkbox
    sendPreferences(); // Enviar preferencias al cambiar el checkbox
  };

  // Función para enviar preferencias al backend
  const sendPreferences = async () => {
    const preferencesData = {
      permite_solapamiento: avoidTimeConflicts,
      cursos: selectedCourses.map((course) => course.url.split('/').filter(Boolean).pop()), // Enviar las URLs de los cursos seleccionados
    };

    try {
      const response = await schedulesApi(token, preferencesData); // Llama a la API para enviar preferencias
      console.log("Preferencias enviadas al backend:", response);
      dispatch(setSchedules(response.data)); // Guardar los horarios en Redux
    } catch (error) {
      console.error("Error al enviar preferencias:", error);
    }
  };

  return (
    <div className="course-selection">
      {/* Botón para alternar la vista, siempre visible */}
      <button onClick={toggleView} className="toggle-view-button">
        {showSelectedOnly
          ? "Mostrar Todos los Ramos"
          : "Mostrar Ramos Seleccionados"}
      </button>

      {showSelectedOnly ? (
        <>
          {/* Toggle para evitar topes de horarios */}
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={avoidTimeConflicts}
                onChange={handleCheckboxChange}
              />
              <span className="slider"></span>
              <span className="toggle-label">Evitar topes de horarios</span>
            </label>
          </div>

          <div className="selected-courses">
            <h2>Ramos seleccionados:</h2>
            {selectedCourses.length > 0 ? (
              selectedCourses.map((course, index) => (
                <div key={index} className="selected-course-item">
                  <h3>{course.nombre}</h3>
                  <p>Créditos: {course.creditos}</p>
                </div>
              ))
            ) : (
              <p>No has seleccionado ningún ramo aún.</p>
            )}
          </div>
          <ProtectedSchedule />
        </>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Buscar ramo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando cursos...</p>
            </div>
          ) : (
            <div className="courses-list">
              {courses
                .filter((course) =>
                  course.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((course) => (
                  <div
                    key={course.url}
                    className={`course-item ${
                      selectedCourses.some(
                        (selected) => selected.url === course.url
                      )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleCourseClick(course)}
                  >
                    <h3>{course.nombre}</h3>
                    <p>Créditos: {course.creditos}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCourses;
