import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import * as SiIcons from 'react-icons/si'
import * as FaIcons from 'react-icons/fa'
import * as VscIcons from 'react-icons/vsc'
import * as DiIcons from 'react-icons/di'
import * as BsIcons from 'react-icons/bs'
import './TechStack.css'

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
    // Check all icon libraries
    const Icon = SiIcons[iconName] || FaIcons[iconName] || VscIcons[iconName] || DiIcons[iconName] || BsIcons[iconName]
    return Icon ? <Icon /> : null
  }
  
  const renderIcon = (input) => {
    if (!input) return <span>⚡</span>
    
    // Try to get react icon first
    const iconComponent = getIcon(input)
    if (iconComponent) return iconComponent
    
    // If no icon found and it looks like a URL, render image
    if (input.includes('/') || input.includes('.')) {
      return <img src={input} alt="Tech" />
    }
    
    // Fallback
    return <span>⚡</span>
  }

  if (loading) {
    return (
      <section id="skills" className="section">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </section>
    )
  }

  const groupedTech = groupByCategory(techStack)

  // Define custom order for categories
  const categoryOrder = ['Programming Languages', 'Frontend', 'Backend', 'Databases', 'DevOps', 'Tools', 'Cloud', 'Others']
  
  // Sort categories based on predefined order
  const sortedCategories = Object.entries(groupedTech).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a[0])
    const indexB = categoryOrder.indexOf(b[0])
    
    // If both categories are in the list, sort by index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    
    // If one is in the list, prioritize it
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // If neither is in the list, sort alphabetically
    return a[0].localeCompare(b[0])
  })

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Skills & Technologies</h2>

        {sortedCategories.map(([category, techs], catIndex) => (
          <div key={category} className="tech-category">
            <h3 className="category-title">{category}</h3>
            <div className="tech-grid grid grid-4">
              {techs.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  className="tech-card glass-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="tech-icon">
                    {renderIcon(tech.icon_url)}
                  </div>
                  <div className="tech-name">{tech.name}</div>
                  {tech.proficiency && (
                    <div className="proficiency-bar">
                      <div 
                        className="proficiency-fill" 
                        style={{ width: `${(tech.proficiency / 5) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
