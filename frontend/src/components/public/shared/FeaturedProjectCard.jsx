import * as LucideIcons from 'lucide-react';

export default function FeaturedProjectCard({
  title,
  type,
  status,
  client,
  clientIcon,
  description,
  highlights,
  findings,
  isFeatured,
}) {
  const ClientIcon = LucideIcons[clientIcon] || LucideIcons.Building2;

  const statusStyles = {
    completed: 'bg-pub-green-100 text-pub-green-700',
    ongoing: 'bg-amber-100 text-amber-700',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
        isFeatured ? 'lg:flex' : ''
      }`}
    >
      {/* Image placeholder */}
      <div
        className={`bg-gradient-to-br from-pub-green-100 to-pub-green-200 flex items-center justify-center ${
          isFeatured ? 'lg:w-2/5 h-64 lg:h-auto' : 'h-48'
        }`}
      >
        <LucideIcons.BarChart3 className="w-16 h-16 text-pub-green-400" />
      </div>

      {/* Content */}
      <div className={`p-6 ${isFeatured ? 'lg:w-3/5' : ''}`}>
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[status]}`}>
            {status}
          </span>
          <span className="text-sm text-gray-500">{type}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Client */}
        <p className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <ClientIcon className="w-4 h-4" />
          {client}
        </p>

        <p className="text-gray-600 mb-4">{description}</p>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {highlights.map((highlight, idx) => {
              const HighlightIcon = LucideIcons[highlight.icon] || LucideIcons.Info;
              return (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg"
                >
                  <HighlightIcon className="w-4 h-4 text-pub-green-600" />
                  {highlight.text}
                </span>
              );
            })}
          </div>
        )}

        {/* Findings */}
        {findings && findings.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Key Findings:</h4>
            <ul className="space-y-1.5">
              {findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <LucideIcons.ChevronRight className="w-4 h-4 text-pub-green-600 mt-0.5 flex-shrink-0" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
