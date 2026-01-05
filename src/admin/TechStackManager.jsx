import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'

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
    <div className="admin-section">
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteTech}
        title="Delete Technology"
        message="Are you sure you want to delete this technology? This action cannot be undone."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Tech Stack</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(emptyTech); setShowForm(true) }}>
          Add New
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveTech(editing) }} className="admin-form" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--ctp-surface0)', borderRadius: 'var(--radius-md)' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Icon (react-icons name like "SiReact" or URL)</label>
              <input type="text" value={editing.icon_url} onChange={(e) => setEditing({ ...editing, icon_url: e.target.value })} placeholder="SiReact or https://..." />
            </div>
            <div className="form-group">
              <label>Proficiency (1-5)</label>
              <input type="number" min="1" max="5" value={editing.proficiency} onChange={(e) => setEditing({ ...editing, proficiency: parseInt(e.target.value) })} />
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
            <th>Name</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {techStack.map(tech => (
            <tr key={tech.id}>
              <td>{tech.name}</td>
              <td>{tech.category}</td>
              <td>{tech.proficiency}/5</td>
              <td className="admin-actions">
                <button className="btn btn-secondary" onClick={() => { 
                  setEditing(tech); 
                  setShowForm(true);
                  // Small timeout to allow form to render
                  setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}>Edit</button>
                <button className="btn btn-secondary" onClick={() => setDeleteId(tech.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
