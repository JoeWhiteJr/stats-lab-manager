import { Mail, Linkedin, User } from 'lucide-react';

export default function TeamCard({
  name,
  role,
  bio,
  email,
  linkedin,
  compact = false,
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-pub-green-200 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full bg-pub-green-100 flex items-center justify-center text-pub-green-600 flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <span className="text-sm text-gray-500">{role}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-pub-green-100 to-pub-green-200 flex items-center justify-center">
        <User className="w-20 h-20 text-pub-green-400" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900">{name}</h4>
        <span className="inline-block px-3 py-1 bg-pub-green-100 text-pub-green-700 rounded-full text-sm font-medium mt-2 mb-3">
          {role}
        </span>
        {bio && <p className="text-gray-600 text-sm mb-4">{bio}</p>}

        {/* Contact Links */}
        <div className="flex gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pub-green-600 hover:text-white transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pub-green-600 hover:text-white transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
