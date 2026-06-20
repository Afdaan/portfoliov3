import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

export default function TechStackManager() {
  const [techStack, setTechStack] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const emptyTech = {
    name: '',
    category: 'Frontend',
    icon_url: '',
    proficiency: 3,
    order_index: 0
  }

  const categories = ['Programming Languages', 'Frontend', 'Backend', 'DevOps', 'Databases', 'Tools', 'Others']

  useEffect(() => {
    fetchTechStack()
  }, [])

  async function fetchTechStack() {
    const { data } = await supabase
      .from('tech_stack')
      .select('*')
      .order('order_index', { ascending: true })
    if (data) setTechStack(data)
  }

  async function saveTech(tech) {
    try {
      const { error } = await supabase
        .from('tech_stack')
        .upsert(tech)
      if (error) throw error
      toast.success('Technology saved!')
      fetchTechStack()
      setShowForm(false)
      setEditing(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  async function deleteTech() {
    if (!deleteId) return
    try {
      const { error } = await supabase
        .from('tech_stack')
        .delete()
        .eq('id', deleteId)
      if (error) throw error
      toast.success('Deleted!')
      fetchTechStack()
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
        onConfirm={deleteTech}
        title="Delete Technology"
        message="Are you sure you want to delete this technology? This action cannot be undone."
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Tech Stack</h3>
        <Button onClick={() => { setEditing(emptyTech); setShowForm(true) }}>
          Add New
        </Button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveTech(editing) }} className="admin-form space-y-5 mb-8 p-6 bg-card border border-border rounded-lg">
          <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group space-y-2">
              <Label htmlFor="tech_name">Name</Label>
              <Input id="tech_name" type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="tech_category">Category</Label>
              <Select id="tech_category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </div>
          </div>
          <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group space-y-2">
              <Label htmlFor="tech_icon">Icon (react-icons name like "SiReact" or URL)</Label>
              <Input id="tech_icon" type="text" value={editing.icon_url} onChange={(e) => setEditing({ ...editing, icon_url: e.target.value })} placeholder="SiReact or https://..." />
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="tech_proficiency">Proficiency (1-5)</Label>
              <Input id="tech_proficiency" type="number" min="1" max="5" value={editing.proficiency} onChange={(e) => setEditing({ ...editing, proficiency: parseInt(e.target.value) })} />
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
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {techStack.map(tech => (
            <TableRow key={tech.id}>
              <TableCell className="font-medium">{tech.name}</TableCell>
              <TableCell>{tech.category}</TableCell>
              <TableCell>{tech.proficiency}/5</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { 
                    setEditing(tech); 
                    setShowForm(true);
                    // Small timeout to allow form to render
                    setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(tech.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
