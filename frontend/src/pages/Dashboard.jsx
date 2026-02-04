import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useProjectStore } from '../store/projectStore'
import ProjectCard from '../components/ProjectCard'
import { FolderKanban, CheckSquare, Clock, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { projects, fetchProjects, isLoading } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const activeProjects = projects.filter((p) => p.status === 'active')
  const completedProjects = projects.filter((p) => p.status === 'completed')

  const totalTasks = projects.reduce((sum, p) => sum + (p.total_actions || 0), 0)
  const completedTasks = projects.reduce((sum, p) => sum + (p.completed_actions || 0), 0)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-text-secondary">Here's what's happening with your research.</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View all projects
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-100">
              <FolderKanban size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">{activeProjects.length}</p>
              <p className="text-sm text-text-secondary">Active projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-secondary-100">
              <CheckSquare size={20} className="text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">
                {completedTasks}/{totalTasks}
              </p>
              <p className="text-sm text-text-secondary">Tasks completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent-100">
              <Clock size={20} className="text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">{completedProjects.length}</p>
              <p className="text-sm text-text-secondary">Completed projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active projects */}
      <section>
        <h2 className="font-display font-semibold text-lg text-text-primary mb-4">Active Projects</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse">
                <div className="h-32 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FolderKanban size={28} className="text-gray-400" />
            </div>
            <h3 className="font-medium text-text-primary">No active projects</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Get started by creating your first research project.
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Go to Projects
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* Completed projects */}
      {completedProjects.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">Recently Completed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {completedProjects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 transition-colors"
              >
                <div className="h-24 bg-gradient-to-br from-green-100 to-secondary-100" />
                <div className="p-4">
                  <h3 className="font-medium text-text-primary line-clamp-1">{project.title}</h3>
                  <p className="mt-1 text-xs text-text-secondary">
                    Completed with {project.total_actions || 0} tasks
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
