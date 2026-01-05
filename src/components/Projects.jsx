import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import ProjectModal from './ProjectModal.jsx'
import './Projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: false })
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : 'completed'
    switch (normalizedStatus) {
      case 'completed':
      case 'complete':
        return 'status-completed'
      case 'in progress':
      case 'ongoing':
        return 'status-in-progress'
      case 'planning':
      case 'planned':
        return 'status-planning'
      default:
        return 'status-default'
    }
  }

  if (loading) {
    return (
      <section id="projects" className="section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>

        <div className="projects-grid grid grid-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
            >
              {project.image_urls && project.image_urls.length > 0 && (
                <div className="project-image">
                  <img src={project.image_urls[0]} alt={project.title} loading="lazy" />
                  {project.featured && <div className="featured-badge">⭐ Featured</div>}
                </div>
              )}
              
              <div className="project-content">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span 
                    className={`project-status ${getStatusClass(project.status)}`}
                  >
                    {project.status || 'Completed'}
                  </span>
                </div>

                <p className="project-description">{project.description}</p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="project-tech">
                    {project.tech_stack.map((tech, i) => (
                      <span key={i} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                )}

                <div className="project-links">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub /> Code
                    </a>
                  )}
                  {project.demo_url && (
                    <a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            key={selectedProject.id}
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}
