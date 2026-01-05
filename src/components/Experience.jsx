import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import './Experience.css'

export default function Experience() {
  const [workExperiences, setWorkExperiences] = useState([])
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [workRes, eduRes] = await Promise.all([
        supabase.from('work_experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('education').select('*').order('order_index', { ascending: false })
      ])

      if (workRes.data) setWorkExperiences(workRes.data)
      if (eduRes.data) setEducation(eduRes.data)
    } catch (error) {
      console.error('Error fetching experience data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const end = endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
    return `${start} - ${end}`
  }

  if (loading) {
    return (
      <section id="experience" className="section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Experience & Education</h2>

        {workExperiences.length > 0 && (
          <div className="experience-category">
            <h3 className="category-title">Work Experience</h3>
            <div className="experience-grid">
              {workExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="experience-card glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">{exp.role}</h4>
                      <span className="experience-company">{exp.company}</span>
                    </div>
                    <div className="experience-date">{formatDate(exp.start_date, exp.end_date)}</div>
                  </div>
                  
                  {exp.description && (
                    <p className="experience-description">{exp.description}</p>
                  )}
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="responsibilities-section">
                      <h5>Key Responsibilities:</h5>
                      <ul className="responsibilities-list">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="technologies-section">
                      <h5>Technologies Used:</h5>
                      <div className="tech-badges">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="tech-badge">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="experience-category">
            <h3 className="category-title">Education</h3>
            <div className="timeline">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="timeline-content glass-card">
                    <div className="timeline-header">
                      <h4>{edu.degree}</h4>
                      <span className="company">{edu.institution}</span>
                    </div>
                    <div className="timeline-date">{formatDate(edu.start_date, edu.end_date)}</div>
                    {edu.field_of_study && <p className="field-of-study">{edu.field_of_study}</p>}
                    {edu.description && <p className="timeline-description">{edu.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
