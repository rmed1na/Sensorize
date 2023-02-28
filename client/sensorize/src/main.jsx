import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import App from './App'
import Home from './components/Home'
import './index.css'
import './colors.scss'
import "@fontsource/roboto"
import "@fontsource/noto-sans"

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<App />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
