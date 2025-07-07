import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'

const NavLink = ({ to, children, icon, className = '' }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:text-primary hover:bg-gray-50',
        className
      )}
    >
      {icon && <ApperIcon name={icon} className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  )
}

export default NavLink