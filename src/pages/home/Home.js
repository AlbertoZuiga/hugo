import React, { useEffect, useState } from "react";
import axios from "axios";
import Schedule from "../../components/schedule/Schedule";
import "./Home.css";

const Home = () => {
  // Estado para almacenar el horario obtenido de la API
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los horarios desde el backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("http://localhost:8000/schedules");
        setSchedule(response.data[0]);  // Dado que schedules es una lista, accedemos al primer elemento
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the schedule:", error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>Error loading schedule</div>;
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Schedule schedule={schedule} />
    </div>
  );
};

export default Home;
