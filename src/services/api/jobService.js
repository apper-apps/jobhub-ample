import jobsData from '@/services/mockData/jobs.json'

// Simulated delay for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const jobService = {
  async getAll() {
    await delay(300)
    return [...jobsData]
  },

  async getById(id) {
    await delay(200)
    const job = jobsData.find(job => job.Id === id)
    if (!job) {
      throw new Error('Job not found')
    }
    return { ...job }
  },

  async searchJobs(searchParams = {}, filters = {}) {
    await delay(400)
    let results = [...jobsData]

    // Filter by search parameters
    if (searchParams.keywords) {
      const keywords = searchParams.keywords.toLowerCase()
      results = results.filter(job => 
        job.title.toLowerCase().includes(keywords) ||
        job.company.toLowerCase().includes(keywords) ||
        job.description.toLowerCase().includes(keywords)
      )
    }

    if (searchParams.location) {
      const location = searchParams.location.toLowerCase()
      results = results.filter(job => 
        job.location.toLowerCase().includes(location)
      )
    }

    // Apply filters
    if (filters.jobType?.length > 0) {
      results = results.filter(job => filters.jobType.includes(job.type))
    }

    if (filters.experienceLevel?.length > 0) {
      results = results.filter(job => filters.experienceLevel.includes(job.experienceLevel))
    }

    if (filters.salaryRange) {
      const { min, max } = filters.salaryRange
      results = results.filter(job => {
        if (!job.salary || (!job.salary.min && !job.salary.max)) return false
        const jobMin = job.salary.min || 0
        const jobMax = job.salary.max || Infinity
        
        if (min && max) {
          return jobMax >= min && jobMin <= max
        } else if (min) {
          return jobMax >= min
        } else if (max) {
          return jobMin <= max
        }
        return true
      })
    }

    if (filters.postedDate) {
      const daysAgo = parseInt(filters.postedDate)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
      
      results = results.filter(job => {
        const jobDate = new Date(job.postedDate)
        return jobDate >= cutoffDate
      })
    }

    if (filters.company) {
      const company = filters.company.toLowerCase()
      results = results.filter(job => 
        job.company.toLowerCase().includes(company)
      )
    }

    // Sort by posted date (newest first)
    results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

    return results
  },

  async getSimilarJobs(jobId) {
    await delay(200)
    const job = jobsData.find(j => j.Id === jobId)
    if (!job) return []

    // Find similar jobs based on title keywords and company
    const titleWords = job.title.toLowerCase().split(' ')
    const similar = jobsData
      .filter(j => j.Id !== jobId)
      .filter(j => {
        const matchesTitle = titleWords.some(word => 
          j.title.toLowerCase().includes(word) && word.length > 2
        )
        const matchesCompany = j.company === job.company
        return matchesTitle || matchesCompany
      })
      .slice(0, 5)

    return similar
  },

  async saveJob(job) {
    await delay(200)
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    const exists = savedJobs.find(saved => saved.Id === job.Id)
    
    if (!exists) {
      savedJobs.push({ ...job, savedAt: new Date().toISOString() })
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
    }
    
    return { ...job }
  },

  async unsaveJob(jobId) {
    await delay(200)
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    const filtered = savedJobs.filter(job => job.Id !== jobId)
    localStorage.setItem('savedJobs', JSON.stringify(filtered))
    return true
  },

  async getSavedJobs() {
    await delay(200)
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    return savedJobs
  },

  async create(jobData) {
    await delay(300)
    const jobs = [...jobsData]
    const maxId = Math.max(...jobs.map(job => job.Id), 0)
    const newJob = {
      ...jobData,
      Id: maxId + 1,
      postedDate: new Date().toISOString()
    }
    jobs.push(newJob)
    return { ...newJob }
  },

  async update(id, jobData) {
    await delay(300)
    const jobs = [...jobsData]
    const index = jobs.findIndex(job => job.Id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    jobs[index] = { ...jobs[index], ...jobData }
    return { ...jobs[index] }
  },

  async delete(id) {
    await delay(300)
    const jobs = [...jobsData]
    const index = jobs.findIndex(job => job.Id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
jobs.splice(index, 1)
    return true
  },

  async uploadJobs(csvFile, onProgress = () => {}) {
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

            // Process salary fields
            const salary = {}
            if (jobData.salarymin || jobData.salarymax) {
              salary.min = jobData.salarymin ? parseInt(jobData.salarymin) : null
              salary.max = jobData.salarymax ? parseInt(jobData.salarymax) : null
            }

            const processedJob = {
              title: jobData.title,
              company: jobData.company,
              location: jobData.location,
              type: jobData.type || 'Full-time',
              experienceLevel: jobData.experiencelevel || 'Mid Level',
              description: jobData.description || '',
              requirements: jobData.requirements || '',
              salary: Object.keys(salary).length > 0 ? salary : null
            }

            // Generate ID
            const existingJobs = [...jobsData, ...jobs]
            const maxId = Math.max(...existingJobs.map(job => job.Id), 0)
            processedJob.Id = maxId + jobs.length + 1
            processedJob.postedDate = new Date().toISOString()

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

          onProgress(100)
          resolve(jobs)
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