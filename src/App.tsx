import { Navigate, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Preview from './pages/Preview'
import ScrollHint from './components/ScrollHint'
import ScrollToTop from './components/ScrollToTop'
import RequireNavAccess from './components/RequireNavAccess'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Every page stacked on one scroll — see Preview.tsx. */}
        <Route path="/" element={<Preview />} />
        <Route
          path="/about"
          element={
            <RequireNavAccess>
              <About />
              <Footer />
            </RequireNavAccess>
          }
        />
        <Route
          path="/resume"
          element={
            <RequireNavAccess>
              <Resume />
              <Footer />
            </RequireNavAccess>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireNavAccess>
              <Projects />
              <Footer />
            </RequireNavAccess>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireNavAccess>
              <Contact />
              <Footer />
            </RequireNavAccess>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScrollHint />
    </>
  )
}

export default App
