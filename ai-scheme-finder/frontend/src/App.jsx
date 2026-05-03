import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import EligibilityForm from './pages/EligibilityForm'
import Results from './pages/Results'
import SchemeDetail from './pages/SchemeDetail'
import AllSchemes from './pages/AllSchemes'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<EligibilityForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/scheme/:id" element={<SchemeDetail />} />
        <Route path="/schemes" element={<AllSchemes />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen mesh-bg">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}
