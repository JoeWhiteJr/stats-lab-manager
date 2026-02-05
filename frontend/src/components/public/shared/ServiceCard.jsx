import * as LucideIcons from 'lucide-react';

export default function ServiceCard({ icon, title, description }) {
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  return (
    <div className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-pub-blue-200 hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-pub-blue-100 flex items-center justify-center text-pub-blue-600 mb-4 group-hover:bg-pub-blue-600 group-hover:text-white transition-colors">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
