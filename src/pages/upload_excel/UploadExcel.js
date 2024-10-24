import React, { useState } from 'react';
import { uploadExcelApi } from '../../api/uploadExcelApi'; // Importa el servicio
import './UploadExcel.css'; // Asegúrate de tener este archivo CSS

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para cargar

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
    setLoading(true); // Comienza la carga

    try {
      const result = await uploadExcelApi(file, token); // Llama a la función del servicio
      setSuccessMessage('Archivo subido exitosamente.');
      console.log(result); // Manejar la respuesta como desees

    } catch (error) {
      setError(`Error: ${error.detail || error}`); // Maneja el error de forma adecuada
      console.error('Error al subir el archivo:', error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  return (
    <div className="upload-excel-container">
      <h2 className="upload-excel-title">Subir archivo Excel</h2>
      <form className="upload-excel-form" onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileChange} 
          className="upload-excel-input"
        />
        <button type="submit" className={`upload-excel-button ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? 'Cargando...' : 'Subir'}
        </button>
      </form>
      {error && <p className="upload-excel-error">{error}</p>}
      {successMessage && <p className="upload-excel-success">{successMessage}</p>}
      {loading && <div className="spinner"></div>} {/* Spinner de carga */}
    </div>
  );
};

export default UploadExcel;
