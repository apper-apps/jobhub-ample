import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import JobListing from '@/components/organisms/JobListing'
import SearchBar from '@/components/molecules/SearchBar'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const BrowseJobs = () => {
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: null,
    postedDate: '',
    company: ''
  })
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: ''
  })

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (newSearchParams) => {
    setSearchParams(newSearchParams)
  }

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      salaryRange: null,
      postedDate: '',
      company: ''
    })
    setSearchParams({
      keywords: '',
      location: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.jobType?.length > 0) count += filters.jobType.length
    if (filters.experienceLevel?.length > 0) count += filters.experienceLevel.length
    if (filters.salaryRange) count += 1
    if (filters.postedDate) count += 1
    if (filters.company) count += 1
    if (searchParams.keywords) count += 1
    if (searchParams.location) count += 1
    return count
  }

  const popularCategories = [
    { name: 'Software Engineering', count: '2,500+', icon: 'Code' },
    { name: 'Data Science', count: '800+', icon: 'BarChart3' },
    { name: 'Product Management', count: '600+', icon: 'Users' },
    { name: 'Marketing', count: '900+', icon: 'Megaphone' },
    { name: 'Sales', count: '1,100+', icon: 'TrendingUp' },
    { name: 'Design', count: '400+', icon: 'Palette' }
  ]

  const quickFilters = [
    { label: 'Remote Jobs', filter: { jobType: ['Remote'] } },
    { label: 'Full-time', filter: { jobType: ['Full-time'] } },
    { label: 'Entry Level', filter: { experienceLevel: ['Entry Level'] } },
    { label: 'Senior Level', filter: { experienceLevel: ['Senior Level'] } },
    { label: 'High Salary', filter: { salaryRange: { label: '$100K+', min: 100000, max: null } } },
    { label: 'Recently Posted', filter: { postedDate: '7' } }
  ]

  const applyQuickFilter = (quickFilter) => {
    setFilters(prev => ({
      ...prev,
      ...quickFilter.filter
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse All Jobs</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Filters</h2>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyQuickFilter(filter)}
                className="hover:bg-primary hover:text-white"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ApperIcon name={category.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
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

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-900">
                {getActiveFiltersCount()} filters applied
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <JobListing
            filters={filters}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  )
}

export default BrowseJobs