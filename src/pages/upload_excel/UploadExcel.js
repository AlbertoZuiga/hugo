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
  const [showHeadersForm, setShowHeadersForm] = useState(false); // Nueva variable de estado

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setSuccessMessage('');
    setShowHeadersForm(true); // Ahora mostramos el formulario de cabeceras cuando se selecciona un archivo
  };

  // Función para manejar el envío del archivo y las cabeceras editadas
  const handleSubmit = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('headers', JSON.stringify(headers)); // Adjuntamos las cabeceras revisadas al formData

    const token = localStorage.getItem('authToken');
    setLoading(true);

    try {
      // Subir el archivo con las cabeceras revisadas
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

  // Función para manejar el cambio de texto en las cabeceras
  const handleHeaderChange = (e, key) => {
    setHeaders({
      ...headers,
      [key]: e.target.value,
    });
  };

  return (
    <div className="upload-excel-container">
      <h2 className="upload-excel-title">Subir archivo Excel</h2>
      
      {!file && (
        <form className="upload-excel-form">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
            className="upload-excel-input"
          />
        </form>
      )}

      {file && showHeadersForm && (
        <div className="headers-edit-form">
          <h3>Edita los nombres de las columnas</h3>
          <div className="headers-scroll-container">
            {Object.keys(headers).map((key) => (
              <div key={key} className="header-input-container floating-excel-label">
                <input
                  type="text"
                  value={headers[key]}
                  onChange={(e) => handleHeaderChange(e, key)}
                  className="header-input"
                  placeholder=" " // Placeholder necesario para el efecto
                  required // Asegúrate de que el input se considere "válido"
                />
                <label className="header-label">{key}</label>
              </div>
            ))}
          </div>
          <button 
            className={`upload-excel-button ${loading ? 'loading' : ''}`} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Subir Archivo con Cabeceras Revisadas'}
          </button>
        </div>
      )}

      {error && <p className="upload-excel-error">{error}</p>}
      {successMessage && <p className="upload-excel-success">{successMessage}</p>}
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default UploadExcel;
