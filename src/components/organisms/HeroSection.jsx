import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const HeroSection = () => {
  const stats = [
    { label: 'Active Jobs', value: '10,000+', icon: 'Briefcase' },
    { label: 'Companies', value: '2,500+', icon: 'Building2' },
    { label: 'Job Seekers', value: '50,000+', icon: 'Users' }
  ]

  const trendingKeywords = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer',
    'Marketing Manager', 'Sales Representative', 'Financial Analyst', 'Nurse'
  ]

  return (
    <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Find Your Dream Job
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Search thousands of jobs from top companies and startups. Your next career opportunity is just a search away.
          </motion.p>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="p-8 backdrop-blur-glass">
            <SearchBar />
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center backdrop-blur-glass">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Trending Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Trending Job Searches</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 cursor-pointer transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection