import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { Contribution } from '@/types'
import { downloadAllFiles } from '@/services/contribution'

interface ResourceCardProps {
  contribution: Contribution
}

const ResourceCard: React.FC<ResourceCardProps> = ({ contribution }) => {
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

  const handleDownload = async () => {
    if (contribution.files.length === 0) return

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
        message: 'Error al descargar los archivos. Por favor, intenta nuevamente.',
        severity: 'error',
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
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

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top colored bar based on resource type */}
      <Box
        sx={{
          height: '6px',
          background: `linear-gradient(90deg, ${getResourceTypeColor(contribution.resourceType)}, ${getResourceTypeColor(contribution.resourceType)}dd)`,
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with title and resource type chip */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            sx={{ mb: 1.5 }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: '1.25rem',
                color: '#1a1a1a',
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {contribution.title}
            </Typography>
            <Chip
              label={contribution.resourceType}
              size="small"
              sx={{
                backgroundColor: getResourceTypeColor(contribution.resourceType),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'capitalize',
              }}
            />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {contribution.description}
          </Typography>
        </Box>

        {/* Career and Subject */}
        <Box sx={{ mb: 2 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 18, color: '#666' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {contribution.careerSubject.career.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ fontSize: 18, color: '#666' }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: '#333',
                  fontSize: '0.875rem',
                }}
              >
                {contribution.careerSubject.subject.name}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Year and Date */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                Año {contribution.year}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              •
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(contribution.createdAt)}
            </Typography>
          </Stack>
        </Box>

        {/* Files section */}
        {contribution.files.length > 0 && (
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachFileIcon sx={{ fontSize: 18, color: '#666' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {contribution.files.length} {contribution.files.length === 1 ? 'archivo' : 'archivos'}
                </Typography>
              </Box>
              <Tooltip title={downloading ? 'Descargando...' : 'Descargar archivos'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={handleDownload}
                    disabled={downloading}
                    sx={{
                      color: getResourceTypeColor(contribution.resourceType),
                      '&:hover': {
                        backgroundColor: `${getResourceTypeColor(contribution.resourceType)}15`,
                      },
                      '&.Mui-disabled': {
                        color: '#ccc',
                      },
                    }}
                  >
                    {downloading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DownloadIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        )}

        {contribution.files.length === 0 && (
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AttachFileIcon sx={{ fontSize: 16 }} />
              Sin archivos adjuntos
            </Typography>
          </Box>
        )}
      </CardContent>

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
    </Card>
  )
}

export default ResourceCard

