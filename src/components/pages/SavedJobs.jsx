import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import JobCard from '@/components/molecules/JobCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { jobService } from '@/services/api/jobService'

const SavedJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSavedJobs = async () => {
    setLoading(true)
    setError('')
    try {
      const savedJobs = await jobService.getSavedJobs()
      setJobs(savedJobs)
    } catch (err) {
      setError('Failed to load saved jobs. Please try again.')
      console.error('Error loading saved jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const handleUnsaveJob = async (job) => {
    try {
      await jobService.unsaveJob(job.Id)
      setJobs(prev => prev.filter(j => j.Id !== job.Id))
      toast.success('Job removed from saved jobs')
    } catch (err) {
      toast.error('Failed to remove job')
      console.error('Error removing job:', err)
    }
  }

  const retryLoad = () => {
    loadSavedJobs()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          title="No saved jobs yet"
          description="Start saving jobs you're interested in to keep track of opportunities."
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/browse'}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
        <p className="text-gray-600">
          You have {jobs.length} saved {jobs.length === 1 ? 'job' : 'jobs'}
        </p>
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
              onSave={handleUnsaveJob}
              isSaved={true}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SavedJobs