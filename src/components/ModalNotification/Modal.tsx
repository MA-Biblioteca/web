import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Modal.css'

const UploadNotificationModal: React.FC<{ type: string }> = ({ type }) => {
  const isSuccess = type === 'success'
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  const handleRetry = () => {
    navigate('/subir') // Ajusta la ruta según corresponda para reintentar
  }

  const handleNew = () => {
    navigate('/subir') // Ajusta la ruta según corresponda para subir otro contribution
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-box ${isSuccess ? 'success' : 'error'}`}>
        <h2>{isSuccess ? '✅ Subida Exitosa' : '⚠️ Error en la Subida'}</h2>
        <p>
          {isSuccess
            ? 'Tu contenido fue cargado correctamente.'
            : 'Hubo un problema al cargar tu contenido.'}
        </p>

        <div className="modal-actions">
          <button className="btn home" onClick={handleHome}>
            Volver a la Home
          </button>

          {isSuccess ? (
            <button className="btn secondary" onClick={handleNew}>
              Subir otra contribución
            </button>
          ) : (
            <button className="btn secondary" onClick={handleRetry}>
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadNotificationModal
