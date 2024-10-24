import React, { useState } from 'react';
import { uploadExcelApi } from '../../api/uploadExcelApi'; // Importa el servicio
import './UploadExcel.css'; // Asegúrate de tener este archivo CSS

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState({
    AREA: 'AREA',
    PLAN_DE_ESTUDIO: 'PLAN DE ESTUDIO',
    NRC: 'NRC',
    MATERIA_CURSO: 'MATERIA/CURSO',
    CONECTOR_LIGA: 'CONECTOR LIGA',
    LISTA_CRUZADA: 'LISTA CRUZADA',
    SECC: 'SECC.',
    TITULO: 'TITULO',
    LUNES: 'LUNES',
    MARTES: 'MARTES',
    MIERCOLES: 'MIERCOLES',
    JUEVES: 'JUEVES',
    VIERNES: 'VIERNES',
    INICIO: 'INICIO',
    FIN: 'FIN',
    TIPO_DE_REUNION: 'TIPO DE REUNIÓN',
    SALA: 'SALA',
    PROFESOR: 'PROFESOR',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setSuccessMessage('');
  };

  // Función para manejar el cambio de texto en las cabeceras
  const handleHeaderChange = (e, key) => {
    setHeaders({
      ...headers,
      [key]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('headers', JSON.stringify(headers)); // Agrega las cabeceras

    const token = localStorage.getItem('authToken');
    setLoading(true);

    try {
      const result = await uploadExcelApi(formData, token);
      setSuccessMessage('Archivo subido exitosamente.');
      console.log(result);

    } catch (error) {
      setError(`Error: ${error.detail || error}`);
      console.error('Error al subir el archivo:', error);
    } finally {
      setLoading(false);
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
        <div className="headers-scroll-container">
          {Object.keys(headers).map((key) => (
            <input
              key={key}
              type="text"
              value={headers[key]}
              onChange={(e) => handleHeaderChange(e, key)}
              className="header-input"
            />
          ))}
        </div>
        <button type="submit" className={`upload-excel-button ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? 'Cargando...' : 'Subir'}
        </button>
      </form>
      {error && <p className="upload-excel-error">{error}</p>}
      {successMessage && <p className="upload-excel-success">{successMessage}</p>}
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default UploadExcel;
