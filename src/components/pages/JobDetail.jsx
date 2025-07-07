import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { jobService } from '@/services/api/jobService'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])

  const loadJob = async () => {
    setLoading(true)
    setError('')
    try {
      const jobData = await jobService.getById(parseInt(id))
      setJob(jobData)
      
      // Check if job is saved
      const savedJobs = await jobService.getSavedJobs()
      setIsSaved(savedJobs.some(saved => saved.Id === parseInt(id)))
      
      // Load similar jobs
      const similar = await jobService.getSimilarJobs(parseInt(id))
      setSimilarJobs(similar)
    } catch (err) {
      setError('Failed to load job details. Please try again.')
      console.error('Error loading job:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJob()
  }, [id])

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await jobService.unsaveJob(parseInt(id))
        setIsSaved(false)
        toast.success('Job removed from saved jobs')
      } else {
        await jobService.saveJob(job)
        setIsSaved(true)
        toast.success('Job saved successfully')
      }
    } catch (err) {
      toast.error('Failed to save job')
      console.error('Error saving job:', err)
    }
  }

  const handleApply = () => {
    toast.success('Application submitted successfully!')
    // In a real app, this would redirect to the company's application page
  }

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not disclosed'
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    }
    return salary.min ? `$${salary.min.toLocaleString()}+` : `Up to $${salary.max.toLocaleString()}`
  }

  const getJobTypeBadge = (type) => {
    const variants = {
      'Full-time': 'success',
      'Part-time': 'warning',
      'Contract': 'primary',
      'Internship': 'secondary',
      'Freelance': 'accent'
    }
    return variants[type] || 'default'
  }

  const getExperienceBadge = (level) => {
    const variants = {
      'Entry Level': 'success',
      'Mid Level': 'warning',
      'Senior Level': 'primary',
      'Executive': 'secondary'
    }
    return variants[level] || 'outline'
  }

  const retryLoad = () => {
    loadJob()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <Card className="p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <h2 className="text-xl text-secondary font-semibold">{job.company}</h2>
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getJobTypeBadge(job.type)}>
                      {job.type}
                    </Badge>
                    <Badge variant={getExperienceBadge(job.experienceLevel)}>
                      {job.experienceLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-success">
                      {formatSalary(job.salary)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                      Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={handleApply} className="flex-1 sm:flex-none">
                  <ApperIcon name="Send" className="h-5 w-5 mr-2" />
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleSaveJob}
                  className="flex-1 sm:flex-none"
                >
                  <ApperIcon 
                    name={isSaved ? "Heart" : "Heart"} 
                    className={`h-5 w-5 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <ApperIcon name="CheckCircle" className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <ApperIcon name="Building2" className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{job.company}</p>
                    <p className="text-sm text-gray-600">Technology Company</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Users" className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">1,000-5,000 employees</p>
                    <p className="text-sm text-gray-600">Company Size</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Globe" className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Technology</p>
                    <p className="text-sm text-gray-600">Industry</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                <div className="space-y-4">
                  {similarJobs.slice(0, 3).map((similarJob) => (
                    <div key={similarJob.Id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <Link 
                        to={`/job/${similarJob.Id}`}
                        className="block hover:bg-gray-50 p-2 rounded -m-2 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 hover:text-primary transition-colors">
                          {similarJob.title}
                        </h4>
                        <p className="text-sm text-gray-600">{similarJob.company}</p>
                        <p className="text-sm text-gray-500">{similarJob.location}</p>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link to="/browse" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Jobs
                  </Button>
                </Link>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail