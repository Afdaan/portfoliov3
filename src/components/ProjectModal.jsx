import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'
import './ProjectModal.css'

const getStatusClass = (status) => {
  const s = status?.toLowerCase() || 'completed'
  if (s === 'completed' || s === 'complete') return 'status-completed'
  if (s === 'in progress' || s === 'ongoing') return 'status-in-progress'
  if (s === 'planning' || s === 'planned') return 'status-planning'
  return 'status-default'
}

export default function ProjectModal({ project, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow || 'unset'
      }
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!project) return null

  const statusClass = getStatusClass(project.status)

  return (
    <motion.div 
      className="project-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="project-modal-container glass-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="project-modal-close" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>

        <div className="project-modal-scroll">
          <div className="project-modal-header">
            <div className="project-modal-title-row">
              <h2>{project.title}</h2>
              <span className={`project-status ${statusClass}`}>
                {project.status || 'Completed'}
              </span>
            </div>
          </div>

          <div className="project-modal-body">
            {project.image_urls && project.image_urls.length > 0 && (
              <div className="project-modal-gallery">
                <img 
                  src={project.image_urls[0]} 
                  alt={project.title} 
                  className="project-modal-image"
                />
              </div>
            )}

            <div className="project-modal-info">
              <div className="project-modal-description">
                <h3>About Project</h3>
                <p>{project.description}</p>
              </div>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="project-modal-tech">
                  <h3>Tech Stack</h3>
                  <div className="tech-tags">
                    {project.tech_stack.map((tech, i) => (
                      <span key={i} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-modal-actions">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-modal-btn github">
                    <FaGithub /> View Code
                  </a>
                )}
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-modal-btn demo">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
