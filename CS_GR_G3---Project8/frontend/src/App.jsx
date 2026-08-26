import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Hero from './components/Hero.jsx'
import FeaturedStories from './components/FeaturedStories.jsx'
import Createstory from './pages/Createstory.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('home') // 'home' | 'create'

  return (
    <div className="min-h-screen text-parchment">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Leah"
        onNavigate={setView}
      />

      {view === 'home' ? (
        <>
          <Hero onCreateClick={() => setView('create')} />
          <FeaturedStories />
        </>
      ) : (
        <Createstory onCancel={() => setView('home')} />
      )}

      <Footer />
    </div>
  )
}
