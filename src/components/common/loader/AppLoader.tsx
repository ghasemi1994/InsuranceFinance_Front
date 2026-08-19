import { Box, LinearProgress } from '@mui/material'
import React from 'react'

export default function AppLoader() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  )
}
