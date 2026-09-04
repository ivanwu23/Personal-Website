import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Resume from './pages/Resume'
import Placeholder from './pages/Placeholder'
import ScrollHint from './components/ScrollHint'
import RequireNavAccess from './components/RequireNavAccess'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={
            <RequireNavAccess>
              <About />
            </RequireNavAccess>
          }
        />
        <Route
          path="/resume"
          element={
            <RequireNavAccess>
              <Resume />
            </RequireNavAccess>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireNavAccess>
              <Placeholder title="Projects" />
            </RequireNavAccess>
          }
        />
        <Route
          path="/activities"
          element={
            <RequireNavAccess>
              <Placeholder title="Activities" />
            </RequireNavAccess>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireNavAccess>
              <Placeholder title="Contact" />
            </RequireNavAccess>
          }
        />
      </Routes>
      <ScrollHint />
    </>
  )
}

export default App
