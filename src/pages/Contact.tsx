import { useState } from 'react'
import type { FormEvent } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { EMAIL } from '../data/site'
import './Contact.css'

type ContactForm = {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY_FORM: ContactForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM)

  function update<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // No backend on this site — submitting hands the message off to the
  // visitor's own email client instead, pre-filled and ready to send.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = `From: ${form.name} (${form.email})\n\n${form.message}`
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <>
      <NavBar />
      <ContactBar />

      <section className="contact contact--intro">
        <header className="contact-head">
          <p className="contact-eyebrow">Contact</p>
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-lede">
            Have a question or want to work together? Fill out the form below — it'll open in
            your email app, addressed and ready to send.
          </p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-row">
            <label className="contact-field">
              <span>Name</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="contact-field">
            <span>Subject</span>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => update('subject', e.target.value)}
              placeholder="What's this about?"
            />
          </label>

          <label className="contact-field">
            <span>Message</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Write your message..."
            />
          </label>

          <button type="submit" className="contact-submit">
            Send Message
          </button>
        </form>
      </section>
    </>
  )
}
