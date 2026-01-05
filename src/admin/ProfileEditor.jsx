import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

export default function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    description: '',
    email: '',
    location: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single()
      
      if (data) setProfile(data)
      if (error && error.code !== 'PGRST116') throw error
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      // If no id exists, this is a new profile - generate an id
      const profileData = profile.id 
        ? profile 
        : { ...profile, id: crypto.randomUUID() }
      
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
      
      if (error) throw error
      
      // Update local state with the id if it was new
      if (!profile.id) {
        setProfile(profileData)
      }
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner"></div>

  return (
    <div className="admin-section">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={profile.role || ''}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            placeholder="e.g., Full Stack Developer"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={profile.description || ''}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows="6"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
