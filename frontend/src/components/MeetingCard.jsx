import { Mic, FileText, Sparkles, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function MeetingCard({ meeting, onView, onDelete }) {
  const hasAudio = !!meeting.audio_path
  const hasTranscript = !!meeting.transcript
  const hasSummary = !!meeting.summary

  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${hasAudio ? 'bg-secondary-100 text-secondary-600' : 'bg-gray-100 text-gray-400'}`}>
            <Mic size={20} />
          </div>
          <div>
            <h4
              className="font-medium text-text-primary cursor-pointer hover:text-primary-600"
              onClick={() => onView(meeting)}
            >
              {meeting.title}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
              {meeting.recorded_at && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {format(new Date(meeting.recorded_at), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(meeting.id)}
          className="p-1.5 rounded text-text-secondary hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Status badges */}
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
          hasTranscript ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <FileText size={12} />
          {hasTranscript ? 'Transcribed' : 'No transcript'}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
          hasSummary ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <Sparkles size={12} />
          {hasSummary ? 'Summarized' : 'No summary'}
        </span>
      </div>

      {/* Summary preview */}
      {hasSummary && (
        <p className="mt-3 text-sm text-text-secondary line-clamp-2">
          {meeting.summary}
        </p>
      )}
    </div>
  )
}
