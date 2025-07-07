import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const FilterSidebar = ({ filters, onFiltersChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  const salaryRanges = [
    { label: 'Under $30K', min: 0, max: 30000 },
    { label: '$30K - $50K', min: 30000, max: 50000 },
    { label: '$50K - $75K', min: 50000, max: 75000 },
    { label: '$75K - $100K', min: 75000, max: 100000 },
    { label: '$100K - $150K', min: 100000, max: 150000 },
    { label: '$150K+', min: 150000, max: null }
  ]

  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      jobType: [],
      experienceLevel: [],
      salaryRange: null,
      postedDate: '',
      company: ''
    }
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const toggleArrayFilter = (key, value) => {
    const current = localFilters[key] || []
    const newValue = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    updateFilter(key, newValue)
  }

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen)
    
    return (
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="font-medium text-gray-900">{title}</h3>
          <ApperIcon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            className="h-4 w-4 text-gray-400" 
          />
        </button>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <FilterSection title="Job Type">
        <div className="space-y-2 mt-3">
          {jobTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.jobType?.includes(type) || false}
                onChange={() => toggleArrayFilter('jobType', type)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Experience Level">
        <div className="space-y-2 mt-3">
          {experienceLevels.map(level => (
            <label key={level} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.experienceLevel?.includes(level) || false}
                onChange={() => toggleArrayFilter('experienceLevel', level)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Salary Range">
        <div className="space-y-2 mt-3">
          {salaryRanges.map(range => (
            <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="salaryRange"
                checked={localFilters.salaryRange?.label === range.label}
                onChange={() => updateFilter('salaryRange', range)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Date Posted">
        <div className="space-y-2 mt-3">
          <select
            value={localFilters.postedDate || ''}
            onChange={(e) => updateFilter('postedDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last week</option>
            <option value="14">Last 2 weeks</option>
            <option value="30">Last month</option>
          </select>
        </div>
      </FilterSection>

      <FilterSection title="Company">
        <div className="mt-3">
          <Input
            placeholder="Company name"
            value={localFilters.company || ''}
            onChange={(e) => updateFilter('company', e.target.value)}
          />
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <Card className="p-6 sticky top-4">
          {sidebarContent}
        </Card>
      </div>
    </>
  )
}

export default FilterSidebar