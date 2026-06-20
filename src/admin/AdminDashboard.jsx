import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import ProfileEditor from './ProfileEditor'
import ExperienceManager from './ExperienceManager'
import TechStackManager from './TechStackManager'
import ProjectsManager from './ProjectsManager'
import { Button } from '@/components/ui/button'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h2>Portfolio Admin</h2>
          <Button onClick={handleLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
        <div className="admin-nav-links">
          <NavLink to="/admin" end className="admin-nav-link">Profile</NavLink>
          <NavLink to="/admin/experience" className="admin-nav-link">Experience & Education</NavLink>
          <NavLink to="/admin/tech-stack" className="admin-nav-link">Tech Stack</NavLink>
          <NavLink to="/admin/projects" className="admin-nav-link">Projects</NavLink>
        </div>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route index element={<ProfileEditor />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="tech-stack" element={<TechStackManager />} />
          <Route path="projects" element={<ProjectsManager />} />
        </Routes>
      </div>
    </div>
  )
}
