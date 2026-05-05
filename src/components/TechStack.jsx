import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import * as SiIcons from 'react-icons/si'
import * as FaIcons from 'react-icons/fa'
import * as VscIcons from 'react-icons/vsc'
import * as DiIcons from 'react-icons/di'
import * as BsIcons from 'react-icons/bs'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function TechStack() {
  const [techStack, setTechStack] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTechStack()
  }, [])

  async function fetchTechStack() {
    try {
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (error) throw error
      setTechStack(data || [])
    } catch (error) {
      console.error('Error fetching tech stack:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupByCategory = (stack) => {
    return stack.reduce((acc, tech) => {
      const category = tech.category || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(tech)
      return acc
    }, {})
  }

  const getIcon = (iconName) => {
    if (!iconName) return null
    const Icon = SiIcons[iconName] || FaIcons[iconName] || VscIcons[iconName] || DiIcons[iconName] || BsIcons[iconName]
    return Icon ? <Icon className="w-6 h-6 md:w-7 md:h-7" /> : null
  }
  
  const renderIcon = (input) => {
    if (!input) return <span className="text-xl">⚡</span>
    
    const iconComponent = getIcon(input)
    if (iconComponent) return iconComponent
    
    if (input.includes('/') || input.includes('.')) {
      return <img src={input} alt="Tech" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
    }
    
    return <span className="text-xl">⚡</span>
  }

  if (loading) {
    return (
      <section id="skills" className="min-h-screen py-24 flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    )
  }

  const groupedTech = groupByCategory(techStack)
  const categoryOrder = ['Programming Languages', 'Frontend', 'Backend', 'Databases', 'DevOps', 'Tools', 'Cloud', 'Others']
  
  const sortedCategories = Object.entries(groupedTech).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a[0])
    const indexB = categoryOrder.indexOf(b[0])
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    return a[0].localeCompare(b[0])
  })

  return (
    <section id="skills" className="py-24 bg-background relative border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Skills & Technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive list of tools and technologies I use to bring ideas to life.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-6"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {sortedCategories.map(([category, techs]) => (
            <div key={category} className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap">{category}</h3>
                <div className="h-px bg-border/50 w-full"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {techs.map((tech, index) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Card className="border-border bg-card shadow-none hover:border-primary/50 transition-all duration-300 group cursor-default rounded-2xl">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="text-primary transition-colors duration-300 shrink-0">
                          {renderIcon(tech.icon_url)}
                        </div>
                        <span className="font-medium text-sm text-foreground transition-colors">
                          {tech.name}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
