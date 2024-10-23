import React, { useState, useEffect } from 'react';
import { getCoursesApi } from '../../api/getCoursesApi';
import './SearchCourses.css';

const SearchCourses = () => {
  const [courses, setCourses] = useState([]); // Lista de ramos obtenidos de la API
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [selectedCourses, setSelectedCourses] = useState([]); // Ramos seleccionados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showSelectedCourses, setShowSelectedCourses] = useState(false); // Toggle para mostrar lista seleccionada
  const [professorSearchTerm, setProfessorSearchTerm] = useState(''); // Término de búsqueda para el profesor
  const token = localStorage.getItem('authToken');

  // Obtener la lista de ramos del backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesApi(token); // Llama a la API
        setCourses(data); // Almacena los cursos obtenidos en el estado
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Aquí puedes manejar el error según sea necesario
      } finally {
        setLoading(false); // Cambia el estado de carga
      }
    };

    fetchCourses(); // Llama a la función para obtener los cursos
  }, [token]); // Asegúrate de que el token no cambie

  // Filtrar ramos según los filtros aplicados
  const filteredCourses = courses.filter((course) =>
    course.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar selección y deselección de ramos
  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.url === course.url)) {
      // Deseleccionar el ramo si ya está en la lista de seleccionados
      setSelectedCourses(selectedCourses.filter((c) => c.url !== course.url));
    } else {
      // Seleccionar el ramo si no está en la lista
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Manejar la búsqueda por título del curso
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Toggle para cambiar entre mostrar la lista de todos los ramos o los ramos seleccionados
  const toggleView = () => {
    setShowSelectedCourses(!showSelectedCourses);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-selection">
      <h1>Buscar y Seleccionar Ramos</h1>

      {/* Barra de búsqueda general por título */}
      <input
        type="text"
        placeholder="Buscar ramo..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {/* Toggle para cambiar entre las listas */}
      <button onClick={toggleView} className="toggle-button">
        {showSelectedCourses ? 'Ver Todos los Ramos' : 'Ver Ramos Seleccionados'}
      </button>

      {/* Mostrar ramos filtrados o ramos seleccionados, según el estado del toggle */}
      {showSelectedCourses ? (
        <div className="selected-courses">
          <h2>Ramos seleccionados:</h2>
          {selectedCourses.length > 0 ? (
            selectedCourses.map((course, index) => (
              <div key={index} className="selected-course-item">
                <h3>{course.nombre}</h3>
                <p>Créditos: {course.creditos}</p>
                <p>URL: {course.url}</p>
              </div>
            ))
          ) : (
            <p>No has seleccionado ningún ramo aún.</p>
          )}
        </div>
      ) : (
        <div className="courses-list">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className={`course-item ${
                selectedCourses.some((selected) => selected.url === course.url) ? 'selected' : ''
              }`}
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.nombre}</h3>
              <p>Créditos: {course.creditos}</p>
              <p>URL: {course.url}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCourses;
