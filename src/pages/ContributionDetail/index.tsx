import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Alert,
  TextField,
  Avatar,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Subject,
} from '@mui/icons-material'

import {
  downloadFile,
  getContributionById,
  downloadAllFiles,
  updateContribution,
} from '@/services/contribution'
import { getCareers } from '@/services/career' // ← Corregido
import { getSubjects } from '@/services/subject' // ← Corregido
import { getRatingsByContribution, createRating } from '@/services/ratings'
import { addComment } from '@/services/comments'
import { Contribution, Comment } from '@/types'
import StarRating from '@/components/StarRating'
import { bigIconSx } from '@/styles/global'

type Career = { id: number; name: string }
type Subject = { id: number; name: string }

const ContributionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const [avgRating, setAvgRating] = useState<number>(0)
  const [totalRatings, setTotalRatings] = useState<number>(0)
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null)
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })
  
  // Estado para edición
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCareerId, setEditCareerId] = useState('')
  const [editSubjectId, setEditSubjectId] = useState('')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [updating, setUpdating] = useState(false)

  // Estados para dropdowns
  const [careers, setCareers] = useState<Career[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchContribution = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getContributionById(Number(id))
        setContribution(data)
        setEditTitle(data.title)
        setEditDescription(data.description)
        setEditCareerId(data.careerSubject.career.id.toString())
        setEditSubjectId(data.careerSubject.subject.id.toString())
        setError(null)
        await getRatings()
      } catch (err) {
        console.error('Error loading contribution:', err)
        setError('Error al cargar el recurso. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchContribution()
  }, [id])

  // Cargar carreras
  useEffect(() => {
    getCareers()
      .then((res) => {
        const careerList = res.map((c: any) => ({
          id: c.id,
          name: c.name,
        }))
        setCareers(careerList)
      })
      .catch(() => setCareers([]))
  }, [])

  // Cargar materias cuando cambia la carrera
  useEffect(() => {
    if (editCareerId && contribution) {
      const careerId = parseInt(editCareerId, 10)
      const year = contribution.year // Usar el año actual de la contribución

      if (!isNaN(careerId)) {
        setLoadingSubjects(true)
        getSubjects(careerId, year)
          .then((res) => {
            const subjectList = res.map((m: any) => ({
              id: m.id,
              name: m.name,
            }))
            setSubjects(subjectList)
          })
          .catch(() => setSubjects([]))
          .finally(() => setLoadingSubjects(false))
      }
    } else {
      setSubjects([])
    }
  }, [editCareerId, contribution])

  const getRatings = async () => {
    if (!contribution) return
    try {
      const { avgRating, ratingsCount } = await getRatingsByContribution(
        Number(contribution?.id)
      )
      setAvgRating(avgRating ?? 0)
      setTotalRatings(ratingsCount ?? 0)
    } catch (error) {
      console.error('Error loading ratings:', error)
    }
  }

  const handleRatingChange = async (newValue: number) => {
    if (!contribution) return
    try {
      await createRating(contribution.id, newValue)
      setSnackbar({
        open: true,
        message: 'Calificación enviada correctamente',
        severity: 'success',
      })
      await getRatings()
    } catch (error) {
      console.error('Error al enviar calificación:', error)
      setSnackbar({
        open: true,
        message: 'Error al enviar la calificación',
        severity: 'error',
      })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contribution || !commentText.trim()) return

    try {
      setSubmittingComment(true)
      const newComment = await addComment(contribution.id, commentText)
      setContribution({
        ...contribution,
        comments: [...(contribution.comments || []), newComment],
      })
      setSnackbar({
        open: true,
        message: 'Comentario agregado correctamente',
        severity: 'success',
      })
      setCommentText('')
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al agregar el comentario',
        severity: 'error',
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDownload = async () => {
    if (!contribution || contribution.files.length === 0) return

    setDownloading(true)
    try {
      await downloadAllFiles(contribution.files)
      setSnackbar({
        open: true,
        message: `${contribution.files.length} ${contribution.files.length === 1 ? 'archivo descargado' : 'archivos descargados'} correctamente`,
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al descargar los archivos',
        severity: 'error',
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadSingleFile = async (fileId: number, fileName: string) => {
    setDownloadingFileId(fileId)
    try {
      await downloadFile(fileId, fileName)
      setSnackbar({
        open: true,
        message: `Archivo "${fileName}" descargado correctamente`,
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al descargar el archivo',
        severity: 'error',
      })
    } finally {
      setDownloadingFileId(null)
    }
  }

  // --- Funciones para edición ---
  const handleEditToggle = () => {
    if (!isEditing && contribution) {
      // Al entrar en edición, cargar valores actuales
      setEditTitle(contribution.title)
      setEditDescription(contribution.description)
      setEditCareerId(contribution.careerSubject.career.id.toString())
      setEditSubjectId(contribution.careerSubject.subject.id.toString())
    } else {
      // Al cancelar edición, resetear subjectId si se cambió la carrera
      if (contribution && editCareerId !== contribution.careerSubject.career.id.toString()) {
        setEditSubjectId(contribution.careerSubject.subject.id.toString())
        setEditCareerId(contribution.careerSubject.career.id.toString())
      }
    }
    setIsEditing(!isEditing)
    setNewFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files))
    }
  }

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!contribution) return
    
    // Validaciones básicas
    if (!editTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'El título es obligatorio',
        severity: 'error'
      })
      return
    }

    if (!editCareerId || !editSubjectId) {
      setSnackbar({
        open: true,
        message: 'Debe seleccionar carrera y materia',
        severity: 'error'
      })
      return
    }

    try {
      setUpdating(true)
      
      // Preparar datos para enviar
      const updateData: any = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        careerId: parseInt(editCareerId, 10),
        subjectId: parseInt(editSubjectId, 10),
      }
      
      // Solo agregar files si hay archivos nuevos seleccionados
      if (newFiles.length > 0) {
        updateData.files = newFiles
      }
      
      console.log('Enviando datos de actualización:', updateData)
      
      // Llamar al servicio
      await updateContribution(contribution.id, updateData)
      
      // Mensaje de éxito
      setSnackbar({
        open: true,
        message: 'Contribución actualizada correctamente',
        severity: 'success'
      })
      
      // Salir del modo edición
      setIsEditing(false)
      setNewFiles([])
      
      // Recargar los datos actualizados
      const updatedData = await getContributionById(Number(id))
      setContribution(updatedData)
      
    } catch (error) {
      console.error('Error updating contribution:', error)
      setSnackbar({ 
        open: true, 
        message: 'Error al actualizar la contribución', 
        severity: 'error' 
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getResourceTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      exam: '#1976d2',
      Final: '#f50057',
      parcial: '#ff9800',
      apunte: '#4caf50',
      ejercicios: '#9c27b0',
    }
    return typeColors[type] || '#757575'
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !contribution) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', gap: 2 }}>
        <Typography variant="h6" color="error">{error || 'Recurso no encontrado'}</Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Volver
          </Button>
          
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditToggle} color={isEditing ? "secondary" : "primary"}>
            {isEditing ? 'Cancelar edición' : 'Editar aporte'}
          </Button>
        </Box>

        {/* Main Content */}
        <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {/* Title */}
          <Box sx={{ mb: 3 }}>
            {isEditing ? (
              <TextField
                fullWidth
                label="Título"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                {contribution.title}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${contribution.views ?? 0} vista${contribution.views !== 1 ? 's' : ''}`}
                sx={{
                  backgroundColor: getResourceTypeColor(contribution.resourceType),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={contribution.resourceType}
                sx={{
                  backgroundColor: getResourceTypeColor(contribution.resourceType),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>

          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Califica este recurso:
            </Typography>
            <StarRating
              value={avgRating}
              onChange={handleRatingChange}
              totalRatings={totalRatings > 0 ? totalRatings : undefined}
              size="large"
            />
            {totalRatings === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Aún no hay calificaciones
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Metadata - En modo edición mostrar dropdowns */}
          {isEditing ? (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Carrera */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="carrera-label">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 20 }} />
                      Carrera
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="carrera-label"
                    value={editCareerId}
                    label="Carrera"
                    onChange={(e) => {
                      setEditCareerId(e.target.value)
                      setEditSubjectId('') // Resetear materia al cambiar carrera
                    }}
                  >
                    {careers.map((career) => (
                      <MenuItem key={career.id} value={career.id.toString()}>
                        {career.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Materia */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="materia-label">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Subject sx={{ fontSize: 20 }} />
                      Materia
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="materia-label"
                    value={editSubjectId}
                    label="Materia"
                    onChange={(e) => setEditSubjectId(e.target.value)}
                    disabled={!editCareerId || loadingSubjects}
                  >
                    {loadingSubjects ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                        <Typography variant="body2" sx={{ ml: 1 }}>Cargando materias...</Typography>
                      </MenuItem>
                    ) : (
                      subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            /* Metadata - En modo visualización normal */
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={bigIconSx} />
                <Typography variant="body1" color="text.secondary">
                  {contribution.careerSubject.career.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon sx={bigIconSx} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {contribution.careerSubject.subject.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon sx={bigIconSx} />
                  <Typography variant="body2" color="text.secondary">
                    Año {contribution.year}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">•</Typography>
                <Typography variant="body2" color="text.secondary">
                  Publicado el {formatDate(contribution.createdAt)}
                </Typography>
              </Box>
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Descripción
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {contribution.description}
              </Typography>
            )}
          </Box>

          {/* Files existentes */}
          {contribution.files.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Archivos adjuntos ({contribution.files.length})
                  </Typography>
                  {contribution.files.length > 1 && (
                    <Button
                      variant="outlined"
                      startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                      onClick={handleDownload}
                      disabled={downloading || downloadingFileId !== null}
                    >
                      {downloading ? 'Descargando...' : 'Descargar todos'}
                    </Button>
                  )}
                </Box>
                <Stack spacing={2}>
                  {contribution.files.map((file) => (
                    <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                        <AttachFileIcon sx={{ ...bigIconSx, flexShrink: 0 }} />
                        <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {file.originalName}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={downloadingFileId === file.id ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                        onClick={() => handleDownloadSingleFile(file.id, file.originalName)}
                        disabled={downloading || downloadingFileId !== null}
                      >
                        {downloadingFileId === file.id ? 'Descargando...' : 'Descargar'}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}

          {/* Nuevos archivos para agregar */}
          {isEditing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Agregar nuevos archivos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Los archivos nuevos se agregarán a los existentes.
                </Typography>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ marginBottom: '1rem' }}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                {newFiles.length > 0 && (
                  <Stack spacing={1}>
                    {newFiles.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="body2">{file.name}</Typography>
                        <IconButton size="small" onClick={() => handleRemoveNewFile(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </>
          )}

          {/* Botón de guardar */}
          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updating || !editTitle.trim() || !editCareerId || !editSubjectId}
                startIcon={updating ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {updating ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Comments Section */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Comentarios ({contribution.comments?.length || 0})
          </Typography>

          <Stack spacing={2}>
            {contribution.comments && contribution.comments.length > 0 ? (
              contribution.comments.map((comment: Comment) => (
                <Card key={comment.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {comment.user?.name || 'Usuario'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          {formatDate(comment.createdAt)}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                          {comment.text}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </Typography>
              </Box>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                endIcon={submittingComment ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={!commentText.trim() || submittingComment}
              >
                {submittingComment ? 'Enviando...' : 'Enviar comentario'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ContributionDetail