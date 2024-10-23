import React, { useState } from 'react';
import { uploadExcelApi } from '../../api/uploadExcelApi'; // Importa el servicio
import "./UploadExcel.css"; // Asegúrate de tener este archivo CSS

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setSuccessMessage('');
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    const token = localStorage.getItem('authToken');

    try {
      const result = await uploadExcelApi(file, token); // Llama a la función del servicio
      setSuccessMessage('Archivo subido exitosamente.');
      console.log(result); // Manejar la respuesta como desees

    } catch (error) {
      setError(`Error: ${error.detail || error}`); // Maneja el error de forma adecuada
      console.error('Error al subir el archivo:', error);
    }
  };

  return (
    <div>
      <h2>Subir archivo Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Subir</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default UploadExcel;
