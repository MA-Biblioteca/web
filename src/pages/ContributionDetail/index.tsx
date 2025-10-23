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
} from '@mui/icons-material'
import { getContributionById, downloadAllFiles } from '@/services/contribution'
import { Contribution, Comment } from '@/types'
import StarRating from '@/components/StarRating'

const ContributionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    const fetchContribution = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await getContributionById(Number(id))
        setContribution(data)
        setError(null)
      } catch (err) {
        console.error('Error loading contribution:', err)
        setError('Error al cargar el recurso. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchContribution()
  }, [id])

  const handleRatingChange = async () => {
    if (!contribution) return

    try {
      // TODO: Implement rate contribution
      setSnackbar({
        open: true,
        message: 'Calificación enviada correctamente',
        severity: 'success',
      })
      // Refresh contribution to get updated rating
      const updated = await getContributionById(contribution.id)
      setContribution(updated)
    } catch (error) {
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
      // TODO: Implement add comment
      setSnackbar({
        open: true,
        message: 'Comentario agregado correctamente',
        severity: 'success',
      })
      setCommentText('')
      // Refresh contribution to get updated comments
      const updated = await getContributionById(contribution.id)
      setContribution(updated)
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
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
        </Box>

        {/* Main Content */}
        <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          {/* Title and Resource Type */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, flex: 1 }}>
              {contribution.title}
            </Typography>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Chip
                label={Math.max(contribution.views ?? 0, 2) + ' vistas'}
                sx={{
                  backgroundColor: getResourceTypeColor(contribution.resourceType),
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: '0.875rem',
                }}
                variant="outlined"
              />
              <Chip
                label={contribution.resourceType}
                sx={{
                  backgroundColor: getResourceTypeColor(contribution.resourceType),
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
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Califica este recurso:
            </Typography>
            <StarRating
              value={contribution.userRating || contribution.averageRating || 0}
              onChange={handleRatingChange}
              totalRatings={contribution.totalRatings}
              size="large"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Metadata */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: '#666' }} />
              <Typography variant="body1" color="text.secondary">
                {contribution.careerSubject.career.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ color: '#666' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {contribution.careerSubject.subject.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 20, color: '#666' }} />
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
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Descripción
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {contribution.description}
            </Typography>
          </Box>

          {/* Files */}
          {contribution.files.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Archivos adjuntos
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachFileIcon sx={{ color: '#666' }} />
                    <Typography variant="body1">
                      {contribution.files.length} {contribution.files.length === 1 ? 'archivo' : 'archivos'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                    onClick={handleDownload}
                    disabled={downloading}
                    sx={{
                      backgroundColor: getResourceTypeColor(contribution.resourceType),
                      '&:hover': {
                        backgroundColor: getResourceTypeColor(contribution.resourceType),
                        filter: 'brightness(0.9)',
                      },
                    }}
                  >
                    {downloading ? 'Descargando...' : 'Descargar'}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Comments Section */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Comentarios ({contribution.comments?.length || 0})
          </Typography>

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
                endIcon={submittingComment ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={!commentText.trim() || submittingComment}
              >
                {submittingComment ? 'Enviando...' : 'Enviar comentario'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Comments List */}
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
                          {comment.content}
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
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  )
}

export default ContributionDetail
