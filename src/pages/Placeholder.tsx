import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import './Placeholder.css'

type PlaceholderProps = {
  title: string
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <>
      <NavBar />
      <ContactBar />
      <section className="placeholder">
        <h1>{title}</h1>
        <p>This page is on its way.</p>
      </section>
    </>
  )
}
