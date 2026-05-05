import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Loader2, Rocket } from 'lucide-react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ProjectModal from './ProjectModal.jsx'

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

  if (loading) {
    return (
      <section id="projects" className="min-h-screen py-24 flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Rocket className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <Card 
                  className="h-full flex flex-col border-border bg-card shadow-none hover:border-primary/50 transition-all duration-300 rounded-[2rem] overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.image_urls && project.image_urls.length > 0 && (
                    <div className="relative aspect-video overflow-hidden border-b border-border">
                      <img 
                        src={project.image_urls[0]} 
                        alt={project.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      {project.featured && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] py-0 px-2 rounded-sm border-none">
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 flex-1">
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tech_stack.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0 px-2 rounded-sm border-border text-muted-foreground">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-5 pt-4 border-t border-border/50 flex gap-3">
                    {project.github_url && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[10px] font-bold uppercase tracking-wider"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(project.github_url, '_blank')
                        }}
                      >
                        <FaGithub className="w-3.5 h-3.5 mr-2" /> Code
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(project.demo_url, '_blank')
                        }}
                      >
                        <FaExternalLinkAlt className="w-3.5 h-3.5 mr-2" /> Live
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
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
