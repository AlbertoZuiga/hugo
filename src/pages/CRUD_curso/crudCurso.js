import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import "./crudCurso.css";

// Configurar el interceptor de Axios para agregar el token en cada solicitud
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CrudCurso = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Ensure redirection happens only once after mounting, not on every render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    creditos: "",
    especialidad: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch existing courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/cursos/");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new course
  const handleAddCourse = async () => {
    try {
      await axios.post("http://localhost:8000/cursos/", formData);
      fetchCourses(); // Refresh list after adding
      resetForm();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Edit an existing course
  const handleEditCourse = async () => {
    try {
      await axios.put(`http://localhost:8000/cursos/${editId}/`, formData);
      fetchCourses();
      resetForm();
      setEditMode(false);
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cursos/${id}/`);
      fetchCourses(); // Refresh list after deleting
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      creditos: "",
      especialidad: "",
    });
    setEditMode(false);
    setEditId(null);
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
          name="nombre"
          placeholder="Nombre del curso"
          value={formData.nombre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="creditos"
          placeholder="Créditos"
          value={formData.creditos}
          onChange={handleChange}
        />
        <input
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={formData.especialidad}
          onChange={handleChange}
        />
        <button type="submit" className="submit-button">
          {editMode ? "Actualizar" : "Agregar"} Curso
        </button>
      </form>
      <table className="course-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Créditos</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.nombre}</td>
              <td>{course.creditos}</td>
              <td>{course.especialidad}</td>
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

export default CrudCurso;
