import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import NavLink from "@/components/molecules/NavLink";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  const navigationItems = [
    { to: '/', label: 'Home', icon: 'Home' },
    { to: '/browse', label: 'Browse Jobs', icon: 'Search' },
    { to: '/saved-jobs', label: 'Saved Jobs', icon: 'Heart' },
    { to: '/saved-searches', label: 'Saved Searches', icon: 'Bookmark' }
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">JobHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(item => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md ml-8">
            <SearchBar variant="compact" />
          </div>
{/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.name || 'User'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
              </Button>
            </div>
</div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 border-t"
          >
<nav className="flex flex-col space-y-2">
              {navigationItems.map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  icon={item.icon}
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            {/* Mobile User Actions */}
            {isAuthenticated && user && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.firstName || user.name || 'User'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mobile Search */}
            <div className="mt-4 pt-4 border-t">
              <SearchBar variant="compact" />
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header