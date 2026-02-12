import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, className = '' }) {
  const isPositive = trend > 0
  const isNeutral = trend === 0

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-organic bg-primary-50 dark:bg-primary-900/30">
          <Icon size={20} className="text-primary-500 dark:text-primary-400" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isNeutral ? 'text-gray-500 dark:text-gray-400' : isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isNeutral ? <Minus size={14} /> : isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-display font-bold text-text-primary dark:text-gray-100">{value}</p>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{label}</p>
      </div>
      {trendLabel && (
        <p className="text-xs text-text-secondary mt-2">{trendLabel}</p>
      )}
    </div>
  )
}
