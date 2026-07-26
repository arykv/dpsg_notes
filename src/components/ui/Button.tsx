import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'mark'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[var(--mark)] text-[#241703] hover:brightness-108 active:brightness-95',
  secondary:
    'surface border border-line-strong text-[var(--text)] hover:bg-[var(--surface-hover)]',
  ghost: 'text-muted hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
  mark: 'border border-[var(--mark)] text-mark hover:bg-[var(--mark)]/10',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-[5px]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[6px]',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-[6px]',
}

const BASE =
  'inline-flex items-center justify-center font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,transform,filter] duration-150 ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45'

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
}

export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ variant = 'secondary', size = 'md', className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
})

interface ButtonLinkProps extends CommonProps {
  to: string
  external?: boolean
  children: React.ReactNode
  'aria-label'?: string
}

export function ButtonLink({
  to,
  external,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  )
}
