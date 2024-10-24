import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { coursesApi } from "../../api/coursesApi";
import { addCourse, removeCourse } from "../../redux/actions/courseActions";
import "./SearchCourses.css";

const SearchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedCourses = useSelector((state) => state.courses.selectedCourses);
  const token = localStorage.getItem("authToken");

  // Sincronización de cursos seleccionados con los obtenidos de la API
  useEffect(() => {
    const fetchCourses = async () => {
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
  }, [token, dispatch, selectedCourses]);

  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.url === course.url)) {
      dispatch(removeCourse(course)); // Remover el curso si ya está seleccionado
    } else {
      dispatch(addCourse(course)); // Añadir el curso si no está seleccionado
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-selection">
      <h1>Buscar y Seleccionar Ramos</h1>

      <input
        type="text"
        placeholder="Buscar ramo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="courses-list">
        {courses
          .filter((course) =>
            course.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((course) => (
            <div
              key={course.url}
              className={`course-item ${
                selectedCourses.some((selected) => selected.url === course.url)
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
    </div>
  );
};

export default SearchCourses;
