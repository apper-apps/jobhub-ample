import { motion } from 'framer-motion'
import HeroSection from '@/components/organisms/HeroSection'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Home = () => {
  const jobCategories = [
    { name: 'Technology', count: '2,500+', icon: 'Code', color: 'bg-blue-500' },
    { name: 'Healthcare', count: '1,800+', icon: 'Heart', color: 'bg-red-500' },
    { name: 'Finance', count: '1,200+', icon: 'DollarSign', color: 'bg-green-500' },
    { name: 'Marketing', count: '900+', icon: 'Megaphone', color: 'bg-purple-500' },
    { name: 'Education', count: '700+', icon: 'BookOpen', color: 'bg-yellow-500' },
    { name: 'Sales', count: '1,100+', icon: 'TrendingUp', color: 'bg-orange-500' }
  ]

  const featuredCompanies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Spotify'
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Search Jobs',
      description: 'Enter your job title, keywords, or company name along with your preferred location',
      icon: 'Search'
    },
    {
      step: 2,
      title: 'Filter Results',
      description: 'Use our advanced filters to narrow down results by salary, job type, and experience level',
      icon: 'Filter'
    },
    {
      step: 3,
      title: 'Apply & Save',
      description: 'Apply directly or save jobs for later. Track your applications and saved searches',
      icon: 'Send'
    }
  ]

  return (
    <div>
      <HeroSection />
      
      {/* Job Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Jobs by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find opportunities in your field of expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <ApperIcon name={category.icon} className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">{category.count} jobs</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Finding your dream job has never been easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name={item.icon} className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Companies
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of professionals at top companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredCompanies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <div className="text-2xl font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  {company}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your job search today and discover thousands of opportunities waiting for you.
            </p>
            <Button 
              size="lg" 
              variant="accent"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ApperIcon name="Search" className="h-5 w-5 mr-2" />
              Start Job Search
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home