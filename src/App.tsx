import { useState } from 'react'
import './App.css'
import FileDisplay from './components/FileDisplay'
import FileNavigationBar from './components/FileNavigationBar'
import { Box, AppBar, Typography, Toolbar } from '@mui/material'

function App() {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Daedalus Demo
            </Typography>
          </Toolbar>
        </AppBar>
        <FileNavigationBar />
        <FileDisplay />
      </Box>
    </>
  )
}

export default App
