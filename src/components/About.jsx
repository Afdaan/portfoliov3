import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { FaBriefcase, FaRocket, FaBolt, FaBuilding } from 'react-icons/fa'
import './About.css'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState([
    { label: 'Years Experience', value: '0+', icon: <FaBriefcase /> },
    { label: 'Projects Completed', value: '0+', icon: <FaRocket /> },
    { label: 'Technologies', value: '0+', icon: <FaBolt /> },
    { label: 'Companies', value: '0+', icon: <FaBuilding /> }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch profile, work experiences, projects, and tech stack
      const [profileRes, workRes, projectsRes, techRes] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('work_experiences').select('start_date, end_date, company'),
        supabase.from('projects').select('id'),
        supabase.from('tech_stack').select('id')
      ])
      
      if (profileRes.data) setProfile(profileRes.data)
      
      // Calculate years of experience
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
      
      // Count unique companies
      const uniqueCompanies = workRes.data ? new Set(workRes.data.map(exp => exp.company)).size : 0
      
      // Count projects and technologies
      const projectsCount = projectsRes.data?.length || 0
      const techCount = techRes.data?.length || 0
      
      // Update stats
      setStats([
        { label: 'Years Experience', value: `${years+1}+`, icon: <FaBriefcase /> },
        { label: 'Projects Completed', value: `${projectsCount}+`, icon: <FaRocket /> },
        { label: 'Technologies', value: `${techCount}+`, icon: <FaBolt /> },
        { label: 'Companies', value: `${uniqueCompanies}+`, icon: <FaBuilding /> }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const attributes = [
    { title: 'Problem Solving', description: 'Analytical approach to complex challenges' },
    { title: 'Team Leadership', description: 'Collaborative and mentoring mindset' },
    { title: 'Fast Learner', description: 'Quick adaptation to new technologies' },
    { title: 'Detail-Oriented', description: 'Attention to code quality and best practices' }
  ]

  // Animated counter component
  const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    
    useEffect(() => {
      if (!hasAnimated) return
      
      const numericValue = parseInt(value.replace(/\D/g, ''))
      const increment = numericValue / (duration / 16)
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }, [hasAnimated, value, duration])
    
    return (
      <motion.div
        className="stat-value"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onViewportEnter={() => setHasAnimated(true)}
      >
        {count}+
      </motion.div>
    )
  }

  if (loading) {
    return (
      <section id="about" className="section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          
          <div className="about-content">
            <p className="about-description">
              {profile?.description || "Passionate Full Stack Developer and DevOps Engineer with expertise in building scalable web applications and automating infrastructure. I love creating efficient solutions and learning new technologies."}
            </p>
          </div>

          <div className="stats-grid grid grid-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(203, 166, 247, 0.3)"
                }}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <AnimatedCounter value={stat.value} />
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="attributes-section">
            <h3>What I Bring to the Table</h3>
            <div className="attributes-grid grid grid-2">
              {attributes.map((attr, index) => (
                <motion.div
                  key={index}
                  className="attribute-card glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    x: 10,
                    boxShadow: "0 10px 30px rgba(137, 180, 250, 0.3)"
                  }}
                >
                  <h4>{attr.title}</h4>
                  <p>{attr.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
