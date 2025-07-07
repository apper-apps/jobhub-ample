import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No results found', 
  description = 'Try adjusting your search criteria or filters.',
  actionLabel = 'Start Over',
  onAction,
  icon = 'Search'
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name={icon} className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
          
          <div className="space-y-3">
            {onAction && (
              <Button onClick={onAction} className="w-full">
                <ApperIcon name="ArrowRight" className="h-4 w-4 mr-2" />
                {actionLabel}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <ApperIcon name="Briefcase" className="h-4 w-4 mr-1" />
                10,000+ Jobs
              </span>
              <span className="flex items-center">
                <ApperIcon name="Building2" className="h-4 w-4 mr-1" />
                2,500+ Companies
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Empty