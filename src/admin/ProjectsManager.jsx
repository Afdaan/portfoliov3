import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'

import imageCompression from 'browser-image-compression'

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const emptyProject = {
    title: '',
    description: '',
    tech_stack: '',
    status: 'Completed',
    demo_url: '',
    github_url: '',
    image_urls: '',
    featured: false,
    order_index: 0
  }

  const statuses = ['Completed', 'In Progress', 'Planning']

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: false })
    if (data) setProjects(data)
  }

  async function saveProject(project) {
    try {
      // Parse strings back to arrays for storage
      const projectToSave = {
        ...project,
        tech_stack: typeof project.tech_stack === 'string' ? project.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : project.tech_stack,
        image_urls: typeof project.image_urls === 'string' ? project.image_urls.split(',').map(u => u.trim()).filter(Boolean) : project.image_urls
      }

      const { error } = await supabase
        .from('projects')
        .upsert(projectToSave)
      if (error) throw error
      toast.success('Project saved!')
      fetchProjects()
      setShowForm(false)
      setEditing(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      
      const compressedFile = await imageCompression(file, options)
      
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, compressedFile)

      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName)

      const currentImages = editing.image_urls || ''
      const newImages = currentImages ? `${currentImages}, ${publicUrl}` : publicUrl
      
      setEditing({ ...editing, image_urls: newImages })
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // ... (deleteProject and ConfirmModal render)

  async function deleteProject() {
    if (!deleteId) return
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId)
      if (error) throw error
      toast.success('Deleted!')
      fetchProjects()
      setDeleteId(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  return (
    <div className="admin-section">
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Projects</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(emptyProject); setShowForm(true) }}>
          Add New
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveProject(editing) }} className="admin-form" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--ctp-surface0)', borderRadius: 'var(--radius-md)' }}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows="4" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Featured</label>
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} style={{ width: 'auto', marginTop: '0.5rem' }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Demo URL</label>
              <input type="url" value={editing.demo_url || ''} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="url" value={editing.github_url || ''} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="form-group">
            <label>Tech Stack (comma-separated)</label>
            <input 
              type="text" 
              value={editing.tech_stack} 
              onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value })} 
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          <div className="form-group">
            <label>Image URLs (comma-separated)</label>
            <div style={{ marginBottom: '1rem' }}>
              <label className="btn btn-secondary" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-block' }}>
                {uploading ? 'Compressing & Uploading...' : 'Upload Image'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading}
                />
              </label>
            </div>
            <input 
              type="text" 
              value={editing.image_urls} 
              onChange={(e) => setEditing({ ...editing, image_urls: e.target.value })} 
              placeholder="https://image1.jpg, https://image2.jpg"
            />
            
            {/* Image Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {editing.image_urls && editing.image_urls.split(',').map((url, index) => {
                const trimmedUrl = url.trim()
                if (!trimmedUrl) return null
                return (
                  <div key={index} style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img 
                      src={trimmedUrl} 
                      alt={`Preview ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--ctp-surface1)' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.status}</td>
              <td>{project.featured ? '⭐' : '-'}</td>
              <td className="admin-actions">
                <button className="btn btn-secondary" onClick={() => { 
                  setEditing({
                    ...project,
                    tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack,
                    image_urls: Array.isArray(project.image_urls) ? project.image_urls.join(', ') : project.image_urls,
                  }); 
                  setShowForm(true);
                  // Small timeout to allow form to render
                  setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}>Edit</button>
                <button className="btn btn-secondary" onClick={() => setDeleteId(project.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
