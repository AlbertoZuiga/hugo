import React, { useEffect, useState } from "react";
import axios from "axios";
import Schedule from "../../components/schedule/Schedule";
import "./Home.css";

const Home = () => {
  // Estado para almacenar los horarios obtenidos de la API
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0); // Índice del horario seleccionado
  const [loading, setLoading] = useState(true);

  // Función para obtener los horarios desde el backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:8000/schedules");
        setSchedules(response.data); // Almacena todos los horarios
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the schedules:", error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Si aún está cargando, mostramos un mensaje
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si no se obtuvieron horarios, mostramos un error
  if (schedules.length === 0) {
    return <div>Error loading schedules</div>;
  }

  // Función para manejar la selección de un horario
  const handleScheduleChange = (event) => {
    setSelectedScheduleIndex(event.target.value);
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      
      {/* Dropdown para seleccionar el horario */}
      <label htmlFor="schedule-select">Select a Schedule:</label>
      <select id="schedule-select" onChange={handleScheduleChange} value={selectedScheduleIndex}>
        {schedules.map((schedule, index) => (
          <option key={index} value={index}>
            {schedule.nombre || `Schedule ${index + 1}`}
          </option>
        ))}
      </select>

      {/* Componente Schedule para mostrar el horario seleccionado */}
      <Schedule schedule={schedules[selectedScheduleIndex]} />
    </div>
  );
};

export default Home;
