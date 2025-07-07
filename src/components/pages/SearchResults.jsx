import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import JobListing from '@/components/organisms/JobListing'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: null,
    postedDate: '',
    company: ''
  })

  const keywords = searchParams.get('keywords') || ''
  const location = searchParams.get('location') || ''

  const handleSearch = (newSearchParams) => {
    const params = new URLSearchParams()
    if (newSearchParams.keywords) params.set('keywords', newSearchParams.keywords)
    if (newSearchParams.location) params.set('location', newSearchParams.location)
    setSearchParams(params)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      salaryRange: null,
      postedDate: '',
      company: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.jobType?.length > 0) count += filters.jobType.length
    if (filters.experienceLevel?.length > 0) count += filters.experienceLevel.length
    if (filters.salaryRange) count += 1
    if (filters.postedDate) count += 1
    if (filters.company) count += 1
    return count
  }

  const removeFilter = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      if (filterType === 'jobType' || filterType === 'experienceLevel') {
        newFilters[filterType] = prev[filterType].filter(item => item !== value)
      } else {
        newFilters[filterType] = filterType === 'company' ? '' : null
      }
      return newFilters
    })
  }

  const getActiveFilterTags = () => {
    const tags = []
    
    filters.jobType?.forEach(type => {
      tags.push({ type: 'jobType', value: type, label: type })
    })
    
    filters.experienceLevel?.forEach(level => {
      tags.push({ type: 'experienceLevel', value: level, label: level })
    })
    
    if (filters.salaryRange) {
      tags.push({ 
        type: 'salaryRange', 
        value: filters.salaryRange, 
        label: filters.salaryRange.label 
      })
    }
    
    if (filters.postedDate) {
      const dateLabels = {
        '1': 'Last 24 hours',
        '3': 'Last 3 days',
        '7': 'Last week',
        '14': 'Last 2 weeks',
        '30': 'Last month'
      }
      tags.push({ 
        type: 'postedDate', 
        value: filters.postedDate, 
        label: dateLabels[filters.postedDate] || 'Date filter' 
      })
    }
    
    if (filters.company) {
      tags.push({ 
        type: 'company', 
        value: filters.company, 
        label: `Company: ${filters.company}` 
      })
    }
    
    return tags
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Search Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Search Results
            </h1>
            {(keywords || location) && (
              <p className="text-gray-600 mt-1">
                {keywords && `"${keywords}"`}
                {keywords && location && ' in '}
                {location && `${location}`}
              </p>
            )}
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
            >
              Clear All Filters ({getActiveFiltersCount()})
            </Button>
          )}
        </div>

        {/* Active Filter Tags */}
        {getActiveFilterTags().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {getActiveFilterTags().map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                {tag.label}
                <button
                  onClick={() => removeFilter(tag.type, tag.value)}
                  className="ml-1 hover:text-red-500"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </Badge>
            ))}
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
            searchParams={{ keywords, location }}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchResults