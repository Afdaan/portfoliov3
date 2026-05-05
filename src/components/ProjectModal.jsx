import React from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const getStatusVariant = (status) => {
  const s = status?.toLowerCase() || 'completed'
  if (s === 'completed' || s === 'complete') return 'default'
  if (s === 'in progress' || s === 'ongoing') return 'secondary'
  if (s === 'planning' || s === 'planned') return 'outline'
  return 'outline'
}

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border/50 shadow-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <DialogTitle className="text-2xl md:text-3xl font-bold">{project.title}</DialogTitle>
            <Badge variant={getStatusVariant(project.status)} className="whitespace-nowrap mt-1">
              {project.status || 'Completed'}
            </Badge>
          </div>
          <DialogDescription className="sr-only">
            Details for project {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-8">
          {project.image_urls && project.image_urls.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-border/50">
              <img 
                src={project.image_urls[0]} 
                alt={project.title} 
                className="w-full h-auto object-cover max-h-[400px]"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3 border-b border-border/50 pb-2">About Project</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 border-b border-border/50 pb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-sm px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
              {project.github_url && (
                <Button asChild variant="outline" className="flex-1 sm:flex-none">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="w-4 h-4 mr-2" /> View Code
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button asChild className="flex-1 sm:flex-none">
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt className="w-4 h-4 mr-2" /> Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
