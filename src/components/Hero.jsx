import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import './Hero.css'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-greeting" variants={itemVariants}>
            Hi, I'm
          </motion.div>
          
          <motion.h1 className="hero-name" variants={itemVariants}>
            Muhammad Alif Ardiansyah
          </motion.h1>
          
          <motion.div className="hero-role" variants={itemVariants}>
            <span className="role-text">Full Stack Developer</span>
            <span className="role-separator">•</span>
            <span className="role-text">DevOps Engineer</span>
          </motion.div>
          
          <motion.p className="hero-description" variants={itemVariants}>
            Building scalable web applications and automating infrastructure
            with modern technologies and best practices.
          </motion.p>
          
          <motion.div className="hero-socials" variants={itemVariants}>
            <a href="mailto:alif@horn-yastudio.com" className="social-link email">
              <FaEnvelope />
            </a>
            <a href="https://github.com/Afdaan" target="_blank" rel="noopener noreferrer" className="social-link github">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/muhammad-alif-ardiansyah/" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
              <FaLinkedin />
            </a>
          </motion.div>
          
          <motion.div className="hero-cta" variants={itemVariants}>
            <button className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View My Work
            </button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Get In Touch
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-image"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="image-container">
            <div className="image-border"></div>
            <div className="image-glow"></div>
            <img src="/portfolioLogo.jpg" alt="Muhammad Alif Ardiansyah" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
