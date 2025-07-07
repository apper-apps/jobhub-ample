import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import JobCard from '@/components/molecules/JobCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { jobService } from '@/services/api/jobService'

const JobListing = ({ filters = {}, searchParams = {} }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [savedJobs, setSavedJobs] = useState([])
  const jobsPerPage = 10

  const loadJobs = async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const allJobs = await jobService.searchJobs(searchParams, filters)
      const startIndex = (page - 1) * jobsPerPage
      const endIndex = startIndex + jobsPerPage
      const paginatedJobs = allJobs.slice(startIndex, endIndex)
      
      setJobs(paginatedJobs)
      setTotalPages(Math.ceil(allJobs.length / jobsPerPage))
      setCurrentPage(page)
    } catch (err) {
      setError('Failed to load jobs. Please try again.')
      console.error('Error loading jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSavedJobs = async () => {
    try {
      const saved = await jobService.getSavedJobs()
      setSavedJobs(saved.map(job => job.Id))
    } catch (err) {
      console.error('Error loading saved jobs:', err)
    }
  }

  useEffect(() => {
    loadJobs()
    loadSavedJobs()
  }, [searchParams, filters])

  const handleSaveJob = async (job) => {
    try {
      if (savedJobs.includes(job.Id)) {
        await jobService.unsaveJob(job.Id)
        setSavedJobs(prev => prev.filter(id => id !== job.Id))
        toast.success('Job removed from saved jobs')
      } else {
        await jobService.saveJob(job)
        setSavedJobs(prev => [...prev, job.Id])
        toast.success('Job saved successfully')
      }
    } catch (err) {
      toast.error('Failed to save job')
      console.error('Error saving job:', err)
    }
  }

  const handlePageChange = (page) => {
    loadJobs(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retryLoad = () => {
    loadJobs(currentPage)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }

  if (jobs.length === 0) {
    return (
      <Empty
        title="No jobs found"
        description="Try adjusting your search criteria or filters to find more results."
        actionLabel="Clear Filters"
        onAction={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {jobs.length} Jobs Found
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <JobCard
              job={job}
              onSave={handleSaveJob}
              isSaved={savedJobs.includes(job.Id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + Math.max(1, currentPage - 2)
            if (page > totalPages) return null
            
            return (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            )
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ApperIcon name="ChevronRight" className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default JobListing