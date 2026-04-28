import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Calendar, ShieldAlert, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: '/', label: 'Trang Chủ' },
    { to: '/characters', label: 'Nhân Vật' },
    { to: '/events', label: 'Sự Kiện' },
  ];

  return (
    <div className="min-h-screen grain bg-horror-dark flex flex-col">
      <nav className="sticky top-0 z-40 bg- horror-dark/80 backdrop-blur-md border-b border-horror-red/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Ghost className="w-8 h-8 text-horror-red animate-pulse" />
              <span className="font-serif text-2xl text-horror-red tracking-wider">  KHƯƠNG TÚC </span>    
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} active={location.pathname === link.to}>{link.label}</NavLink>
              ))}
              {user ? (
                <>
                  <NavLink to="/admin" active={location.pathname === '/admin'}>Quản Trị</NavLink>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-horror-red/10 bg-horror-dark/95 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 text-lg font-display tracking-widest uppercase transition-colors ${
                      location.pathname === link.to ? 'text-horror-red' : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2 text-lg font-display tracking-widest uppercase transition-colors ${
                        location.pathname === '/admin' ? 'text-horror-red' : 'text-gray-400'
                      }`}
                    >
                      Quản Trị
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-gray-400 text-lg font-display tracking-widest uppercase w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Đăng Xuất</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-400 text-lg font-display tracking-widest uppercase"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black/50 border-t border-horror-red/10 py-8 px-4 text-center">
        <p className="text-gray-500 text-sm font-display italic">
          "lòng tin là thứ xa xỉ nhất."
        </p>
        <p className="mt-2 text-xs text-gray-600">
          © 2026 Khương Túc 
        </p>
      </footer>
    </div>
  );
}


interface NavLinkProps {
  to: string;
  children: ReactNode;
  active: boolean;
  key?: string | number;
}

function NavLink({ to, children, active }: NavLinkProps) {
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
        active ? 'text-horror-red' : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
      {active && (
        <motion.div 
          layoutId="underline" 
          className="h-0.5 bg-horror-red mt-0.5"
        />
      )}
    </Link>
  );
}
