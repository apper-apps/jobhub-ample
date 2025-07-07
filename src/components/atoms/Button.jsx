import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-secondary border border-gray-200 hover:border-primary shadow-sm',
    accent: 'bg-gradient-accent hover:bg-gradient-to-r hover:from-accent hover:to-orange-600 text-white shadow-md hover:shadow-lg',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-600 hover:text-primary hover:bg-gray-50',
    link: 'text-primary hover:text-secondary underline-offset-4 hover:underline'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button