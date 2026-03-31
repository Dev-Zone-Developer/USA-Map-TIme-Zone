import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage/Homepage'
import DeveloperPage from './Components/DeveloperPage/DeveloperPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/developer' element={<DeveloperPage />} />
      </Routes>
    </Router>
  )
}

export default App