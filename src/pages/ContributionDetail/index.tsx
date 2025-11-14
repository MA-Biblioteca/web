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
} from '@mui/icons-material'

import {
  downloadFile,
  getContributionById,
  downloadAllFiles,
} from '@/services/contribution'
import { getRatingsByContribution, createRating } from '@/services/ratings'
import { addComment } from '@/services/comments'
import { Contribution, Comment } from '@/types'
import StarRating from '@/components/StarRating'
import { bigIconSx } from '@/styles/global'
import { useAuth } from '@/contexts/AuthContext'

interface DecodedToken {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  verified?: string
  role: string
  sub: string
}

const ContributionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const [avgRating, setAvgRating] = useState<number>(0)
  const [totalRatings, setTotalRatings] = useState<number>(0)

  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null
  )
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Función para decodificar el token (igual que en Profile)
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Obtener el ID del usuario actual desde el token
  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token)
      if (decodedToken) {
        setCurrentUserId(decodedToken.id)
      }
    }
  }, [token])

  useEffect(() => {
    const fetchContribution = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await getContributionById(Number(id))
        setContribution(data)
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

  const getRatings = async () => {
    if (!contribution) return
    const { avgRating, ratingsCount } = await getRatingsByContribution(
      Number(contribution?.id)
    )
    setAvgRating(avgRating ?? 0)
    setTotalRatings(ratingsCount ?? 0)
  }

  // Función para verificar si el usuario actual es el dueño de la contribución
  const isOwner = () => {
    if (!currentUserId || !contribution) return false
    return currentUserId === contribution.userId
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

  const handleEdit = () => {
    if (!contribution) return
    navigate(`/upload/${contribution.id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getResourceTypeColor = (type: number) => {
    const typeColors: { [key: number]: string } = {
      1: '#1976d2',
      2: '#f50057',
      3: '#ff9800',
      4: '#4caf50',
      5: '#9c27b0',
      6: '#1976d2',
      7: '#f50057',
      8: '#4caf50',
      9: '#9c27b0',
      10: '#4caf50',
    }
    return typeColors[type] || '#757575'
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !contribution) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error || 'Recurso no encontrado'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f8f9fa',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
            >
              Volver
            </Button>
            
            {/* BOTÓN DE EDITAR - SOLO PARA EL PROPIETARIO */}
            {isOwner() && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                Editar
              </Button>
            )}
          </Stack>
        </Box>

        {/* Main Content */}
        <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {/* Title and Resource Type */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, flex: 1 }}
            >
              {contribution.title}
            </Typography>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Chip
                label={
                  (contribution.views ?? 0) +
                  ` vista${contribution.views !== 1 ? 's' : ''}`
                }
                sx={{
                  backgroundColor: getResourceTypeColor(
                    contribution.resourceType.id
                  ),
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: '0.875rem',
                }}
                variant="outlined"
              />
              <Chip
                label={contribution.resourceType.name}
                sx={{
                  backgroundColor: getResourceTypeColor(
                    contribution.resourceType.id
                  ),
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </Stack>

          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Califica este recurso:
            </Typography>
            <StarRating
              value={avgRating}
              onChange={handleRatingChange}
              totalRatings={totalRatings > 0 ? totalRatings : undefined}
              size="large"
            />
            {totalRatings === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: 'block' }}
              >
                Aún no hay calificaciones
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Metadata */}
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
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publicado el {formatDate(contribution.createdAt)}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}
            >
              Descripción
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
            >
              {contribution.description}
            </Typography>
          </Box>

          {/* Files */}
          {contribution.files.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Archivos adjuntos ({contribution.files.length})
                  </Typography>
                  {contribution.files.length > 1 && (
                    <Button
                      variant="outlined"
                      startIcon={
                        downloading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DownloadIcon />
                        )
                      }
                      onClick={handleDownload}
                      disabled={downloading || downloadingFileId !== null}
                      sx={{
                        borderColor: getResourceTypeColor(
                          contribution.resourceType.id
                        ),
                        color: getResourceTypeColor(
                          contribution.resourceType.id
                        ),
                        '&:hover': {
                          borderColor: getResourceTypeColor(
                            contribution.resourceType.id
                          ),
                          backgroundColor: `${getResourceTypeColor(
                            contribution.resourceType.id
                          )}10`,
                        },
                      }}
                    >
                      {downloading ? 'Descargando...' : 'Descargar todos'}
                    </Button>
                  )}
                </Box>
                <Stack spacing={2}>
                  {contribution.files.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: '#eeeeee',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <AttachFileIcon sx={{ ...bigIconSx, flexShrink: 0 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.originalName}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          downloadingFileId === file.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DownloadIcon />
                          )
                        }
                        onClick={() =>
                          handleDownloadSingleFile(file.id, file.originalName)
                        }
                        disabled={downloading || downloadingFileId !== null}
                        sx={{
                          backgroundColor: getResourceTypeColor(
                            contribution.resourceType.id
                          ),
                          flexShrink: 0,
                          ml: 2,
                          '&:hover': {
                            backgroundColor: getResourceTypeColor(
                              contribution.resourceType.id
                            ),
                            filter: 'brightness(0.9)',
                          },
                        }}
                      >
                        {downloadingFileId === file.id
                          ? 'Descargando...'
                          : 'Descargar'}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Paper>

        {/* Comments Section */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Comentarios ({contribution.comments?.length || 0})
          </Typography>

          {/* Comments List */}
          <Stack spacing={2}>
            {contribution.comments && contribution.comments.length > 0 ? (
              contribution.comments.map((comment: Comment) => (
                <Card
                  key={comment.id}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}
                      >
                        {comment.user?.firstName?.charAt(0).toUpperCase() ||
                          comment.user?.email?.charAt(0).toUpperCase() ||
                          'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {comment.user?.email}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: 'block' }}
                        >
                          {formatDate(comment.createdAt)}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ mt: 1, lineHeight: 1.6 }}
                        >
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

          {/* Comment Input */}
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
                endIcon={
                  submittingComment ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={!commentText.trim() || submittingComment}
              >
                {submittingComment ? 'Enviando...' : 'Enviar comentario'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ContributionDetail