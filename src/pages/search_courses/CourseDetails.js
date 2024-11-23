import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CourseDetails.css"; // Importamos el archivo de estilos

const API_URL = process.env.REACT_APP_API_URL;

const CourseDetails = () => {
  const { courseId } = useParams(); // Usamos useParams para obtener el ID del curso desde la URL
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/secciones/?curso=${courseId}`);
        if (!response.ok) {
          throw new Error("Error fetching course details");
        }
        const data = await response.json();
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // El hook useEffect se ejecuta cuando courseId cambia

  if (!courseDetails) {
    return <p>Cargando detalles del curso...</p>;
  }

  return (
    <div className="course-details-page">
      <h2>Detalles del Curso</h2>
      {courseDetails.map((section, index) => (
        <div key={index} className="section-container">
          <h3>Sección {index + 1}</h3>
          <p>
            <strong>Especialidad:</strong> {section.especialidad}
          </p>
          <p>
            <strong>Profesor:</strong> {section.nombre_profesor}
          </p>
          <p>
            <strong>NRC:</strong> {section.nrc}
          </p>

          {section.bloques.map((block) => (
            <div key={block.id} className="block-container">
              <p>
                <strong>Tipo:</strong> {block.tipo}
              </p>
              <p>
                <strong>Sala:</strong> {block.sala}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;
