import { useState } from 'react'
import './App.css'
import FileDisplay from './components/FileDisplay'
import FileNavigationBar from './components/FileNavigationBar'
import { Box, AppBar, Typography, Toolbar, Stack } from '@mui/material'

function App() {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ position: "absolute" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
              Daedalus Demo
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack sx={{ alignItems: "center", position: "absolute", top: 70 }} spacing={2}>
          <FileNavigationBar />
          <FileDisplay />
        </Stack>

      </Box>
    </>
  )
}

export default App
