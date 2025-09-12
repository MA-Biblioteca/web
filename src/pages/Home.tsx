import { Box, Typography } from '@mui/material'

function Home() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
    >
      <Typography variant="h1" component="h1">
        Home
      </Typography>
    </Box>
  )
}

export default Home