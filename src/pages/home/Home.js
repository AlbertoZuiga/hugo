import React from 'react';
import Schedule from "../../components/schedule/Schedule";
import "./Home.css"

const Home = () => {
  const schedule = {
    lunes: {
      "ramo 1": {
        tipo: "Clase",
        sala: "101",
        hora_inicio: "08:30",
        hora_termino: "10:20",
      },
      "ramo 2": {
        tipo: "Laboratorio",
        sala: "Lab",
        hora_inicio: "10:30",
        hora_termino: "12:20",
      },
    },
    martes: {
      "ramo 1": {
        tipo: "Clase",
        sala: "010",
        hora_inicio: "09:00",
        hora_termino: "10:30",
      },
      "ramo 2": {
        tipo: "Práctica",
        sala: "012",
        hora_inicio: "11:30",
        hora_termino: "13:30",
      },
    },
    miercoles: {},
    jueves: {},
    viernes: {},
  };

  return (
    <div>
        <h1>Welcome to the Home Page</h1>
      <Schedule schedule={schedule} />
    </div>
  );
};

export default Home;
