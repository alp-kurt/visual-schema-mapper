import { ComponentPropsWithoutRef, ElementType, ForwardedRef, forwardRef } from 'react'

type CardProps<T extends ElementType = 'article'> = {
  as?: T
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

const baseClasses =
  'rounded-lg bg-dark-card border border-white/10 text-gray-100 transition-colors hover:border-brand-orange/50'

export const Card = forwardRef(function CardInner<T extends ElementType = 'article'>(
  { as, className = '', ...props }: CardProps<T>,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = (as ?? 'article') as ElementType

  return (
    <Component ref={ref} className={`${baseClasses} ${className}`.trim()} {...props}>
      {props.children}
    </Component>
  )
})
