import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchCourses.css';

const SearchCourses = () => {
  const [courses, setCourses] = useState([]); // Lista de ramos obtenidos de la API
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [selectedCourses, setSelectedCourses] = useState([]); // Ramos seleccionados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showSelectedCourses, setShowSelectedCourses] = useState(false); // Toggle para mostrar lista seleccionada
  const [selectedArea, setSelectedArea] = useState(''); // Estado para el área seleccionada
  const [selectedMajor, setSelectedMajor] = useState(''); // Estado para el major seleccionado
  const [selectedMinor, setSelectedMinor] = useState(''); // Estado para el minor seleccionado
  const [professorSearchTerm, setProfessorSearchTerm] = useState(''); // Término de búsqueda para el profesor

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

  // Unificar la estructura de profesores: manejar ambos formatos
  const normalizeCourseTeachers = (courses) => {
    return courses.map((course) => ({
      ...course,
      teachers: Array.isArray(course.teacher) ? course.teacher : [course.teacher], // Convertir "teacher" en un array si no lo es
    }));
  };

  // Agrupar profesores por el título del ramo
  const groupCoursesByTitle = (courses) => {
    const grouped = {};
    courses.forEach((course) => {
      const { title, teachers } = course; // Extraer el título y profesores ya normalizados

      if (!grouped[title]) {
        grouped[title] = {
          ...course,
          teachers: [...teachers], // Crear un array de profesores
        };
      } else {
        // Evitar duplicados de profesores en la misma agrupación
        const allTeachers = [...grouped[title].teachers, ...teachers];
        grouped[title].teachers = Array.from(new Set(allTeachers)); // Actualizar lista de profesores sin duplicados
      }
    });
    return Object.values(grouped); // Devolver los ramos agrupados
  };

  // Filtrar ramos según los filtros aplicados
  const filteredCourses = groupCoursesByTitle(normalizeCourseTeachers(courses)).filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedArea === '' || course.area === selectedArea) &&
    (selectedMajor === '' || course.mayor === selectedMajor) &&
    (selectedMinor === '' || course.minor === selectedMinor) &&
    (professorSearchTerm === '' || course.teachers.some((teacher) =>
      teacher.toLowerCase().includes(professorSearchTerm.toLowerCase())
    ))
  );

  // Manejar selección y deselección de ramos
  const handleCourseClick = (course) => {
    if (selectedCourses.some((selected) => selected.title === course.title)) {
      // Deseleccionar el ramo si ya está en la lista de seleccionados
      setSelectedCourses(selectedCourses.filter((c) => c.title !== course.title));
    } else {
      // Seleccionar el ramo si no está en la lista
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Manejar la búsqueda por título del curso
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Manejar el cambio de área
  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  // Manejar el cambio de mayor
  const handleMajorChange = (event) => {
    setSelectedMajor(event.target.value);
  };

  // Manejar el cambio de minor
  const handleMinorChange = (event) => {
    setSelectedMinor(event.target.value);
  };

  // Manejar la búsqueda por nombre del profesor
  const handleProfessorSearchChange = (event) => {
    setProfessorSearchTerm(event.target.value);
  };

  // Toggle para cambiar entre mostrar la lista de todos los ramos o los ramos seleccionados
  const toggleView = () => {
    setShowSelectedCourses(!showSelectedCourses);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Obtener una lista única de áreas, majors, minors y profesores para los dropdowns y el filtro de profesores
  const areas = [...new Set(courses.map(course => course.area))];
  const majors = [...new Set(courses.map(course => course.mayor))];
  const minors = [...new Set(courses.map(course => course.minor))];
  const allProfessors = [...new Set(courses.flatMap(course => course.teachers))];

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

      {/* Contenedor para filtros */}
      <div className="filters">
        {/* Filtro por área */}
        <select value={selectedArea} onChange={handleAreaChange} className="area-filter">
          <option value="">Todas las Áreas</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Filtro por mayor */}
        <select value={selectedMajor} onChange={handleMajorChange} className="major-filter">
          <option value="">Todos los Mayors</option>
          {majors.map((major, index) => (
            <option key={index} value={major}>
              {major}
            </option>
          ))}
        </select>

        {/* Filtro por minor */}
        <select value={selectedMinor} onChange={handleMinorChange} className="minor-filter">
          <option value="">Todos los Minors</option>
          {minors.map((minor, index) => (
            <option key={index} value={minor}>
              {minor}
            </option>
          ))}
        </select>

        {/* Filtro por profesor */}
        <div className="professor-filter">
          <input
            type="text"
            placeholder="Buscar profesor..."
            value={professorSearchTerm}
            onChange={handleProfessorSearchChange}
            className="search-bar"
          />
        </div>
      </div>

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
                <h3>{course.title}</h3>
                <p>Profesores:</p>
                {course.teachers.map((prof, idx) => (
                  <p key={idx}>{prof}</p>
                ))}
                <p>Área: {course.area}</p>
                <p>Mayor: {course.mayor}</p>
                <p>Minor: {course.minor}</p>
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
                selectedCourses.some((selected) => selected.title === course.title) ? 'selected' : ''
              }`}
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.title}</h3>
              <p>Área: {course.area}</p>
              <p>Mayor: {course.mayor}</p>
              <p>Minor: {course.minor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCourses;
