import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = 'job'

export const jobService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "salary" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "experience_level" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "posted_date", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 50, offset: 0 }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "salary" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "experience_level" } },
          { field: { Name: "Tags" } }
        ]
      }

      const response = await apperClient.getRecordById(tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error)
      throw error
    }
  },

  async searchJobs(searchParams = {}, filters = {}) {
    try {
      const apperClient = getApperClient()
      const whereConditions = []
      const whereGroups = []

      // Search parameters
      if (searchParams.keywords) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title", operator: "Contains", values: [searchParams.keywords], include: true }
              ],
              operator: "OR"
            },
            {
              conditions: [
                { fieldName: "company", operator: "Contains", values: [searchParams.keywords], include: true }
              ],
              operator: "OR"
            },
            {
              conditions: [
                { fieldName: "description", operator: "Contains", values: [searchParams.keywords], include: true }
              ],
              operator: "OR"
            }
          ]
        })
      }

      if (searchParams.location) {
        whereConditions.push({
          fieldName: "location",
          Operator: "Contains",
          Values: [searchParams.location],
          Include: true
        })
      }

      // Apply filters
      if (filters.jobType?.length > 0) {
        whereConditions.push({
          fieldName: "type",
          Operator: "ExactMatch",
          Values: filters.jobType,
          Include: true
        })
      }

      if (filters.experienceLevel?.length > 0) {
        whereConditions.push({
          fieldName: "experience_level",
          Operator: "ExactMatch",
          Values: filters.experienceLevel,
          Include: true
        })
      }

      if (filters.postedDate) {
        const daysAgo = parseInt(filters.postedDate)
        whereConditions.push({
          fieldName: "posted_date",
          Operator: "RelativeMatch",
          Values: [`last ${daysAgo} days`],
          Include: true
        })
      }

      if (filters.company) {
        whereConditions.push({
          fieldName: "company",
          Operator: "Contains",
          Values: [filters.company],
          Include: true
        })
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "salary" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "posted_date" } },
          { field: { Name: "experience_level" } },
          { field: { Name: "Tags" } }
        ],
        where: whereConditions,
        whereGroups: whereGroups,
        orderBy: [
          { fieldName: "posted_date", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 50, offset: 0 }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error searching jobs:', error)
      throw error
    }
  },

  async getSimilarJobs(jobId) {
    try {
      const job = await this.getById(jobId)
      if (!job) return []

      const apperClient = getApperClient()
      const whereConditions = [
        {
          fieldName: "Id",
          Operator: "NotEqualTo",
          Values: [jobId],
          Include: true
        }
      ]

      const whereGroups = []
      if (job.title) {
        const titleWords = job.title.toLowerCase().split(' ').filter(word => word.length > 2)
        if (titleWords.length > 0) {
          whereGroups.push({
            operator: "OR",
            subGroups: titleWords.map(word => ({
              conditions: [
                { fieldName: "title", operator: "Contains", values: [word], include: true }
              ],
              operator: "OR"
            }))
          })
        }
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "salary" } },
          { field: { Name: "type" } },
          { field: { Name: "experience_level" } }
        ],
        where: whereConditions,
        whereGroups: whereGroups,
        orderBy: [
          { fieldName: "posted_date", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 5, offset: 0 }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching similar jobs:', error)
      return []
    }
  },

  async saveJob(job) {
    try {
      // For now, use localStorage for saved jobs as they're user-specific
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
      const exists = savedJobs.find(saved => saved.Id === job.Id)
      
      if (!exists) {
        savedJobs.push({ ...job, savedAt: new Date().toISOString() })
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
      }
      
      return { ...job }
    } catch (error) {
      console.error('Error saving job:', error)
      throw error
    }
  },

  async unsaveJob(jobId) {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
      const filtered = savedJobs.filter(job => job.Id !== jobId)
      localStorage.setItem('savedJobs', JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Error unsaving job:', error)
      throw error
    }
  },

  async getSavedJobs() {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
      return savedJobs
    } catch (error) {
      console.error('Error getting saved jobs:', error)
      return []
    }
  },

  async create(jobData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const createData = {
        Name: jobData.title || jobData.Name,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: Array.isArray(jobData.requirements) ? jobData.requirements.join('\n') : jobData.requirements,
        posted_date: new Date().toISOString(),
        experience_level: jobData.experienceLevel || jobData.experience_level,
        salary: jobData.salary && typeof jobData.salary === 'object' ? 
               `${jobData.salary.min || ''}-${jobData.salary.max || ''}` : 
               jobData.salary,
        Tags: jobData.Tags || ''
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
      console.error('Error creating job:', error)
      throw error
    }
  },

  async update(id, jobData) {
    try {
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const updateData = {
        Id: id,
        Name: jobData.title || jobData.Name,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: Array.isArray(jobData.requirements) ? jobData.requirements.join('\n') : jobData.requirements,
        experience_level: jobData.experienceLevel || jobData.experience_level,
        salary: jobData.salary && typeof jobData.salary === 'object' ? 
               `${jobData.salary.min || ''}-${jobData.salary.max || ''}` : 
               jobData.salary,
        Tags: jobData.Tags || ''
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
      console.error('Error updating job:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [id]
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
      console.error('Error deleting job:', error)
      throw error
    }
  },

  async uploadJobs(csvFile, onProgress = () => {}) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    await delay(500)
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const csvText = e.target.result
          const lines = csvText.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            reject(new Error('CSV file must contain header and at least one job'))
            return
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
          const requiredHeaders = ['title', 'company', 'location']
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`))
            return
          }

          const jobs = []
          const totalJobs = lines.length - 1

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
            
            if (values.length !== headers.length) {
              console.warn(`Skipping line ${i + 1}: column count mismatch`)
              continue
            }

            const jobData = {}
            headers.forEach((header, index) => {
              jobData[header] = values[index]
            })

            // Validate required fields
            if (!jobData.title || !jobData.company || !jobData.location) {
              console.warn(`Skipping line ${i + 1}: missing required fields`)
              continue
            }

            const processedJob = {
              title: jobData.title,
              company: jobData.company,
              location: jobData.location,
              type: jobData.type || 'Full-time',
              experienceLevel: jobData.experiencelevel || 'Mid Level',
              description: jobData.description || '',
              requirements: jobData.requirements || '',
              salary: jobData.salarymin || jobData.salarymax ? 
                     { min: parseInt(jobData.salarymin) || null, max: parseInt(jobData.salarymax) || null } : 
                     null
            }

            jobs.push(processedJob)

            // Update progress
            const progress = Math.round((i / totalJobs) * 100)
            onProgress(progress)
            
            // Simulate processing delay
            await delay(50)
          }

          if (jobs.length === 0) {
            reject(new Error('No valid jobs found in CSV file'))
            return
          }

          // Create jobs in database
          const createdJobs = []
          for (const job of jobs) {
            try {
              const created = await this.create(job)
              createdJobs.push(created)
            } catch (error) {
              console.warn('Failed to create job:', job.title, error)
            }
          }

          onProgress(100)
          resolve(createdJobs)
        } catch (error) {
          reject(new Error('Failed to parse CSV file. Please check the format.'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(csvFile)
    })
  }
}