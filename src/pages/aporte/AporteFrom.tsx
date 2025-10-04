import React, { useEffect, useRef, useState } from 'react'
import { useAporte } from './AporteContext'
import './AporteForm.css'
import { useNavigate } from 'react-router-dom'
import { getCareers, getSubjects } from '../../services'
import ModalNotification from '../../components/ModalNotification/Modal'

const AporteForm: React.FC = () => {
  const { data, setData } = useAporte()
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [carreras, setCarreras] = useState<string[]>([])
  const [materias, setMaterias] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const anios = ['1° Año', '2° Año', '3° Año', '4° Año', '5° Año']
  const tipos = [
    'Primer Parcial', 'Final', 'TP', 'Segundo Parcial',
    'Primer parcial-primer recuperatorio', 'Primer parcial-segundo recuperatorio',
    'Segundo parcial-primer recuperatorio', 'Segundo parcial-segundo recuperatorio',
  ]

  useEffect(() => {
    getCareers()
      .then((res) => setCarreras(res.map((c: any) => c.nombre || c.name || c)))
      .catch(() => setCarreras([]))
  }, [])

  useEffect(() => {
    if (data.carrera && data.anio) {
      const anioNum = data.anio.split('°')[0]
      getSubjects(data.carrera, anioNum)
        .then((res) => setMaterias(res.map((m: any) => m.nombre || m.name || m)))
        .catch(() => setMaterias([]))
    } else {
      setMaterias([])
    }
    setData('materia', '')
    // eslint-disable-next-line
  }, [data.carrera, data.anio])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
    const validFiles = selected.filter((file) => allowedTypes.includes(file.type))
    if (validFiles.length !== selected.length) {
      alert('Solo se permiten PDFs e imágenes')
    }

    // Validación tamaño por archivo (5MB)
    const oversize = validFiles.find((f) => f.size > 5 * 1024 * 1024)
    if (oversize) {
      alert(`El archivo ${oversize.name} supera los 5 MB`)
      return
    }

    // Validación tamaño total (20MB)
    const totalSize = [...files, ...validFiles].reduce((acc, f) => acc + f.size, 0)
    if (totalSize > 20 * 1024 * 1024) {
      alert('El tamaño total de archivos no puede superar 20 MB')
      return
    }

    setFiles([...files, ...validFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConfirm = () => {
    if (!data.carrera || !data.anio || !data.materia || !data.tipo) {
      return alert('Completa todos los campos antes de confirmar')
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    // Si quieres redirigir después de cerrar el modal, descomenta la siguiente línea:
    // navigate('/upload')
  }

  return (
    <div className="aporte-form">
      <h2>Carga de Aporte</h2>

      <label>
        Carrera:
        <select value={data.carrera} onChange={(e) => setData('carrera', e.target.value)} disabled={!!data.anio}>
          <option value="">Seleccione...</option>
          {carreras.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label>
        Año:
        <select value={data.anio} onChange={(e) => setData('anio', e.target.value)} disabled={!data.carrera || !!data.materia}>
          <option value="">Seleccione...</option>
          {anios.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>

      <label>
        Materia:
        <select value={data.materia} onChange={(e) => setData('materia', e.target.value)} disabled={!data.anio || materias.length === 0}>
          {materias.length === 0 ? (
            <option value="">Ninguna materia cargada</option>
          ) : (
            <>
              <option value="">Seleccione...</option>
              {materias.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </>
          )}
        </select>
      </label>

      <fieldset>
        <legend>Tipo:</legend>
        {tipos.map((t) => (
          <label key={t}>
            <input
              type="radio"
              name="tipo"
              value={t}
              checked={data.tipo === t}
              onChange={(e) => setData('tipo', e.target.value)}
            />
            {t}
          </label>
        ))}
      </fieldset>

      {/* Subida de archivos (solo lista local) */}
      <div className="file-upload">
        <button type="button" className="custom-file-btn" onClick={() => fileInputRef.current?.click()}>
          Elegir archivos
        </button>
        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      <ul className="file-list">
        {files.map((file, idx) => (
          <li key={idx}>
            {file.name}
            <button type="button" onClick={() => handleRemoveFile(idx)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Botón Confirmar */}
      <div className="file-actions">
        <button type="button" className="confirm-btn" onClick={handleConfirm} disabled={files.length === 0}>
          Confirmar
        </button>
      </div>

      {showModal && (
        <ModalNotification
          message="¡Aporte enviado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default AporteForm
