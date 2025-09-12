import { Box, Typography } from '@mui/material'

function About() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
    >
      <Typography variant="h1" component="h1">
        About
      </Typography>
    </Box >
  )
}

export default About