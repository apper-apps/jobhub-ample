import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { searchService } from '@/services/api/searchService'

const SavedSearches = () => {
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadSavedSearches = async () => {
    setLoading(true)
    setError('')
    try {
      const savedSearches = await searchService.getSavedSearches()
      setSearches(savedSearches)
    } catch (err) {
      setError('Failed to load saved searches. Please try again.')
      console.error('Error loading saved searches:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedSearches()
  }, [])

  const handleDeleteSearch = async (searchId) => {
    try {
      await searchService.deleteSavedSearch(searchId)
      setSearches(prev => prev.filter(s => s.Id !== searchId))
      toast.success('Search deleted successfully')
    } catch (err) {
      toast.error('Failed to delete search')
      console.error('Error deleting search:', err)
    }
  }

  const handleRunSearch = (search) => {
    const params = new URLSearchParams()
    if (search.keywords) params.set('keywords', search.keywords)
    if (search.location) params.set('location', search.location)
    navigate(`/search?${params.toString()}`)
  }

  const getActiveFiltersCount = (filters) => {
    if (!filters) return 0
    let count = 0
    if (filters.jobType?.length > 0) count += filters.jobType.length
    if (filters.experienceLevel?.length > 0) count += filters.experienceLevel.length
    if (filters.salaryRange) count += 1
    if (filters.postedDate) count += 1
    if (filters.company) count += 1
    return count
  }

  const retryLoad = () => {
    loadSavedSearches()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }

  if (searches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          title="No saved searches yet"
          description="Save your search queries to quickly find jobs that match your criteria."
          actionLabel="Start Searching"
          onAction={() => navigate('/')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Searches</h1>
        <p className="text-gray-600">
          You have {searches.length} saved {searches.length === 1 ? 'search' : 'searches'}
        </p>
      </div>

      <div className="grid gap-6">
        {searches.map((search, index) => (
          <motion.div
            key={search.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {search.savedName || 'Unnamed Search'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    {search.keywords && (
                      <div className="flex items-center">
                        <ApperIcon name="Search" className="h-4 w-4 mr-1" />
                        <span>"{search.keywords}"</span>
                      </div>
                    )}
                    {search.location && (
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                        <span>{search.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {getActiveFiltersCount(search.filters) > 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">
                        {getActiveFiltersCount(search.filters)} filters applied
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Created {new Date(search.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                  >
                    <ApperIcon name="Play" className="h-4 w-4 mr-1" />
                    Run Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSearch(search.Id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SavedSearches