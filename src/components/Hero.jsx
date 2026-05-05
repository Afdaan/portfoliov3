import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <motion.div 
            className="flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-primary/20 text-primary bg-primary/5">
                Available for new opportunities
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]"
              variants={itemVariants}
            >
              Muhammad Alif <br />
              <span className="text-primary">Ardiansyah</span>
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-medium text-muted-foreground mb-8"
              variants={itemVariants}
            >
              <span>Full Stack Developer</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>DevOps Engineer</span>
            </motion.div>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Building scalable web applications and automating infrastructure
              with modern technologies and best practices. Based in Jakarta, Indonesia.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap items-center gap-4 mb-12"
              variants={itemVariants}
            >
              <Button size="lg" className="px-8 font-bold" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-bold" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Get In Touch
              </Button>
            </motion.div>

            <motion.div className="flex items-center gap-6" variants={itemVariants}>
              <a href="https://github.com/Afdaan" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                <FaGithub className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/in/muhammad-alif-ardiansyah/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                <FaLinkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:muh.alif.ardiansyah24@gmail.com" className="text-foreground hover:text-primary transition-colors">
                <Mail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Profile Image */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              {/* Dynamic Blob Decorations */}
              <motion.div 
                className="absolute -inset-6 bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl opacity-60"
                animate={{
                  borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Main Image Container with Blob Shape */}
              <motion.div 
                className="relative w-64 h-64 sm:w-80 sm:h-80 overflow-hidden border-2 border-primary/20 bg-card shadow-2xl z-10"
                animate={{
                  borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 60% 70% 40% / 50% 60% 30% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="/portfolioLogo.jpg" 
                  alt="Muhammad Alif Ardiansyah" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
              
              {/* Floating Rings */}
              <motion.div 
                className="absolute inset-0 border border-primary/40 z-0 pointer-events-none"
                animate={{
                  borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
