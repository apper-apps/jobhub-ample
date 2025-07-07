import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ variant = 'default', className = '', onSearch }) => {
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    if (keywords.trim()) searchParams.set('keywords', keywords.trim())
    if (location.trim()) searchParams.set('location', location.trim())
    
    if (onSearch) {
      onSearch({ keywords: keywords.trim(), location: location.trim() })
    } else {
      navigate(`/search?${searchParams.toString()}`)
    }
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Job title, keywords, or company"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative flex-1">
          <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="City, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Job title, keywords, or company"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <div className="relative">
          <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="City, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full">
        <ApperIcon name="Search" className="mr-2 h-5 w-5" />
        Find Jobs
      </Button>
    </form>
  )
}

export default SearchBar