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
  const [protectedSchedules, setProtectedSchedules] = useState([]);
  const [error, setError] = useState(null);
  const [errorPreferences, setErrorPreferences] = useState(null);
  const [minimoNCursos, setMinimoNCursos] = useState(2); // Valor mínimo de cursos
  const [maxNCreditos, setMaxNCreditos] = useState(30); // Valor máximo de créditos
  const [cursosObligatorios, setCursosObligatorios] = useState([]); // Lista de cursos obligatorios
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state to check if the user is logged in
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const selectedCourses = useSelector((state) => state.courses.selectedCourses);
  const token = localStorage.getItem("authToken");

  const showErrorTemporarily = (setErrorFunction, message) => {
    setErrorFunction(message);
    setTimeout(() => {
      setErrorFunction(null);
    }, 5000);
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coursesApi();
      setCourses(data);
      validateSelectedCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showErrorTemporarily(
        setError,
        "Ocurrió un error al cargar los cursos. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sendPreferences = async () => {
    setErrorPreferences(null);
  
    // Estructura de los datos que se enviarán al backend
    const preferencesData = {
      "cursos": selectedCourses.map((course) => course.id), // IDs de los cursos seleccionados
      "permite_solapamiento": avoidTimeConflicts, // Evitar topes de horarios
      "horarios_protegidos": protectedSchedules, // Horarios protegidos
      "cursos_obligatorios": cursosObligatorios, // Cursos obligatorios
      "minimo_n_cursos": minimoNCursos, // Mínimo de cursos
      "max_n_creditos": maxNCreditos, // Máximo de créditos
    };
  
    // Depuración: Verifica que el objeto preferencesData esté correctamente estructurado
    console.log("Datos enviados al backend:", preferencesData);
  
    // Verificar si alguno de los valores importantes está vacío o no definido
    if (
      !preferencesData.cursos.length ||
      !preferencesData.cursos_obligatorios.length ||
      preferencesData.minimo_n_cursos === undefined ||
      preferencesData.max_n_creditos === undefined
    ) {
      showErrorTemporarily(
        setErrorPreferences,
        "Por favor, complete todos los campos requeridos."
      );
      return;
    }
  
    try {
      const response = await schedulesApi(preferencesData);
      console.log("Preferencias enviadas al backend:", response);
      dispatch(setSchedules(response.data));
      navigate("/");
    } catch (error) {
      console.error("Error al enviar preferencias:", error);
      showErrorTemporarily(
        setErrorPreferences,
        "Ocurrió un error al enviar las preferencias. Inténtalo más tarde."
      );
    }
  };  

  const validateSelectedCourses = (data) => {
    const validSelectedCourses = selectedCourses.filter((selectedCourse) =>
      data.some((apiCourse) => apiCourse.url === selectedCourse.url)
    );

    if (validSelectedCourses.length !== selectedCourses.length) {
      validSelectedCourses.forEach((course) => dispatch(addCourse(course)));
      const invalidCourses = selectedCourses.filter(
        (selectedCourse) => !validSelectedCourses.includes(selectedCourse)
      );
      invalidCourses.forEach((course) => dispatch(removeCourse(course)));
    }
  };

  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.url === course.url)) {
      dispatch(removeCourse(course));
    } else {
      dispatch(addCourse(course));
    }
  };

  const toggleView = () => {
    setShowSelectedOnly((prev) => !prev);
  };

  const handleCheckboxChange = () => {
    setAvoidTimeConflicts((prev) => !prev);
  };

  const handleProtectedScheduleChange = (formattedProtectedSchedules) => {
    setProtectedSchedules(formattedProtectedSchedules);
  };

  // Agregar o quitar cursos obligatorios
  const toggleObligatoryCourse = (courseId) => {
    setCursosObligatorios((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="course-selection">
      {isAuthenticated && (
        <button
          onClick={() => navigate("/crud-courses")}
          className="crud-button"
        >
          Gestionar Ramos (CRUD)
        </button>
      )}
      
      {error && (
        <p className={`error-message ${error ? "" : "hidden"}`}>{error}</p>
      )}

      {errorPreferences && (
        <p className={`error-message ${errorPreferences ? "" : "hidden"}`}>
          {errorPreferences}
        </p>
      )}

      <button onClick={toggleView} className="toggle-view-button">
        {showSelectedOnly
          ? "Mostrar Todos los Ramos"
          : "Mostrar Ramos Seleccionados"}
      </button>
      <h6>1) Para seleccionar un ramo haga click en él</h6>
      <h6>2) Luego haga click en "Mostrar Ramos Seleccionados"</h6>
      <h6>3) Finalmente elija sus preferencias y haga click en "Enviar Preferencias"</h6>

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

          {/* Nuevos campos */}
          <div>
            <label htmlFor="minimoNCursos">Mínimo de cursos:</label>
            <input
              type="number"
              id="minimoNCursos"
              value={minimoNCursos}
              onChange={(e) => setMinimoNCursos(Number(e.target.value))}
              min="1"
            />
          </div>

          <div>
            <label htmlFor="maxNCreditos">Máximo de créditos:</label>
            <input
              type="number"
              id="maxNCreditos"
              value={maxNCreditos}
              onChange={(e) => setMaxNCreditos(Number(e.target.value))}
              min="1"
            />
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
                  <button
                    onClick={() => toggleObligatoryCourse(course.id)}
                    className="obligatory-button"
                  >
                    {cursosObligatorios.includes(course.id)
                      ? "Eliminar de obligatorios"
                      : "Marcar como obligatorio"}
                  </button>
                </div>
              ))
            ) : (
              <p>No has seleccionado ningún ramo aún.</p>
            )}
          </div>

          <ProtectedSchedule onScheduleChange={handleProtectedScheduleChange} />
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
