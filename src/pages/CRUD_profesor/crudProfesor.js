import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import "./crudProfesor.css";

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

const CrudProfesor = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Ensure redirection happens only once after mounting, not on every render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [professors, setProfessors] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editUrl, setEditUrl] = useState(null);

  // Fetch existing professors
  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/profesores/");
      setProfessors(response.data);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new professor
  const handleAddProfessor = async () => {
    try {
      await axios.post("http://localhost:8000/profesores/", formData);
      fetchProfessors(); // Refresh list after adding
      resetForm();
    } catch (error) {
      console.error("Error adding professor:", error);
    }
  };

  // Edit an existing professor
  const handleEditProfessor = async () => {
    try {
      await axios.put(editUrl, formData);
      fetchProfessors();
      resetForm();
      setEditMode(false);
    } catch (error) {
      console.error("Error editing professor:", error);
    }
  };

  // Delete a professor
  const handleDeleteProfessor = async (url) => {
    try {
      await axios.delete(url);
      fetchProfessors(); // Refresh list after deleting
    } catch (error) {
      console.error("Error deleting professor:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
    });
    setEditMode(false);
    setEditUrl(null);
  };

  return (
    <div className="crud-admin-container">
      <h2>Gestionar Profesores</h2>
      <form
        className="professor-form"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleEditProfessor() : handleAddProfessor();
        }}
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del profesor"
          value={formData.nombre}
          onChange={handleChange}
        />
        <button type="submit" className="submit-button">
          {editMode ? "Actualizar" : "Agregar"} Profesor
        </button>
      </form>
      <table className="professor-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor) => (
            <tr key={professor.id}>
              <td>{professor.nombre}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    setFormData(professor);
                    setEditMode(true);
                    setEditUrl(professor.url);
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProfessor(professor.url)}
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

export default CrudProfesor;

