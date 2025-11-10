import { SxProps, Theme } from '@mui/material'

export const profileHeaderPaperSx: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
}

export const profileAvatarSx: SxProps<Theme> = {
  width: 120,
  height: 120,
  bgcolor: 'rgba(255,255,255,0.2)',
  color: 'white',
  fontSize: '3rem',
  fontWeight: 700,
  border: '4px solid rgba(255,255,255,0.3)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}

export const profileNameSx: SxProps<Theme> = {
  fontWeight: 700,
  mb: 0.5,
}

export const profileCareerBoxSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 1,
}

export const profileCareerTextSx: SxProps<Theme> = {
  opacity: 0.9,
}

export const profileInfoContainerSx: SxProps<Theme> = {
  display: 'flex',
  gap: 3,
  mt: 2,
  flexWrap: 'wrap',
}

export const profileInfoItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
}

export const profileInfoIconSx: SxProps<Theme> = {
  fontSize: 18,
  opacity: 0.8,
}

export const profileInfoTextSx: SxProps<Theme> = {
  opacity: 0.9,
}

export const profileStatsBoxSx: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  mt: 3,
}

export const profileStatsChipSx: SxProps<Theme> = {
  bgcolor: 'rgba(255,255,255,0.2)',
  color: 'white',
  fontWeight: 600,
  backdropFilter: 'blur(10px)',
}

export const contributionsTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  mb: 3,
  color: '#1a1a1a',
}

export const emptyStatePaperSx: SxProps<Theme> = {
  p: 6,
  textAlign: 'center',
}
