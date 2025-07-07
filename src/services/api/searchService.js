import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = 'saved_search'

export const searchService = {
  async getSavedSearches() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "keywords" } },
          { field: { Name: "location" } },
          { field: { Name: "job_type" } },
          { field: { Name: "experience_level" } },
          { field: { Name: "salary_range" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "company" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching saved searches:', error)
      // Fallback to localStorage for backward compatibility
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      return savedSearches
    }
  },

  async saveSearch(searchData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const createData = {
        Name: searchData.savedName || searchData.Name || 'Unnamed Search',
        keywords: searchData.keywords || '',
        location: searchData.location || '',
        job_type: Array.isArray(searchData.jobType) ? searchData.jobType.join(',') : (searchData.job_type || ''),
        experience_level: Array.isArray(searchData.experienceLevel) ? searchData.experienceLevel.join(',') : (searchData.experience_level || ''),
        salary_range: searchData.salaryRange ? 
                     (typeof searchData.salaryRange === 'object' ? 
                      `${searchData.salaryRange.min || ''}-${searchData.salaryRange.max || ''}` : 
                      searchData.salaryRange) : 
                     (searchData.salary_range || ''),
        posted_date: searchData.postedDate || searchData.posted_date || '',
        company: searchData.company || '',
        created_at: new Date().toISOString(),
        Tags: searchData.Tags || ''
      }

      const params = {
        records: [createData]
      }

      const response = await apperClient.createRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }

        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }

      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error saving search:', error)
      throw error
    }
  },

  async deleteSavedSearch(searchId) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [searchId]
      }

      const response = await apperClient.deleteRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords.length > 0
      }

      return false
    } catch (error) {
      console.error('Error deleting saved search:', error)
      throw error
    }
  },

  async updateSavedSearch(searchId, searchData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const updateData = {
        Id: searchId,
        Name: searchData.savedName || searchData.Name || 'Unnamed Search',
        keywords: searchData.keywords || '',
        location: searchData.location || '',
        job_type: Array.isArray(searchData.jobType) ? searchData.jobType.join(',') : (searchData.job_type || ''),
        experience_level: Array.isArray(searchData.experienceLevel) ? searchData.experienceLevel.join(',') : (searchData.experience_level || ''),
        salary_range: searchData.salaryRange ? 
                     (typeof searchData.salaryRange === 'object' ? 
                      `${searchData.salaryRange.min || ''}-${searchData.salaryRange.max || ''}` : 
                      searchData.salaryRange) : 
                     (searchData.salary_range || ''),
        posted_date: searchData.postedDate || searchData.posted_date || '',
        company: searchData.company || '',
        Tags: searchData.Tags || ''
      }

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }

        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }

      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating saved search:', error)
      throw error
    }
  }
}