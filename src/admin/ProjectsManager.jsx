import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'
import imageCompression from 'browser-image-compression'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

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
    <div className="admin-section space-y-6">
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Projects</h3>
        <Button onClick={() => { setEditing(emptyProject); setShowForm(true) }}>
          Add New
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveProject(editing) }} className="admin-form space-y-5 mb-8 p-6 bg-card border border-border rounded-lg">
          <div className="form-group space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
          </div>
          
          <div className="form-group space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows="4" required />
          </div>

          <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </Select>
            </div>
            <div className="form-group flex items-center gap-2 pt-8">
              <Checkbox id="featured" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <Label htmlFor="featured" className="cursor-pointer">Featured Project</Label>
            </div>
          </div>

          <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group space-y-2">
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input id="demo_url" type="url" value={editing.demo_url || ''} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" type="url" value={editing.github_url || ''} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="form-group space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input 
              id="tech_stack"
              type="text" 
              value={editing.tech_stack} 
              onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value })} 
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          <div className="form-group space-y-2">
            <Label>Image URLs (comma-separated)</Label>
            <div className="mb-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                style={{ cursor: uploading ? 'wait' : 'pointer' }}
                asChild
              >
                <label>
                  {uploading ? 'Compressing & Uploading...' : 'Upload Image'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    disabled={uploading}
                  />
                </label>
              </Button>
            </div>
            <Input 
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
                      className="w-full h-full object-cover rounded border border-border"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditing(null) }}>Cancel</Button>
          </div>
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.featured ? '⭐' : '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { 
                    setEditing({
                      ...project,
                      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack,
                      image_urls: Array.isArray(project.image_urls) ? project.image_urls.join(', ') : project.image_urls,
                    }); 
                    setShowForm(true);
                    // Small timeout to allow form to render
                    setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(project.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
