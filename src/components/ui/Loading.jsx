import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'

const Loading = () => {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }

  const SkeletonCard = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 border-l-4 border-l-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.div
              className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div
              className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 mb-2"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        <div className="flex space-x-2 mb-4">
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </div>
        
        <div className="space-y-2 mb-4">
          <motion.div
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/5"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </Card>
    </motion.div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Job Cards */}
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonCard key={index} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading