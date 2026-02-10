import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { useProjectStore } from '../store/projectStore'
import { User, Mail, CheckCircle2, XCircle } from 'lucide-react'

export default function JoinRequestModal({ projectId, onClose }) {
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [requests, setRequests] = useState([])
  const [reviewingId, setReviewingId] = useState(null)
  const { fetchProject, fetchJoinRequests, reviewJoinRequest, joinRequests } = useProjectStore()

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    Promise.all([
      fetchProject(projectId),
      fetchJoinRequests(projectId)
    ]).then(([proj]) => {
      setProject(proj)
      setLoading(false)
    })
  }, [projectId, fetchProject, fetchJoinRequests])

  useEffect(() => {
    if (joinRequests) {
      setRequests(joinRequests.filter(r => r.status === 'pending'))
    }
  }, [joinRequests])

  const handleReview = async (reqId, action) => {
    setReviewingId(reqId)
    await reviewJoinRequest(projectId, reqId, action)
    setReviewingId(null)
  }

  if (!projectId) return null

  return (
    <Modal isOpen={!!projectId} onClose={onClose} title="Join Request">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Project title */}
          {project && (
            <h3 className="font-display font-semibold text-text-primary dark:text-gray-100">
              {project.title}
            </h3>
          )}

          {/* Project lead card */}
          {project?.lead_name && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wide mb-2">
                Project Lead
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <User size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-text-primary dark:text-gray-100">{project.lead_name}</p>
                  {project.lead_email && (
                    <a
                      href={`mailto:${project.lead_email}`}
                      className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <Mail size={13} />
                      {project.lead_email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pending join requests */}
          {requests.length === 0 ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wide">
                Pending Requests
              </p>
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <User size={18} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-gray-100">{req.user_name || req.name}</p>
                      {(req.user_email || req.email) && (
                        <a
                          href={`mailto:${req.user_email || req.email}`}
                          className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <Mail size={13} />
                          {req.user_email || req.email}
                        </a>
                      )}
                    </div>
                  </div>
                  {req.message && (
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-3 italic">
                      &ldquo;{req.message}&rdquo;
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReview(req.id, 'reject')}
                      loading={reviewingId === req.id}
                    >
                      <XCircle size={14} />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReview(req.id, 'approve')}
                      loading={reviewingId === req.id}
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
