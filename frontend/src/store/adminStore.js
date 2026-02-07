import { create } from 'zustand'
import { adminApi, aiApi } from '../services/api'

export const useAdminStore = create((set) => ({
  stats: null,
  recentApplications: [],
  auditLog: [],
  auditLogTotal: 0,
  searchResults: [],
  applicationTrends: [],
  isLoading: false,
  error: null,
  aiSummary: null,
  aiSummaryLoading: false,
  aiSummaryError: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await adminApi.getStats()
      set({
        stats: data.stats,
        recentApplications: data.recentApplications,
        isLoading: false
      })
    } catch (error) {
      set({ error: error.response?.data?.error?.message || 'Failed to fetch admin stats', isLoading: false })
    }
  },

  fetchAuditLog: async ({ limit, offset, action, entity_type } = {}) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await adminApi.getAuditLog({ limit, offset, action, entity_type })
      set({
        auditLog: data.auditLog,
        auditLogTotal: data.total,
        isLoading: false
      })
    } catch (error) {
      set({ error: error.response?.data?.error?.message || 'Failed to fetch audit log', isLoading: false })
    }
  },

  searchUsers: async (q, role) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await adminApi.searchUsers(q, role)
      set({ searchResults: data.users, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error?.message || 'Failed to search users', isLoading: false })
    }
  },

  fetchApplicationTrends: async () => {
    try {
      const { data } = await adminApi.getApplicationTrends()
      set({ applicationTrends: data.trends })
    } catch (error) {
      set({ error: error.response?.data?.error?.message || 'Failed to fetch trends' })
    }
  },

  fetchAiSummary: async (dateRange = 'week') => {
    set({ aiSummaryLoading: true, aiSummaryError: null })
    try {
      const { data } = await aiApi.adminSummary(dateRange)
      set({ aiSummary: data, aiSummaryLoading: false })
      return data
    } catch (error) {
      set({
        aiSummaryError: error.response?.data?.error?.message || 'Failed to generate AI summary',
        aiSummaryLoading: false
      })
      return null
    }
  },

  clearAiSummary: () => set({ aiSummary: null, aiSummaryError: null }),

  clearError: () => set({ error: null })
}))
