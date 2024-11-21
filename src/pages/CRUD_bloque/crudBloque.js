import React, { useState, useEffect } from "react";
import axios from "axios";
import "./crudBloque.css";

const CrudBloque = () => {
  const [formData, setFormData] = useState({
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
    tipo: "",
    fecha_inicio: "",
    fecha_fin: "",
    sala: "",
    seccion: "",
  });

  const [secciones, setSecciones] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetchSecciones();
  }, []);

  const fetchSecciones = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/secciones/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSecciones(response.data);
    } catch (error) {
      console.error("Error al cargar las secciones:", error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Convertir fecha del formato AAAA-MM-DD a DD/MM/AAAA al capturar
    if (name === "fecha_inicio" || name === "fecha_fin") {
      const [yyyy, mm, dd] = value.split("-");
      value = `${dd}/${mm}/${yyyy}`;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      };

      // Convertir fechas al formato AAAA-MM-DD para el backend
      const formatDateForBackend = (date) => {
        const [dd, mm, yyyy] = date.split("/");
        return `${yyyy}-${mm}-${dd}`;
      };

      const dataToSend = {
        ...formData,
        fecha_inicio: formatDateForBackend(formData.fecha_inicio),
        fecha_fin: formatDateForBackend(formData.fecha_fin),
      };

      const response = await axios.post("http://localhost:8000/bloques/", dataToSend, { headers });
      setResponseMessage("Bloque creado exitosamente.");
      console.log("Respuesta del servidor:", response.data);
      setFormData({
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
        tipo: "",
        fecha_inicio: "",
        fecha_fin: "",
        sala: "",
        seccion: "",
      });
    } catch (error) {
      console.error("Error al crear el bloque:", error.response?.data || error.message);
      setResponseMessage("Error al crear el bloque. Revisa los datos.");
    }
  };

  // Convertir fecha de DD/MM/AAAA a AAAA-MM-DD para mostrar en el input date
  const convertDateForInput = (date) => {
    if (!date.includes("/")) return date; // Ya está en formato AAAA-MM-DD
    const [dd, mm, yyyy] = date.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="bloques-form-container">
      <h2>Crear Bloque</h2>
      <form onSubmit={handleSubmit} className="bloques-form">
        <div className="form-row">
          <label>Día de la Semana</label>
          <input
            type="number"
            name="dia_semana"
            value={formData.dia_semana}
            onChange={handleChange}
            placeholder="1 = Lunes, 5 = Viernes"
            required
          />
        </div>
        <div className="form-row">
          <label>Hora de Inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Hora de Fin</label>
          <input
            type="time"
            name="hora_fin"
            value={formData.hora_fin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Tipo</label>
          <input
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange} 
            placeholder="Ejemplo: CLAS"
            required
          />
        </div>
        <div className="form-row">
          <label>Fecha de Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={convertDateForInput(formData.fecha_inicio)} // Convertir a AAAA-MM-DD para el input
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Fecha de Fin</label>
          <input
            type="date"
            name="fecha_fin"
            value={convertDateForInput(formData.fecha_fin)} // Convertir a AAAA-MM-DD para el input
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Sala</label>
          <input
            type="text"
            name="sala"
            value={formData.sala}
            onChange={handleChange}
            placeholder="Ejemplo: I01"
            required
          />
        </div>
        <div className="form-row">
          <label>Sección (NRC)</label>
          <select
            name="seccion"
            value={formData.seccion}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar NRC</option>
            {secciones.map((seccion) => (
              <option key={seccion.nrc} value={seccion.nrc}>
                {seccion.nrc}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Crear Bloque
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default CrudBloque;
