import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'

export default function ExperienceManager() {
  const [workExperiences, setWorkExperiences] = useState([])
  const [education, setEducation] = useState([])
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [showEduForm, setShowEduForm] = useState(false)
  const [editingWork, setEditingWork] = useState(null)
  const [editingEdu, setEditingEdu] = useState(null)
  const [deleteWorkId, setDeleteWorkId] = useState(null)
  const [deleteEduId, setDeleteEduId] = useState(null)

  const emptyWork = {
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    description: '',
    responsibilities: [],
    technologies: [],
    order_index: 0
  }

  const emptyEdu = {
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: '',
    order_index: 0
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [workRes, eduRes] = await Promise.all([
      supabase.from('work_experiences').select('*').order('order_index', { ascending: false }),
      supabase.from('education').select('*').order('order_index', { ascending: false })
    ])
    if (workRes.data) setWorkExperiences(workRes.data)
    if (eduRes.data) setEducation(eduRes.data)
  }

  async function saveWork(work) {
    try {
      // Convert empty end_date to null for current positions
      const workData = {
        ...work,
        end_date: work.end_date || null
      }
      
      const { error } = await supabase
        .from('work_experiences')
        .upsert(workData)
      if (error) throw error
      toast.success('Work experience saved!')
      fetchData()
      setShowWorkForm(false)
      setEditingWork(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  async function deleteWork() {
    if (!deleteWorkId) return
    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', deleteWorkId)
      if (error) throw error
      toast.success('Deleted!')
      fetchData()
      setDeleteWorkId(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  async function saveEducation(edu) {
    try {
      // Convert empty end_date to null
      const eduData = {
        ...edu,
        end_date: edu.end_date || null
      }
      
      const { error } = await supabase
        .from('education')
        .upsert(eduData)
      if (error) throw error
      toast.success('Education saved!')
      fetchData()
      setShowEduForm(false)
      setEditingEdu(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  async function deleteEducation() {
    if (!deleteEduId) return
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', deleteEduId)
      if (error) throw error
      toast.success('Deleted!')
      fetchData()
      setDeleteEduId(null)
    } catch (error) {
      toast.error('Error: ' + error.message)
    }
  }

  return (
    <div>
      <ConfirmModal 
        isOpen={!!deleteWorkId}
        onClose={() => setDeleteWorkId(null)}
        onConfirm={deleteWork}
        title="Delete Work Experience"
        message="Are you sure you want to delete this work experience?"
      />

      <ConfirmModal 
        isOpen={!!deleteEduId}
        onClose={() => setDeleteEduId(null)}
        onConfirm={deleteEducation}
        title="Delete Education"
        message="Are you sure you want to delete this education entry?"
      />

      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Work Experience</h3>
          <button className="btn btn-primary" onClick={() => { setEditingWork(emptyWork); setShowWorkForm(true) }}>
            Add New
          </button>
        </div>

        {showWorkForm && (
          <form onSubmit={(e) => { e.preventDefault(); saveWork(editingWork) }} className="admin-form" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--ctp-surface0)', borderRadius: 'var(--radius-md)' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input type="text" value={editingWork.company} onChange={(e) => setEditingWork({ ...editingWork, company: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={editingWork.role} onChange={(e) => setEditingWork({ ...editingWork, role: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={editingWork.start_date} onChange={(e) => setEditingWork({ ...editingWork, start_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date (leave empty if current)</label>
                <input type="date" value={editingWork.end_date || ''} onChange={(e) => setEditingWork({ ...editingWork, end_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={editingWork.description} onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })} rows="3" />
            </div>
            <div className="form-group">
              <label>Responsibilities (one per line)</label>
              <textarea 
                value={Array.isArray(editingWork.responsibilities) ? editingWork.responsibilities.join('\n') : ''} 
                onChange={(e) => setEditingWork({ ...editingWork, responsibilities: e.target.value.split('\n').filter(r => r.trim()) })} 
                rows="5"
                placeholder="Deployed and configured Linux server environments&#10;Utilized KVM for creating and managing virtual machines&#10;Configured web hosting environments for client websites"
              />
            </div>
            <div className="form-group">
              <label>Technologies Used (comma-separated)</label>
              <input 
                type="text" 
                value={Array.isArray(editingWork.technologies) ? editingWork.technologies.join(', ') : ''} 
                onChange={(e) => setEditingWork({ ...editingWork, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) })} 
                placeholder="Linux, KVM, cPanel, Email Hosting, Web Hosting"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowWorkForm(false); setEditingWork(null) }}>Cancel</button>
            </div>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workExperiences.map(work => (
              <tr key={work.id}>
                <td>{work.company}</td>
                <td>{work.role}</td>
                <td>{work.start_date} - {work.end_date || 'Present'}</td>
                <td className="admin-actions">
                  <button className="btn btn-secondary" onClick={() => { 
                    setEditingWork(work); 
                    setShowWorkForm(true);
                    // Small timeout to allow form to render
                    setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => setDeleteWorkId(work.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Education</h3>
          <button className="btn btn-primary" onClick={() => { setEditingEdu(emptyEdu); setShowEduForm(true) }}>
            Add New
          </button>
        </div>

        {showEduForm && (
          <form onSubmit={(e) => { e.preventDefault(); saveEducation(editingEdu) }} className="admin-form edu-form" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--ctp-surface0)', borderRadius: 'var(--radius-md)' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Institution</label>
                <input type="text" value={editingEdu.institution} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Degree</label>
                <input type="text" value={editingEdu.degree} onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Field of Study</label>
              <input type="text" value={editingEdu.field_of_study || ''} onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={editingEdu.start_date} onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={editingEdu.end_date || ''} onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={editingEdu.description || ''} onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })} rows="4" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowEduForm(false); setEditingEdu(null) }}>Cancel</button>
            </div>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Institution</th>
              <th>Degree</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {education.map(edu => (
              <tr key={edu.id}>
                <td>{edu.institution}</td>
                <td>{edu.degree}</td>
                <td>{edu.start_date} - {edu.end_date || 'Present'}</td>
                <td className="admin-actions">
                  <button className="btn btn-secondary" onClick={() => { 
                    setEditingEdu(edu); 
                    setShowEduForm(true);
                    // Small timeout to allow form to render
                    setTimeout(() => document.querySelector('.edu-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => setDeleteEduId(edu.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
