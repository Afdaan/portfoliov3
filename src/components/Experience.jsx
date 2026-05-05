import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Calendar, Building, Briefcase, Loader2, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      <section id="experience" className="min-h-screen py-24 flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="experience" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          {workExperiences.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-12">
                <Briefcase className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold tracking-tight">Work Experience</h3>
              </div>
              
              <div className="relative">
                {/* Central Timeline Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/50 to-transparent hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
                  {workExperiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`relative ${index % 2 === 1 ? 'md:mt-16' : ''}`}
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute top-10 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 hidden md:block ${
                        index % 2 === 0 ? '-right-[29.5px]' : '-left-[29.5px]'
                      }`}></div>
                      
                      {/* Horizontal Connector Line */}
                      <div className={`absolute top-[45px] h-px bg-border z-0 hidden md:block ${
                        index % 2 === 0 ? '-right-[24px] w-[24px]' : '-left-[24px] w-[24px]'
                      }`}></div>

                      <Card className="border-border bg-card shadow-none hover:border-primary/50 transition-colors h-full">
                        <CardHeader className="p-5 pb-3">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {formatDate(exp.start_date, exp.end_date)}
                            </span>
                            <div>
                              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{exp.role}</CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">{exp.company}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                          {exp.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                          )}
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {exp.technologies.map((tech, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] py-0 px-2 rounded-sm border-border/50 text-muted-foreground">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-12">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold tracking-tight">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="border-border bg-card shadow-none hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building className="w-4 h-4" />
                              <span>{edu.institution}</span>
                            </div>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {formatDate(edu.start_date, edu.end_date)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
