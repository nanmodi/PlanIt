import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import { Route,Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import ChatbotPage from './components/ChatBotPage'
import HotelList from './components/HotelList'
import Flight from './components/Flight'
import Events from './components/Events'
import Hotel from './components/Hotel'

import ImageLocation from './components/ImageLocation'
import Iternary from './components/Iternary'
function App() {
 

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<HomePage></HomePage>}/>
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="/hotel" element={<HotelList />} />
        <Route path="/flight" element={<Flight />} />
        <Route path="/events" element={<Events/>} />
        <Route path='/hotels' element={<Hotel/>}/>
        <Route path='/image' element={<  ImageLocation/>}/>
        <Route path='/itineary' element={<Iternary></Iternary>}></Route>
      </Routes>
  
    </>
  )
}

export default App
