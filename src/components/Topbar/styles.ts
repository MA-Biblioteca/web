export const clearLinkClass = {
  textDecoration: 'none',
  color: 'inherit',
  padding: '8px 16px',
}

export const clearPathLinkClass = {
  ...clearLinkClass,
  borderRadius: '1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}

export const boxContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  margin: '0 28px',
}

export const boxLinksContainerStyle = {
  display: 'flex',
  gap: '16px',
}
