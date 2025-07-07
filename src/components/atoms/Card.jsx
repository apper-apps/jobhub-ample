import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-white shadow-card transition-shadow hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  )
})

Card.displayName = 'Card'

export default Card