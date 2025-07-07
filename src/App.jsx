import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import SearchResults from '@/components/pages/SearchResults'
import JobDetail from '@/components/pages/JobDetail'
import SavedJobs from '@/components/pages/SavedJobs'
import SavedSearches from '@/components/pages/SavedSearches'
import BrowseJobs from '@/components/pages/BrowseJobs'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route path="saved-searches" element={<SavedSearches />} />
          <Route path="browse" element={<BrowseJobs />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  )
}

export default App