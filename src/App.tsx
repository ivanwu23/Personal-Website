import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Placeholder from './pages/Placeholder'
import ScrollHint from './components/ScrollHint'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Placeholder title="Projects" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
      </Routes>
      <ScrollHint />
    </>
  )
}

export default App
