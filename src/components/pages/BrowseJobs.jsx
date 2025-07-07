import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import JobListing from '@/components/organisms/JobListing'
import SearchBar from '@/components/molecules/SearchBar'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import { jobService } from '@/services/api/jobService'

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
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState('single') // 'single' or 'multiple'
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    description: '',
    requirements: '',
    salary: { min: '', max: '' }
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

  const handleUploadClick = (type) => {
    setUploadType(type)
    setShowUploadModal(true)
    setSelectedFile(null)
    setJobFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      experienceLevel: 'Mid Level',
      description: '',
      requirements: '',
      salary: { min: '', max: '' }
    })
  }

  const handleFileSelect = (file) => {
    if (uploadType === 'multiple' && file.type !== 'text/csv') {
      toast.error('Please select a CSV file for multiple job upload')
      return
    }
    setSelectedFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSingleJobUpload = async () => {
    if (!jobFormData.title || !jobFormData.company || !jobFormData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    setUploading(true)
    try {
      const jobData = {
        ...jobFormData,
        salary: {
          min: jobFormData.salary.min ? parseInt(jobFormData.salary.min) : null,
          max: jobFormData.salary.max ? parseInt(jobFormData.salary.max) : null
        }
      }
      
      await jobService.create(jobData)
      toast.success('Job uploaded successfully!')
      setShowUploadModal(false)
      // Trigger job listing refresh by updating search params
      setSearchParams(prev => ({ ...prev }))
    } catch (error) {
      toast.error('Failed to upload job. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleMultipleJobUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const jobs = await jobService.uploadJobs(selectedFile, (progress) => {
        setUploadProgress(progress)
      })
      
      toast.success(`Successfully uploaded ${jobs.length} jobs!`)
      setShowUploadModal(false)
      // Trigger job listing refresh
      setSearchParams(prev => ({ ...prev }))
    } catch (error) {
      toast.error(error.message || 'Failed to upload jobs. Please check your CSV format.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleJobFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setJobFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setJobFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
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

        {/* Upload Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Upload Jobs</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleUploadClick('single')}
              className="bg-primary hover:bg-secondary text-white"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Upload Single Job
            </Button>
            <Button
              onClick={() => handleUploadClick('multiple')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
              Upload Multiple Jobs (CSV)
            </Button>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {uploadType === 'single' ? 'Upload Single Job' : 'Upload Multiple Jobs'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>

              {uploadType === 'single' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={jobFormData.title}
                        onChange={(e) => handleJobFormChange('title', e.target.value)}
                        placeholder="e.g. Senior React Developer"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={jobFormData.company}
                        onChange={(e) => handleJobFormChange('company', e.target.value)}
                        placeholder="e.g. TechCorp"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={jobFormData.location}
                        onChange={(e) => handleJobFormChange('location', e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Job Type</Label>
                      <select
                        id="type"
                        value={jobFormData.type}
                        onChange={(e) => handleJobFormChange('type', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={uploading}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <select
                        id="experienceLevel"
                        value={jobFormData.experienceLevel}
                        onChange={(e) => handleJobFormChange('experienceLevel', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={uploading}
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="salaryMin">Min Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={jobFormData.salary.min}
                        onChange={(e) => handleJobFormChange('salary.min', e.target.value)}
                        placeholder="50000"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Max Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={jobFormData.salary.max}
                        onChange={(e) => handleJobFormChange('salary.max', e.target.value)}
                        placeholder="100000"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <textarea
                      id="description"
                      value={jobFormData.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      rows={4}
                      className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Describe the job role and responsibilities..."
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <textarea
                      id="requirements"
                      value={jobFormData.requirements}
                      onChange={(e) => handleJobFormChange('requirements', e.target.value)}
                      rows={3}
                      className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="List the job requirements..."
                      disabled={uploading}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadModal(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSingleJobUpload}
                      disabled={uploading}
                      className="bg-primary hover:bg-secondary text-white"
                    >
                      {uploading ? (
                        <>
                          <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                          Upload Job
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                    <p className="mb-2">Your CSV file should include the following columns:</p>
                    <code className="text-xs bg-white px-2 py-1 rounded block">
                      title,company,location,type,experienceLevel,description,requirements,salaryMin,salaryMax
                    </code>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : selectedFile 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="space-y-2">
                        <ApperIcon name="FileCheck" className="h-12 w-12 text-green-500 mx-auto" />
                        <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          disabled={uploading}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ApperIcon name="Upload" className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-600 mb-2">Drag and drop your CSV file here</p>
                          <p className="text-sm text-gray-500">or</p>
                        </div>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                          id="csvFile"
                          disabled={uploading}
                        />
                        <label htmlFor="csvFile">
                          <Button as="span" variant="outline" disabled={uploading}>
                            <ApperIcon name="FolderOpen" className="h-4 w-4 mr-2" />
                            Choose CSV File
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading jobs...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadModal(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleMultipleJobUpload}
                      disabled={uploading || !selectedFile}
                      className="bg-primary hover:bg-secondary text-white"
                    >
                      {uploading ? (
                        <>
                          <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                          Upload Jobs
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseJobs