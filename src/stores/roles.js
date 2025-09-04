import { defineStore } from 'pinia'
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '@/js/api'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [],
    loading: false,
    error: null
  }),

  getters: {
    getRoleById: (state) => (id) => {
      return state.roles.find(role => role.id === parseInt(id))
    },
    
    getRolesWithUsers: (state) => {
      return state.roles.filter(role => role.count_users > 0)
    },
    
    getEmptyRoles: (state) => {
      return state.roles.filter(role => role.count_users === 0)
    },
    
    totalRoles: (state) => state.roles.length,
    
    totalUsersInRoles: (state) => {
      return state.roles.reduce((total, role) => {
        return total + role.count_users
      }, 0)
    }
  },

  actions: {
    async fetchRoles() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getRoles()
        this.roles = response.data || []
      } catch (error) {
        console.error('Error fetching roles:', error)
        this.error = error.message || 'Gagal mengambil data roles'
        
        // Fallback ke data dummy jika API error
        this.roles = [
          {
            id: 1,
            name: 'Manager',
            count_users: 1
          },
          {
            id: 2,
            name: 'Keeper',
            count_users: 0
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async addRole(roleData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await createRole(roleData)
        const newRole = response.data || response
        
        // Add to local state
        this.roles.push(newRole)
        return newRole
      } catch (error) {
        console.error('Error creating role:', error)
        this.error = error.message || 'Gagal membuat role'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRole(id, roleData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await updateRole(id, roleData)
        const updatedRole = response.data || response
        
        // Update local state
        const index = this.roles.findIndex(role => role.id === parseInt(id))
        if (index !== -1) {
          this.roles[index] = updatedRole
        }
        
        return updatedRole
      } catch (error) {
        console.error('Error updating role:', error)
        this.error = error.message || 'Gagal mengupdate role'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRole(id) {
      this.loading = true
      this.error = null
      
      try {
        await deleteRole(id)
        
        // Remove from local state
        const index = this.roles.findIndex(role => role.id === parseInt(id))
        if (index !== -1) {
          this.roles.splice(index, 1)
        }
        
        return true
      } catch (error) {
        console.error('Error deleting role:', error)
        this.error = error.message || 'Gagal menghapus role'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
