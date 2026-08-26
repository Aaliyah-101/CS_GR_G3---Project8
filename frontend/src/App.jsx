import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Hero from './components/Hero.jsx'
import FeaturedStories from './components/FeaturedStories.jsx'
import Createstory from './pages/Createstory.jsx'
import Footer from './components/Footer.jsx'
import Gallery from './pages/Gallery.jsx'
import AboutUs from './pages/AboutUs.jsx'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Home({ onCreateClick }) {
  return (
    <>
      <Hero onCreateClick={onCreateClick} />
      <FeaturedStories />
      <Hero onCreateClick={onCreateClick} />
      <FeaturedStories />
    </>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-parchment">
      {/* Added onCreateClick prop so the Get Started button functions correctly */}
      <ScrollToTop />
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)} 
        onCreateClick={() => navigate('/create')}
      />
      
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Aaliyah"
        onNavigate={navigate}
      />

      <Routes>
        <Route path="/" element={<Home onCreateClick={() => navigate('/create')} />} />
        <Route path="/create" element={<Createstory onCancel={() => navigate('/')} />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>

      <Footer />
    </div>
  )
}

