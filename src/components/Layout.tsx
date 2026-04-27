import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Ghost, Calendar, ShieldAlert, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen grain bg-horror-dark flex flex-col">
      <nav className="sticky top-0 z-40 bg- horror-dark/80 backdrop-blur-md border-b border-horror-red/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Ghost className="w-8 h-8 text-horror-red animate-pulse" />
<span className="font-serif text-2xl text-horror-red tracking-wider">
  KHƯƠNG TÚC
</span>         </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/" active={location.pathname === '/'}>Trang Chủ</NavLink>
              <NavLink to="/events" active={location.pathname === '/events'}>Sự Kiện</NavLink>
              {user ? (
                <>
                  <NavLink to="/admin" active={location.pathname === '/admin'}>Quản Trị</NavLink>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
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

function NavLink({ to, children, active }: { to: string, children: ReactNode, active: boolean }) {
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
