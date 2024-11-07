import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CRUDAdmin.css';

// Configurar el interceptor de Axios para agregar el token en cada solicitud
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CRUDAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    nrc: '',
    nombre_curso: '',
    nombre_profesor: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    fecha_inicio: '',
    fecha_fin: '',
    sala: '',
    tipo: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch existing courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cursos/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new course
  const handleAddCourse = async () => {
    try {
      await axios.post('http://localhost:8000/cursos/', formData);
      fetchCourses(); // Refresh list after adding
      setFormData({
        nrc: '',
        nombre_curso: '',
        nombre_profesor: '',
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        fecha_inicio: '',
        fecha_fin: '',
        sala: '',
        tipo: ''
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  // Edit an existing course
  const handleEditCourse = async () => {
    try {
      await axios.put(`http://localhost:8000/cursos/${editId}/`, formData);
      fetchCourses();
      setFormData({
        nrc: '',
        nombre_curso: '',
        nombre_profesor: '',
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        fecha_inicio: '',
        fecha_fin: '',
        sala: '',
        tipo: ''
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cursos/${id}/`);
      fetchCourses(); // Refresh list after deleting
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="crud-admin-container">
      <h2>Gestionar Cursos</h2>
      <form
        className="course-form"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleEditCourse() : handleAddCourse();
        }}
      >
        <input
          type="text"
          name="nrc"
          placeholder="NRC"
          value={formData.nrc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nombre_curso"
          placeholder="Nombre del curso"
          value={formData.nombre_curso}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nombre_profesor"
          placeholder="Nombre del profesor"
          value={formData.nombre_profesor}
          onChange={handleChange}
        />
        <input
          type="number"
          name="dia_semana"
          placeholder="Día de la semana (1-5)"
          value={formData.dia_semana}
          onChange={handleChange}
        />
        <input
          type="time"
          name="hora_inicio"
          placeholder="Hora inicio"
          value={formData.hora_inicio}
          onChange={handleChange}
        />
        <input
          type="time"
          name="hora_fin"
          placeholder="Hora fin"
          value={formData.hora_fin}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_inicio"
          placeholder="Fecha inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_fin"
          placeholder="Fecha fin"
          value={formData.fecha_fin}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sala"
          placeholder="Sala"
          value={formData.sala}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tipo"
          placeholder="Tipo de bloque"
          value={formData.tipo}
          onChange={handleChange}
        />
        <button type="submit" className="submit-button">
          {editMode ? 'Actualizar' : 'Agregar'} Curso
        </button>
      </form>
      <table className="course-table">
        <thead>
          <tr>
            <th>NRC</th>
            <th>Nombre Curso</th>
            <th>Profesor</th>
            <th>Día Semana</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Sala</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.nrc}</td>
              <td>{course.nombre_curso}</td>
              <td>{course.nombre_profesor}</td>
              <td>{course.dia_semana}</td>
              <td>{course.hora_inicio}</td>
              <td>{course.hora_fin}</td>
              <td>{course.fecha_inicio}</td>
              <td>{course.fecha_fin}</td>
              <td>{course.sala}</td>
              <td>{course.tipo}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setFormData(course);
                    setEditMode(true);
                    setEditId(course.id);
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRUDAdmin;
