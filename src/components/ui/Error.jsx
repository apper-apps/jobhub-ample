import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = 'Something went wrong', onRetry }) => {
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
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="AlertCircle" className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="space-y-3">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                Try Again
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
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If the problem persists, please contact our support team.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Error