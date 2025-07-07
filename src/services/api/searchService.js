// Simulated delay for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const searchService = {
  async getSavedSearches() {
    await delay(200)
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    return savedSearches
  },

  async saveSearch(searchData) {
    await delay(200)
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const maxId = Math.max(...savedSearches.map(search => search.Id), 0)
    
    const newSearch = {
      ...searchData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    
    savedSearches.push(newSearch)
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
    return { ...newSearch }
  },

  async deleteSavedSearch(searchId) {
    await delay(200)
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const filtered = savedSearches.filter(search => search.Id !== searchId)
    localStorage.setItem('savedSearches', JSON.stringify(filtered))
    return true
  },

  async updateSavedSearch(searchId, searchData) {
    await delay(200)
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    const index = savedSearches.findIndex(search => search.Id === searchId)
    
    if (index === -1) {
      throw new Error('Saved search not found')
    }
    
    savedSearches[index] = { ...savedSearches[index], ...searchData }
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
    return { ...savedSearches[index] }
  }
}