import { create } from 'zustand'
import { vvcApi } from '../services/api'

export const useVvcStore = create((set, get) => ({
  sessions: [],
  resources: {},
  projects: [],
  isLoading: false,

  fetchSessions: async () => {
    set({ isLoading: true })
    try {
      const { data } = await vvcApi.list()
      set({ sessions: data.sessions })
    } catch (error) {
      console.error('Failed to fetch VVC sessions:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  createSession: async (sessionData) => {
    const { data } = await vvcApi.create(sessionData)
    await get().fetchSessions()
    return data.session
  },

  updateSession: async (id, sessionData) => {
    const { data } = await vvcApi.update(id, sessionData)
    await get().fetchSessions()
    return data.session
  },

  deleteSession: async (id) => {
    await vvcApi.delete(id)
    await get().fetchSessions()
  },

  uploadVideo: async (id, videoFile, onProgress) => {
    const { data } = await vvcApi.uploadVideo(id, videoFile, onProgress)
    await get().fetchSessions()
    return data.session
  },

  uploadImages: async (id, files) => {
    const { data } = await vvcApi.uploadImages(id, files)
    await get().fetchSessions()
    return data.session
  },

  deleteImage: async (sessionId, imageId) => {
    await vvcApi.deleteImage(sessionId, imageId)
    await get().fetchSessions()
  },

  fetchResources: async () => {
    try {
      const { data } = await vvcApi.getResources()
      set({ resources: data.resources })
    } catch (error) {
      console.error('Failed to fetch VVC resources:', error)
    }
  },

  updateResource: async (key, value) => {
    await vvcApi.updateResource(key, value)
    await get().fetchResources()
  },

  fetchProjects: async () => {
    try {
      const { data } = await vvcApi.listProjects()
      set({ projects: data.projects })
    } catch (error) {
      console.error('Failed to fetch VVC projects:', error)
    }
  },

  createProject: async (projectData) => {
    const { data } = await vvcApi.createProject(projectData)
    await get().fetchProjects()
    return data.project
  },

  updateProject: async (id, projectData) => {
    const { data } = await vvcApi.updateProject(id, projectData)
    await get().fetchProjects()
    return data.project
  },

  deleteProject: async (id) => {
    await vvcApi.deleteProject(id)
    await get().fetchProjects()
  },

  uploadScreenshot: async (id, file) => {
    const { data } = await vvcApi.uploadScreenshot(id, file)
    await get().fetchProjects()
    return data.project
  },
}))
