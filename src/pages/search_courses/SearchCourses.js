import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, removeCourse } from "../../redux/actions/courseActions";
import { useNavigate } from "react-router-dom";
import { coursesApi } from "../../api/coursesApi";
import { schedulesApi } from "../../api/schedulesApi";
import { setSchedules } from "../../redux/actions/schedulesActions";
import "./SearchCourses.css";
import ProtectedSchedule from "../../components/protected_schedule/ProtectedSchedule";

const SearchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [avoidTimeConflicts, setAvoidTimeConflicts] = useState(false);
  const [protectedSchedules, setProtectedSchedules] = useState([]); // Nuevo estado para horarios protegidos

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCourses = useSelector((state) => state.courses.selectedCourses);
  const token = localStorage.getItem("authToken");

  // Fetch courses from the API
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await coursesApi(token);
      setCourses(data);
      validateSelectedCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Validate and update selected courses
  const validateSelectedCourses = (data) => {
    const validSelectedCourses = selectedCourses.filter((selectedCourse) =>
      data.some((apiCourse) => apiCourse.url === selectedCourse.url)
    );

    if (validSelectedCourses.length !== selectedCourses.length) {
      // Despachar cursos válidos
      validSelectedCourses.forEach((course) => dispatch(addCourse(course)));
      // Remover cursos inválidos
      const invalidCourses = selectedCourses.filter(
        (selectedCourse) => !validSelectedCourses.includes(selectedCourse)
      );
      invalidCourses.forEach((course) => dispatch(removeCourse(course)));
    }
  };

  // Handle course selection
  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.url === course.url)) {
      // Deseleccionar el curso si ya está seleccionado
      dispatch(removeCourse(course));
    } else {
      // Seleccionar el curso si no está seleccionado
      dispatch(addCourse(course));
    }
  };

  // Toggle view between selected and all courses
  const toggleView = () => {
    setShowSelectedOnly((prev) => !prev);
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setAvoidTimeConflicts((prev) => !prev);
  };

  // Actualiza los horarios protegidos cuando cambian
  const handleProtectedScheduleChange = (formattedProtectedSchedules) => {
    setProtectedSchedules(formattedProtectedSchedules);
  };

  // Send user preferences to the backend
  const sendPreferences = async () => {
    const preferencesData = {
      permite_solapamiento: avoidTimeConflicts,
      cursos: selectedCourses.map((course) =>
        course.url.split("/").filter(Boolean).pop()
      ),
      horarios_protegidos: protectedSchedules, // Usa los horarios protegidos formateados
    };

    try {
      const response = await schedulesApi(token, preferencesData);
      console.log("Preferencias enviadas al backend:", response);
      dispatch(setSchedules(response.data));
      navigate("/");
    } catch (error) {
      console.error("Error al enviar preferencias:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="course-selection">
      <button onClick={toggleView} className="toggle-view-button">
        {showSelectedOnly ? "Mostrar Todos los Ramos" : "Mostrar Ramos Seleccionados"}
      </button>

      {showSelectedOnly ? (
        <>
          <button onClick={sendPreferences} className="toggle-view-button">
            Enviar Preferencias
          </button>
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
                  <button
                    className="deselect-button"
                    onClick={() => handleCourseClick(course)}
                  >
                    Deseleccionar
                  </button>
                </div>
              ))
            ) : (
              <p>No has seleccionado ningún ramo aún.</p>
            )}
          </div>

          <ProtectedSchedule
            onScheduleChange={handleProtectedScheduleChange}
          />
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
