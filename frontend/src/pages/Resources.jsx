import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { resourcesApi, usersApi } from '../services/api'
import { getUploadUrl } from '../services/api'
import Button from '../components/Button'
import RichTextEditor, { RichTextContent } from '../components/RichTextEditor'
import {
  Mail, BookOpen, Users, GraduationCap, Pencil, Plus, Trash2, ExternalLink, Loader2
} from 'lucide-react'
import { toast } from '../store/toastStore'

function LinkListEditor({ items, onSave, saving }) {
  const [list, setList] = useState(items || [])
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState({ title: '', url: '', description: '' })

  useEffect(() => { setList(items || []) }, [items])

  const openAdd = () => {
    setEditIndex(-1)
    setForm({ title: '', url: '', description: '' })
  }

  const openEdit = (i) => {
    setEditIndex(i)
    setForm(list[i])
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.url.trim()) return
    let next
    if (editIndex === -1) {
      next = [...list, form]
    } else {
      next = list.map((item, i) => i === editIndex ? form : item)
    }
    setList(next)
    setEditIndex(null)
    onSave(next)
  }

  const handleDelete = (i) => {
    const next = list.filter((_, idx) => idx !== i)
    setList(next)
    onSave(next)
  }

  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex-1 min-w-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              {item.title}
              <ExternalLink size={12} />
            </a>
            {item.description && (
              <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{item.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => openEdit(i)} className="p-1 rounded text-gray-400 hover:text-primary-600 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => handleDelete(i)} className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {editIndex !== null ? (
        <div className="p-3 border border-primary-200 dark:border-primary-800 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <input
            type="url"
            placeholder="URL"
            value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditIndex(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>Save</Button>
          </div>
        </div>
      ) : (
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <Plus size={14} />
          Add link
        </button>
      )}
    </div>
  )
}

export default function Resources() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const [loading, setLoading] = useState(true)
  const [contactInfo, setContactInfo] = useState('')
  const [researchLinks, setResearchLinks] = useState([])
  const [learningLinks, setLearningLinks] = useState([])
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)

  // Edit states
  const [editingContact, setEditingContact] = useState(false)
  const [contactDraft, setContactDraft] = useState('')
  const [savingContact, setSavingContact] = useState(false)
  const [savingLinks, setSavingLinks] = useState(false)

  useEffect(() => {
    document.title = 'Resources - Stats Lab'
  }, [])

  // Fetch resources content
  useEffect(() => {
    resourcesApi.getContent()
      .then(({ data }) => {
        const c = data.content || {}
        if (c.contact_info) setContactInfo(c.contact_info)
        if (c.research_links) {
          try {
            const parsed = typeof c.research_links === 'string' ? JSON.parse(c.research_links) : c.research_links
            setResearchLinks(Array.isArray(parsed) ? parsed : [])
          } catch { setResearchLinks([]) }
        }
        if (c.learning_links) {
          try {
            const parsed = typeof c.learning_links === 'string' ? JSON.parse(c.learning_links) : c.learning_links
            setLearningLinks(Array.isArray(parsed) ? parsed : [])
          } catch { setLearningLinks([]) }
        }
      })
      .catch(() => toast.error('Failed to load resources'))
      .finally(() => setLoading(false))
  }, [])

  // Fetch members
  useEffect(() => {
    usersApi.team()
      .then(({ data }) => setMembers(data.users || []))
      .catch(() => {})
      .finally(() => setLoadingMembers(false))
  }, [])

  const handleSaveContact = async () => {
    setSavingContact(true)
    try {
      await resourcesApi.updateContent('contact_info', contactDraft)
      setContactInfo(contactDraft)
      setEditingContact(false)
      toast.success('Contact info updated')
    } catch {
      toast.error('Failed to update contact info')
    } finally {
      setSavingContact(false)
    }
  }

  const handleSaveResearchLinks = async (links) => {
    setSavingLinks(true)
    try {
      await resourcesApi.updateContent('research_links', links)
      setResearchLinks(links)
      toast.success('Research links updated')
    } catch {
      toast.error('Failed to save links')
    } finally {
      setSavingLinks(false)
    }
  }

  const handleSaveLearningLinks = async (links) => {
    setSavingLinks(true)
    try {
      await resourcesApi.updateContent('learning_links', links)
      setLearningLinks(links)
      toast.success('Learning links updated')
    } catch {
      toast.error('Failed to save links')
    } finally {
      setSavingLinks(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary dark:text-gray-100">Resources</h1>
        <p className="text-text-secondary dark:text-gray-400 mt-1">Reference materials, contacts, and learning resources for the lab.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-primary-600 dark:text-primary-400" />
              <h2 className="font-display font-bold text-lg text-text-primary dark:text-gray-100">Contact Info</h2>
            </div>
            {isAdmin && !editingContact && (
              <Button variant="ghost" size="sm" onClick={() => { setContactDraft(contactInfo); setEditingContact(true) }}>
                <Pencil size={14} />
                Edit
              </Button>
            )}
          </div>
          {editingContact ? (
            <div className="space-y-3">
              <RichTextEditor
                value={contactDraft}
                onChange={setContactDraft}
                placeholder="Enter contact information..."
                minHeight="120px"
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditingContact(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveContact} loading={savingContact}>Save</Button>
              </div>
            </div>
          ) : (
            contactInfo ? (
              <RichTextContent content={contactInfo} className="text-text-secondary dark:text-gray-300" />
            ) : (
              <p className="text-sm text-text-secondary dark:text-gray-400">No contact info added yet.</p>
            )
          )}
        </section>

        {/* Research Resources */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-display font-bold text-lg text-text-primary dark:text-gray-100">Research Resources</h2>
          </div>
          {isAdmin ? (
            <LinkListEditor items={researchLinks} onSave={handleSaveResearchLinks} saving={savingLinks} />
          ) : researchLinks.length > 0 ? (
            <div className="space-y-2">
              {researchLinks.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                  >
                    {item.title}
                    <ExternalLink size={12} />
                  </a>
                  {item.description && (
                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary dark:text-gray-400">No research resources added yet.</p>
          )}
        </section>

        {/* Member Directory */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-display font-bold text-lg text-text-primary dark:text-gray-100">Member Directory</h2>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400 text-xs font-medium">
              {members.length}
            </span>
          </div>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-primary-500" />
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {members.map(m => (
                <div key={m.id} className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden mb-2">
                    {m.avatar_url ? (
                      <img src={getUploadUrl(m.avatar_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-700 dark:text-primary-300 font-medium text-lg">
                        {m.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-sm text-text-primary dark:text-gray-100 line-clamp-1">{m.name}</p>
                  <p className="text-xs text-text-secondary dark:text-gray-400 capitalize">{m.role?.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary dark:text-gray-400">No members found.</p>
          )}
        </section>

        {/* Stats Learning */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-display font-bold text-lg text-text-primary dark:text-gray-100">Stats Learning</h2>
          </div>
          {isAdmin ? (
            <LinkListEditor items={learningLinks} onSave={handleSaveLearningLinks} saving={savingLinks} />
          ) : learningLinks.length > 0 ? (
            <div className="space-y-2">
              {learningLinks.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                  >
                    {item.title}
                    <ExternalLink size={12} />
                  </a>
                  {item.description && (
                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary dark:text-gray-400">No learning resources added yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
