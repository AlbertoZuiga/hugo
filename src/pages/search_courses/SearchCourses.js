import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchCourses.css';

const SearchCourses = () => {
  const [courses, setCourses] = useState([]); // Lista de ramos obtenidos de la API
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [selectedCourses, setSelectedCourses] = useState([]); // Ramos seleccionados
  const [loading, setLoading] = useState(true);

  // Obtener la lista de ramos del backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar ramos según el término de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar selección y deselección de ramos
  const handleCourseClick = (course) => {
    if (selectedCourses.includes(course)) {
      // Deseleccionar el ramo si ya está en la lista de seleccionados
      setSelectedCourses(selectedCourses.filter((c) => c !== course));
    } else {
      // Seleccionar el ramo si no está en la lista
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Manejar la búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-selection">
      <h1>Buscar y Seleccionar Ramos</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar ramo..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {/* Mostrar ramos filtrados */}
      <div className="courses-list">
        {filteredCourses.map((course, index) => (
          <div
            key={index}
            className={`course-item ${
              selectedCourses.includes(course) ? 'selected' : ''
            }`}
            onClick={() => handleCourseClick(course)}
          >
            <h3>{course.title}</h3>
            <p>Profesor: {course.teacher}</p>
            <p>Área: {course.area}</p>
            <p>Mayor: {course.mayor}</p>
            <p>Minor: {course.minor}</p>
          </div>
        ))}
      </div>

      {/* Mostrar ramos seleccionados */}
      <div className="selected-courses">
        <h2>Ramos seleccionados:</h2>
        {selectedCourses.length > 0 ? (
          selectedCourses.map((course, index) => (
            <div key={index} className="selected-course-item">
              <h3>{course.title}</h3>
              <p>{course.teacher}</p>
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
