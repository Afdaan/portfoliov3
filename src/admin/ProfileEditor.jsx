import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

  if (loading) return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>

  return (
    <div className="admin-section space-y-6">
      <h3 className="text-xl font-bold tracking-tight text-foreground">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="admin-form space-y-5">
        <div className="form-group space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div className="form-group space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            type="text"
            value={profile.role || ''}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            placeholder="e.g., Full Stack Developer"
          />
        </div>

        <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="form-group space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={profile.description || ''}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows={6}
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full md:w-auto">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  )
}

