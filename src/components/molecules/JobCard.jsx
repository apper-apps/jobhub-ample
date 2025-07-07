import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const JobCard = ({ job, onSave, isSaved = false }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="p-6 border-l-4 border-l-primary hover:border-l-accent transition-all duration-200">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link 
                to={`/job/${job.Id}`}
                className="block group"
              >
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {job.title}
                </h3>
              </Link>
              <p className="text-lg text-secondary font-medium mt-1">{job.company}</p>
              <div className="flex items-center text-gray-600 mt-2">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.location}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(job)}
              className="flex-shrink-0"
            >
              <ApperIcon 
                name={isSaved ? "Heart" : "Heart"} 
                className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={getJobTypeBadge(job.type)}>
              {job.type}
            </Badge>
            <Badge variant={getExperienceBadge(job.experienceLevel)}>
              {job.experienceLevel}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-success">
              {formatSalary(job.salary)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
              {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>

          <div className="flex items-center justify-between pt-2">
            <Link to={`/job/${job.Id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button size="sm">
              <ApperIcon name="ExternalLink" className="h-4 w-4 mr-1" />
              Apply Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default JobCard