import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [profile, setProfile] = useState({
    email: 'muh.alif.ardiansyah24@gmail.com',
    location: 'Jakarta, Indonesia'
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, location')
        .single()
      
      if (data) {
        setProfile({
          email: data.email || 'muh.alif.ardiansyah24@gmail.com',
          location: data.location || 'Jakarta, Indonesia'
        })
      }
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Get In Touch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${profile.email}`} className="hover:text-foreground transition-colors">{profile.email}</a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="icon" asChild className="rounded-full border-border">
                  <a href="https://github.com/Afdaan" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full border-border">
                  <a href="https://linkedin.com/in/muhammad-alif-ardiansyah/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Card className="border-border bg-card shadow-none">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full font-bold uppercase tracking-widest text-[10px]">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
