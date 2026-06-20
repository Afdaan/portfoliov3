import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

import ConfirmModal from '../components/ConfirmModal'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

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
    responsibilities: '',
    technologies: '',
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
        end_date: work.end_date || null,
        responsibilities: typeof work.responsibilities === 'string' ? work.responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : work.responsibilities,
        technologies: typeof work.technologies === 'string' ? work.technologies.split(',').map(t => t.trim()).filter(Boolean) : work.technologies
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

      <div className="admin-section space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Work Experience</h3>
          <Button onClick={() => { setEditingWork(emptyWork); setShowWorkForm(true) }}>
            Add New
          </Button>
        </div>

        {showWorkForm && (
          <form onSubmit={(e) => { e.preventDefault(); saveWork(editingWork) }} className="admin-form space-y-5 mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" type="text" value={editingWork.company} onChange={(e) => setEditingWork({ ...editingWork, company: e.target.value })} required />
              </div>
              <div className="form-group space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" type="text" value={editingWork.role} onChange={(e) => setEditingWork({ ...editingWork, role: e.target.value })} required />
              </div>
            </div>
            <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group space-y-2">
                <Label htmlFor="work_start">Start Date</Label>
                <Input id="work_start" type="date" value={editingWork.start_date} onChange={(e) => setEditingWork({ ...editingWork, start_date: e.target.value })} required />
              </div>
              <div className="form-group space-y-2">
                <Label htmlFor="work_end">End Date (leave empty if current)</Label>
                <Input id="work_end" type="date" value={editingWork.end_date || ''} onChange={(e) => setEditingWork({ ...editingWork, end_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="work_description">Description</Label>
              <Textarea id="work_description" value={editingWork.description} onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })} rows="3" />
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="work_responsibilities">Responsibilities (one per line)</Label>
              <Textarea 
                id="work_responsibilities"
                value={editingWork.responsibilities || ''} 
                onChange={(e) => setEditingWork({ ...editingWork, responsibilities: e.target.value })} 
                rows="5"
                placeholder="Deployed and configured Linux server environments&#10;Utilized KVM for creating and managing virtual machines&#10;Configured web hosting environments for client websites"
              />
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="work_technologies">Technologies Used (comma-separated)</Label>
              <Input 
                id="work_technologies"
                type="text" 
                value={editingWork.technologies || ''} 
                onChange={(e) => setEditingWork({ ...editingWork, technologies: e.target.value })} 
                placeholder="Linux, KVM, cPanel, Email Hosting, Web Hosting"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowWorkForm(false); setEditingWork(null) }}>Cancel</Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workExperiences.map(work => (
              <TableRow key={work.id}>
                <TableCell className="font-medium">{work.company}</TableCell>
                <TableCell>{work.role}</TableCell>
                <TableCell>{work.start_date} - {work.end_date || 'Present'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { 
                      setEditingWork({
                        ...work,
                        responsibilities: Array.isArray(work.responsibilities) ? work.responsibilities.join('\n') : work.responsibilities,
                        technologies: Array.isArray(work.technologies) ? work.technologies.join(', ') : work.technologies
                      }); 
                      setShowWorkForm(true);
                      // Small timeout to allow form to render
                      setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteWorkId(work.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="admin-section space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Education</h3>
          <Button onClick={() => { setEditingEdu(emptyEdu); setShowEduForm(true) }}>
            Add New
          </Button>
        </div>

        {showEduForm && (
          <form onSubmit={(e) => { e.preventDefault(); saveEducation(editingEdu) }} className="admin-form edu-form space-y-5 mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" type="text" value={editingEdu.institution} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} required />
              </div>
              <div className="form-group space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input id="degree" type="text" value={editingEdu.degree} onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })} required />
              </div>
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input id="field_of_study" type="text" value={editingEdu.field_of_study || ''} onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })} />
            </div>
            <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group space-y-2">
                <Label htmlFor="edu_start">Start Date</Label>
                <Input id="edu_start" type="date" value={editingEdu.start_date} onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })} required />
              </div>
              <div className="form-group space-y-2">
                <Label htmlFor="edu_end">End Date</Label>
                <Input id="edu_end" type="date" value={editingEdu.end_date || ''} onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group space-y-2">
              <Label htmlFor="edu_description">Description</Label>
              <Textarea id="edu_description" value={editingEdu.description || ''} onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })} rows="4" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowEduForm(false); setEditingEdu(null) }}>Cancel</Button>
            </div>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {education.map(edu => (
              <TableRow key={edu.id}>
                <TableCell className="font-medium">{edu.institution}</TableCell>
                <TableCell>{edu.degree}</TableCell>
                <TableCell>{edu.start_date} - {edu.end_date || 'Present'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { 
                      setEditingEdu(edu); 
                      setShowEduForm(true);
                      // Small timeout to allow form to render
                      setTimeout(() => document.querySelector('.edu-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteEduId(edu.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
