// React
import React from 'react'
import ReactDOM from 'react-dom/client'
// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Chakra
import { ChakraProvider } from '@chakra-ui/react';
// Fonts
import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'
import '@fontsource/rubik/300.css'
import '@fontsource/rubik/400.css'
import '@fontsource/rubik/500.css'
import '@fontsource/rubik/600.css'
import '@fontsource/rubik/700.css'
import '@fontsource/rubik/800.css'
import '@fontsource/rubik/900.css'
// CC
import theme from './utils/theme'
import App from './App'
import Home from './pages/home/Home'
import Sensors from './pages/sensors/Sensors'
import NotificationGroups from './pages/notifications/Groups';
import NotificationRecipient from './pages/notifications/Recipients';
// CSS
import './index.css'
import './scrollbar.css'

//TODO: Implement private routes once backend auth is ready
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<App />} />
          <Route path='/home' element={<Home />} />
          <Route path='/sensor' element={<Sensors />} />
          <Route path='/notification/group' element={<NotificationGroups />} />
          <Route path='/notification/recipient' element={<NotificationRecipient />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
