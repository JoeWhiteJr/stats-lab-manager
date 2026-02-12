import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
          <Icon size={32} className="text-text-secondary dark:text-gray-400" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-text-primary dark:text-gray-100">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-text-secondary dark:text-gray-400 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
