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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
import { getContributionById, downloadFile } from '@/services/contribution'
import { Contribution } from '@/types'
import { pageBoxContainerStyle } from '@/styles/global'

const ContributionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contribution, setContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleDownloadFile = async (fileId: number, fileName: string) => {
    try {
      await downloadFile(fileId, fileName)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'exam':
      case 'examen':
        return 'error'
      case 'summary':
      case 'resumen':
        return 'primary'
      case 'exercise':
      case 'ejercicio':
        return 'success'
      default:
        return 'default'
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📎'
    }
  }

  if (loading) {
    return (
      <Box sx={pageBoxContainerStyle}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    )
  }

  if (error || !contribution) {
    return (
      <Box sx={pageBoxContainerStyle}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Recurso no encontrado'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/explore')}
            variant="outlined"
          >
            Volver a Explorar
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={pageBoxContainerStyle}>
      <Container maxWidth="md">
        {/* Header with back button */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
        </Box>

        {/* Main content */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          {/* Title and resource type */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h4" component="h1" gutterBottom>
              {contribution.title}
            </Typography>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Chip
                label={Math.max(contribution.views ?? 0, 2) + ' vistas'}
                color={getResourceTypeColor(contribution.resourceType)}
                variant="outlined"
                size="small"
              />
              <Chip
                label={contribution.resourceType}
                color={getResourceTypeColor(contribution.resourceType)}
                variant="outlined"
                size="small"
              />
            </div>
          </Box>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" paragraph>
            {contribution.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Metadata */}
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <SchoolIcon sx={{ mr: 2, color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Carrera
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                  {contribution.careerSubject.career.name}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <AssignmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Materia
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                  {contribution.careerSubject.subject.name}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <CalendarIcon sx={{ mr: 2, color: 'primary.main', fontSize: 24 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Información
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                  Año {contribution.year} • {new Date(contribution.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* Files section */}
        {contribution.files && contribution.files.length > 0 && (
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AttachFileIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Archivos ({contribution.files.length})
                </Typography>
              </Box>

              <List disablePadding>
                {contribution.files.map((file, index) => (
                  <React.Fragment key={file.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: 1,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Typography variant="h6" component="span">
                          {getFileIcon(file.originalName)}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={file.originalName}
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontWeight: 'medium',
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDownloadFile(file.id, file.originalName)}
                          size="small"
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < contribution.files.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  )
}

export default ContributionDetail