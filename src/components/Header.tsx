import { Heart, Search, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Tasks', path: 'tasks' },
    { name: 'Budget', path: 'budget' },
    { name: 'Vendors', path: 'vendors' },
    { name: 'Gallery', path: 'gallery' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-serif text-pink-300">DreamDay</span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === item.path
                      ? 'text-pink-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg">
                    <User className="w-4 h-4 text-pink-300" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>

          {isSearchOpen && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                autoFocus
              />
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
