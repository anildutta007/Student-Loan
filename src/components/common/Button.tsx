import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          // Base styles
          'font-semibold rounded-lg transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Sizes
          size === 'sm' && 'px-3 py-2 text-sm',
          size === 'md' && 'px-4 py-2.5 text-base',
          size === 'lg' && 'px-6 py-3 text-lg',

          // Variants
          variant === 'primary' && [
            'bg-blue-600 text-white',
            'hover:bg-blue-700 active:bg-blue-800',
            'focus-visible:outline-blue-600',
          ],
          variant === 'secondary' && [
            'bg-gray-200 text-gray-900',
            'hover:bg-gray-300 active:bg-gray-400',
            'focus-visible:outline-gray-400',
          ],
          variant === 'ghost' && [
            'bg-transparent text-blue-600',
            'hover:bg-blue-50 active:bg-blue-100',
            'focus-visible:outline-blue-600',
          ],

          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
