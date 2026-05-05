import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Briefcase, Rocket, Zap, Building2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState([
    { label: 'Years Experience', value: '0+', icon: <Briefcase className="w-6 h-6" /> },
    { label: 'Projects Completed', value: '0+', icon: <Rocket className="w-6 h-6" /> },
    { label: 'Technologies', value: '0+', icon: <Zap className="w-6 h-6" /> },
    { label: 'Companies', value: '0+', icon: <Building2 className="w-6 h-6" /> }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [profileRes, workRes, projectsRes, techRes] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('work_experiences').select('start_date, end_date, company'),
        supabase.from('projects').select('id'),
        supabase.from('tech_stack').select('id')
      ])
      
      if (profileRes.data) setProfile(profileRes.data)
      
      let totalMonths = 0
      if (workRes.data && workRes.data.length > 0) {
        workRes.data.forEach(exp => {
          const start = new Date(exp.start_date)
          const end = exp.end_date ? new Date(exp.end_date) : new Date()
          const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
          totalMonths += months
        })
      }
      const years = Math.floor(totalMonths / 12)
      
      const uniqueCompanies = workRes.data ? new Set(workRes.data.map(exp => exp.company)).size : 0
      const projectsCount = projectsRes.data?.length || 0
      const techCount = techRes.data?.length || 0
      
      setStats([
        { label: 'Years Experience', value: `${years+1}+`, icon: <Briefcase className="w-6 h-6" /> },
        { label: 'Projects Completed', value: `${projectsCount}+`, icon: <Rocket className="w-6 h-6" /> },
        { label: 'Technologies', value: `${techCount}+`, icon: <Zap className="w-6 h-6" /> },
        { label: 'Companies', value: `${uniqueCompanies}+`, icon: <Building2 className="w-6 h-6" /> }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="min-h-screen py-24 flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="about" className="py-24 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-border bg-card shadow-none text-center">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="mb-2 text-primary opacity-80">{stat.icon}</div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                I am a passionate <span className="text-foreground font-medium">Full Stack Developer</span> and 
                <span className="text-foreground font-medium"> DevOps Engineer</span> based in Jakarta, Indonesia. 
                My journey in software development began with a curiosity for building things that live on the internet.
              </p>
              <p>
                With a background in both development and operations, I specialize in creating robust, scalable applications 
                while ensuring seamless deployment and infrastructure management. I love solving complex problems 
                and optimizing performance across the entire stack.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                or sharing my knowledge with the developer community.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
