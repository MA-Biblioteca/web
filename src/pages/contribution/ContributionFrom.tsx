import React, { useEffect, useRef, useState } from 'react'
import { useContribution } from './ContributionContext'
import { getCareers, getSubjects, createContribution } from '../../services'
import ModalNotification from '../../components/ModalNotification/Modal'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Container,
  Divider,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  CloudUpload,
  Delete,
  CheckCircle,
  School,
  CalendarToday,
  Subject,
  Assignment,
} from '@mui/icons-material'

const ContributionForm: React.FC = () => {
  const { data, setData } = useContribution()
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  type Career = { id: number; name: string }
  type Subject = { id: number; name: string }

  const [careers, setCareers] = useState<Career[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showModal, setShowModal] = useState(false)
  const [fileError, setFileError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const years = [
    { name: '1° Año', value: '1' },
    { name: '2° Año', value: '2' },
    { name: '3° Año', value: '3' },
    { name: '4° Año', value: '4' },
    { name: '5° Año', value: '5' },
  ]

  const types = [
    { name: 'Primer Parcial', value: 'Primer Parcial' },
    { name: 'Final', value: 'Final' },
    { name: 'TP', value: 'TP' },
    { name: 'Segundo Parcial', value: 'Segundo Parcial' },
    {
      name: 'Primer parcial-primer recuperatorio',
      value: 'Primer parcial-primer recuperatorio',
    },
    {
      name: 'Primer parcial-segundo recuperatorio',
      value: 'Primer parcial-segundo recuperatorio',
    },
    {
      name: 'Segundo parcial-primer recuperatorio',
      value: 'Segundo parcial-primer recuperatorio',
    },
    {
      name: 'Segundo parcial-segundo recuperatorio',
      value: 'Segundo parcial-segundo recuperatorio',
    },
  ]

  useEffect(() => {
    getCareers()
      .then((res) => {
        const careerList = res.map((c: unknown) => {
          const career = c as { id: number; name: string }
          return {
            id: career.id,
            name: career.name,
          }
        })
        setCareers(careerList)
      })
      .catch(() => setCareers([]))
  }, [])

  useEffect(() => {
    if (data.careerId && data.year) {
      const careerId = parseInt(data.careerId, 10)
      const yearNum = parseInt(data.year, 10)

      if (!isNaN(careerId) && !isNaN(yearNum)) {
        getSubjects(careerId, yearNum)
          .then((res) => {
            const subjectList = res.map((m: unknown) => {
              const subject = m as { id: number; name: string }
              return {
                id: subject.id,
                name: subject.name,
              }
            })
            setSubjects(subjectList)
          })
          .catch(() => setSubjects([]))
      }
    } else {
      setSubjects([])
    }
  }, [data.careerId, data.year])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    setFileError('')

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
    const validFiles = selected.filter((file) =>
      allowedTypes.includes(file.type)
    )
    if (validFiles.length !== selected.length) {
      setFileError('Solo se permiten PDFs e imágenes')
      return
    }

    // Validación tamaño por archivo (5MB)
    const oversize = validFiles.find((f) => f.size > 5 * 1024 * 1024)
    if (oversize) {
      setFileError(`El archivo ${oversize.name} supera los 5 MB`)
      return
    }

    // Validación tamaño total (20MB)
    const totalSize = [...files, ...validFiles].reduce(
      (acc, f) => acc + f.size,
      0
    )
    if (totalSize > 20 * 1024 * 1024) {
      setFileError('El tamaño total de archivos no puede superar 20 MB')
      return
    }

    setFiles([...files, ...validFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConfirm = async () => {
    if (
      !data.careerId ||
      !data.year ||
      !data.subjectId ||
      !data.resourceType ||
      !data.title ||
      !data.description
    ) {
      setFileError('Completa todos los campos antes de confirmar')
      return
    }
    if (files.length === 0) {
      setFileError('Debes seleccionar al menos un archivo')
      return
    }

    setIsSubmitting(true)
    setFileError('')

    try {
      await createContribution({
        careerId: parseInt(data.careerId, 10),
        subjectId: parseInt(data.subjectId, 10),
        year: parseInt(data.year, 10),
        resourceType: data.resourceType,
        title: data.title,
        description: data.description,
        files: files,
      })

      setShowModal(true)
    } catch (error: any) {
      console.log(error.response.data.message)
      setFileError(
        error.response.data.message ||
          'Error al enviar la contribución. Por favor, intenta nuevamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              component="h1"
              className="font-bold text-blue-600 mb-2"
            >
              Carga de Aporte
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Completa los datos para subir tu contribución académica
            </Typography>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={4}>
            {/* Carrera */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="carrera-label">
                  <Box className="flex items-center gap-2">
                    <School className="text-blue-500" />
                    Carrera
                  </Box>
                </InputLabel>
                <Select
                  labelId="carrera-label"
                  value={data.careerId}
                  label="Carrera"
                  onChange={(e) => {
                    setData('careerId', e.target.value)
                    setData('subjectId', '')
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione una carrera...</em>
                  </MenuItem>
                  {careers.map((c) => (
                    <MenuItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Año */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="year-label">
                  <Box className="flex items-center gap-2">
                    <CalendarToday className="text-blue-500" />
                    Año
                  </Box>
                </InputLabel>
                <Select
                  labelId="year-label"
                  value={data.year}
                  label="Año"
                  onChange={(e) => {
                    setData('year', e.target.value)
                    setData('subjectId', '')
                  }}
                  disabled={!data.careerId}
                >
                  <MenuItem value="">
                    <em>Seleccione un año...</em>
                  </MenuItem>
                  {years.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Materia */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="materia-label">
                  <Box className="flex items-center gap-2">
                    <Subject className="text-blue-500" />
                    Materia
                  </Box>
                </InputLabel>
                <Select
                  labelId="materia-label"
                  value={data.subjectId}
                  label="Materia"
                  onChange={(e) => setData('subjectId', e.target.value)}
                  disabled={
                    !data.careerId || !data.year || subjects.length === 0
                  }
                >
                  {subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tipo */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">
                  <Box className="flex items-center gap-2">
                    <Assignment className="text-blue-500" />
                    Tipo de Evaluación
                  </Box>
                </InputLabel>
                <Select
                  labelId="tipo-label"
                  value={data.resourceType}
                  label="Tipo de Evaluación"
                  onChange={(e) => setData('resourceType', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Seleccione el tipo...</em>
                  </MenuItem>
                  {types.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Título"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Ej: Final Exam 2024"
                required
                helperText="Ingresa un título descriptivo para tu contribución"
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Ej: Final exam for Mathematics course"
                multiline
                rows={4}
                required
                helperText="Describe el contenido de tu contribución"
              />
            </Grid>
          </Grid>

          <Divider className="my-10" />

          {/* File Upload Section */}
          <Box className="mb-6 mt-8">
            {/* File Error */}
            {fileError && (
              <Alert severity="error" className="mb-4">
                {fileError}
              </Alert>
            )}

            {/* Upload Area */}
            {files.length === 0 ? (
              <Paper
                className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload
                  className="text-blue-500 mb-4"
                  sx={{ fontSize: 64 }}
                />
                <Typography variant="h6" className="mb-2 text-gray-700">
                  Subir documentos
                </Typography>
                <Typography variant="body2" className="text-gray-500 mb-4">
                  Haz clic para seleccionar archivos o arrástralos aquí
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  PDF, PNG, JPG • Máx. 5MB por archivo • Máx. 20MB total
                </Typography>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </Paper>
            ) : (
              <Box>
                {/* File List */}
                <Paper className="p-4 bg-gray-50 mb-4">
                  <Box className="flex justify-between items-center mb-3">
                    <Typography variant="subtitle1" className="font-semibold">
                      Documentos seleccionados
                    </Typography>
                    <Chip
                      label={`${files.length} ${files.length === 1 ? 'archivo' : 'archivos'}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <List>
                    {files.map((file, idx) => (
                      <ListItem
                        key={idx}
                        className="bg-white rounded-lg mb-2 shadow-sm"
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFile(idx)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  {/* File Summary */}
                  <Box className="mt-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                    <Typography variant="body2" className="text-blue-700">
                      <strong>Total:</strong>{' '}
                      {(
                        files.reduce((acc, f) => acc + f.size, 0) /
                        1024 /
                        1024
                      ).toFixed(2)}{' '}
                      MB
                    </Typography>
                  </Box>
                </Paper>

                {/* Add More Button */}
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  Agregar más archivos
                </Button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </Box>
            )}
          </Box>

          {/* Submit Button */}
          <Box className="text-center mt-8">
            <Button
              variant="contained"
              size="large"
              onClick={handleConfirm}
              disabled={files.length === 0 || isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircle />
                )
              }
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Contribución'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showModal && <ModalNotification type="success" />}
    </Container>
  )
}

export default ContributionForm
