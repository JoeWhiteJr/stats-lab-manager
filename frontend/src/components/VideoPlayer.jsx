import { useState, useEffect } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

function getYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
  return match ? match[1] : null
}

function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

export default function VideoPlayer({ videoUrl, videoPath, videoFetchFn, className = '' }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Fetch video blob for uploaded files
  useEffect(() => {
    if (!videoFetchFn) return

    let cancelled = false
    setIsLoading(true)
    setLoadError(false)

    videoFetchFn()
      .then(({ data }) => {
        if (!cancelled) {
          setBlobUrl(URL.createObjectURL(data))
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [videoFetchFn])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl])

  // YouTube embed
  if (videoUrl) {
    const ytId = getYouTubeId(videoUrl)
    if (ytId) {
      return (
        <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )
    }

    // Vimeo embed
    const vimeoId = getVimeoId(videoUrl)
    if (vimeoId) {
      return (
        <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Video player"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )
    }

    // Generic external link
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors text-sm font-medium ${className}`}
      >
        <ExternalLink size={16} />
        Open Video Link
      </a>
    )
  }

  // Uploaded video file
  if (videoPath || videoFetchFn) {
    if (isLoading) {
      return (
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 ${className}`}>
          <Loader2 size={16} className="animate-spin" />
          Loading video...
        </div>
      )
    }

    if (loadError) {
      return (
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-red-500 dark:text-red-400 ${className}`}>
          Failed to load video
        </div>
      )
    }

    if (blobUrl) {
      return (
        <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
          <video
            src={blobUrl}
            controls
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )
    }
  }

  return null
}
