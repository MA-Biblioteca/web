import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { clearHomeLinkClass } from './styles'
import { pageBoxContainerStyle } from '@/styles/global'
import ResourceList from '@/components/ResourceList'

const Home = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Typography variant="h3" component={Link} to="/aporteform" sx={clearHomeLinkClass}>
        Subir aporte
      </Typography>

      <ResourceList />
    </Box>
  )
}

export default Home
