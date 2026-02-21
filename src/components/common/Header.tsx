import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg
            viewBox="0 0 64 64"
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="url(#logo-g)" />
            <path
              d="M18 34 l8 8 l20-20"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CheckIt!
          </span>
        </Link>
      </div>
    </header>
  );
}
