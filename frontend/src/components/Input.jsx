import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-organic border bg-white
          text-text-primary placeholder:text-text-secondary
          focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
          transition-colors
          ${error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
