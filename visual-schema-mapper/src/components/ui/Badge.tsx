import { PropsWithChildren } from 'react'

type BadgeVariant = 'string' | 'number' | 'boolean' | 'date' | 'muted'

const variantClasses: Record<BadgeVariant, string> = { 
  string: 'bg-brand-blue/80 text-gray-200 ring-brand-blue/30',
  number: 'bg-brand-orange/20 text-gray-200 ring-brand-orange/30',
  boolean: 'bg-amber-500/20 text-amber-100 ring-amber-300/40',
  date: 'bg-purple-500/20 text-purple-100 ring-purple-400/40',
  muted: 'bg-brand-blue/10 text-gray-100 ring-white/10',
}

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant
  className?: string
}

export const Badge = ({ variant = 'muted', className = '', children }: BadgeProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-2 ring-offset-1 ring-offset-dark-card ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
