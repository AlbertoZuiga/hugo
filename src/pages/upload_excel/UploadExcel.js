import React, { useState } from "react";
import axios from "axios";
import "./UploadExcel.css"; // Asegúrate de tener este archivo CSS

const UploadExcel = () => {
  const [file, setFile] = useState(null); // Estado para almacenar el archivo
  const [fileName, setFileName] = useState(""); // Estado para almacenar el nombre del archivo

  // Manejar la selección del archivo
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Guardar el archivo en el estado
    setFileName(selectedFile ? selectedFile.name : ""); // Mostrar el nombre del archivo
  };

  // Enviar el archivo al backend
  const handleSubmit = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Añadir el archivo al FormData

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Indicar que es un formulario con archivo
        },
      });
      console.log("Archivo subido exitosamente:", response.data);
      alert("Archivo subido exitosamente");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un error al subir el archivo");
    }
  };

  return (
    <div className="upload-container">
      <h2>Subir Excel</h2>
      {/* Input para seleccionar el archivo */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="file-input"
      />
      {/* Mostrar el nombre del archivo seleccionado */}
      {fileName && <p>Archivo seleccionado: {fileName}</p>}

      {/* Botón para enviar el archivo */}
      <button className="upload-button" onClick={handleSubmit}>
        <i className="icon">📁</i> Subir Excel
      </button>
    </div>
  );
};

export default UploadExcel;
