import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./crudSeccion.css";

const API_URL = process.env.REACT_APP_API_URL;
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

const CrudSeccion = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [courses, setCourses] = useState([]);
  console.log(courses);
  const [professors, setProfessors] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    nrc: "",
    profesor: "",
    curso: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchCourses();
    fetchProfessors();
    fetchSections();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/cursos/`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await axios.get(`${API_URL}/profesores/`);
      setProfessors(response.data);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${API_URL}/secciones/`);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSection = async () => {
    console.log("URL Profesor:", `${API_URL}/profesores/${formData.profesor}/`);

    try {
      // Construir URLs completas para profesor y curso
      const { nrc, profesor, curso } = formData;
      if (!nrc || !profesor || !curso) {
        alert("Por favor completa todos los campos.");
        return;
      }

      const dataToSend = {
        nrc,
        profesor,
        curso: curso,
      };

      console.log("Datos enviados:", dataToSend); // Depuración
      await axios.post(`${API_URL}/secciones/`, dataToSend);
      fetchSections();
      resetForm();
    } catch (error) {
      console.error(
        "Error al agregar sección:",
        error.response?.data || error.message
      );
    }
  };

  const handleEditSection = async () => {
    try {
      const { nrc, profesor, curso } = formData;
      console.log(profesor);
      if (!nrc || !profesor || !curso) {
        alert("Por favor completa todos los campos.");
        return;
      }

      const dataToSend = {
        nrc,
        profesor,
        curso: `${API_URL}/cursos/${curso}/`,
      };

      await axios.put(`${API_URL}/secciones/${nrc}/`, dataToSend, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchSections();
      resetForm();
      setEditMode(false);
    } catch (error) {
      console.error("Error editing section:", error);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await axios.delete(`${API_URL}/secciones/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nrc: "",
      profesor: "",
      curso: "",
    });
    setEditMode(false);
  };

  const getProfessorName = (professorId) => {
    const professor = professors.find((prof) => prof.id === professorId);
    return professor ? professor.nombre : "Desconocido";
  };

  const getCourseName = (courseId) => {
    const course = courses.find((course) => course.id === courseId);
    return course ? course.nombre : "Desconocido";
  };

  return (
    <div className="crud-admin-container">
      <h2>Gestionar Secciones</h2>
      <form
        className="section-form"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleEditSection() : handleAddSection();
        }}
      >
        {/* Fila para NRC y Profesor */}
        <div className="row">
          <input
            className="nrc"
            type="number"
            name="nrc"
            placeholder="NRC"
            value={formData.nrc}
            onChange={handleChange}
            required
          />

          <select
            className="profesor"
            name="profesor"
            value={formData.profesor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Profesor</option>
            {professors.map((professor) => (
              <option key={professor.url} value={professor.id}>
                {professor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fila para Curso */}
        <div className="row">
          <select
            className="curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <button type="submit" className="submit-button">
          {editMode ? "Actualizar" : "Agregar"} Sección
        </button>
      </form>

      <table className="section-table">
        <thead>
          <tr>
            <th>NRC</th>
            <th>Profesor</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.id}>
              <td>{section.nrc}</td>
              <td>{getProfessorName(section.profesor)}</td>
              <td>{getCourseName(section.curso)}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setFormData({
                      nrc: section.nrc,
                      profesor: section.profesor.split("/").slice(-2, -1)[0],
                      curso: section.curso.split("/").slice(-2, -1)[0],
                    });
                    setEditMode(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSection(section.nrc)}
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

export default CrudSeccion;
