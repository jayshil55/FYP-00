import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Menu, X, Stethoscope, HeartPulse, MessageSquare, 
  LogOut, UploadCloud, Sparkles, ChevronRight, LayoutDashboard, User
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auto logout after 5 minutes of inactivity
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Clear any remaining Cognito/Amplify tokens and redirect to the login page
  const performLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('[Logout]', err);
    }
    // Safety net: remove any persisted auth credentials still sitting in localStorage
    const authKeys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && /cognito|amplify/i.test(key)) {
        authKeys.push(key);
      }
    }
    authKeys.forEach((key) => localStorage.removeItem(key));
    navigate('/');
  }, [logout, navigate]);

  // Auto logout after 5 minutes of inactivity
  useEffect(() => {
    let timer = null;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void performLogout();
      }, INACTIVITY_TIMEOUT_MS);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'wheel', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [performLogout]);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Reset mobile drawer on desktop resize
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeMobileDrawer = () => { if (isMobile) setSidebarOpen(false); };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/upload': return 'Upload Medical Report';
      case '/recovery': return 'Report overview';
      case '/health-tips': return 'Personalized Health Insights';
      case '/assistant': return 'NutriCare assistant';
      case '/account':
      case '/profile': return 'My Health Profile & Account';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="nc-app-shell flex h-[100dvh] w-full bg-[var(--nc-paper-warm)] text-[var(--nc-ink)] overflow-hidden font-body antialiased relative">
      
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-[var(--nc-ink)]/30 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.div
            id="app-navigation-drawer"
            initial={isMobile ? { x: -300, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: -300, opacity: 0 } : false}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`nc-sidebar
              bg-[var(--nc-paper)]/95 backdrop-blur-2xl border-r border-[var(--nc-line)] flex flex-col pt-6 pb-6 flex-shrink-0 z-40
              ${isMobile 
                ? 'fixed inset-y-0 left-0 w-[280px] h-full shadow-2xl' 
                : 'static w-[280px] h-full shadow-xl'
              }
            `}
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-6 mb-8">
              <Link to="/upload" onClick={closeMobileDrawer} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl bg-[var(--nc-green)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--nc-green)]/20 group-hover:shadow-[var(--nc-green)]/30 transition-all">
                  <Activity className="text-white w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h1 className="nc-brand text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--nc-font-display)' }}>
                    NutriCare
                  </h1>
                  <span className="text-[10px] font-semibold text-[var(--nc-muted)] tracking-wide uppercase flex items-center gap-1">
                    Your health workspace
                  </span>
                </div>
              </Link>
              {isMobile && (
                <button aria-label="Close navigation menu"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-xl bg-[var(--nc-mint)] text-[var(--nc-muted)] hover:text-[var(--nc-ink)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Nav Menu */}
                  <nav aria-label="Workspace navigation" className="flex-1 px-4 space-y-1.5 w-full overflow-hidden">
              <SidebarItem to="/upload" icon={<UploadCloud className="w-5 h-5" />} label="Reports" currentPath={location.pathname} onClick={closeMobileDrawer} />
              <SidebarItem to="/recovery" icon={<Stethoscope className="w-5 h-5" />} label="Consultation" currentPath={location.pathname} onClick={closeMobileDrawer} />
              <SidebarItem to="/health-tips" icon={<HeartPulse className="w-5 h-5" />} label="Health insights" currentPath={location.pathname} onClick={closeMobileDrawer} />
              <SidebarItem to="/assistant" icon={<MessageSquare className="w-5 h-5" />} label="AI assistant" currentPath={location.pathname} onClick={closeMobileDrawer} />
              <SidebarItem to="/account" icon={<User className="w-5 h-5" />} label="My account" currentPath={location.pathname} onClick={closeMobileDrawer} />
            </nav>

            {/* User Profile / Logout */}
            <div className="px-4 mt-auto w-full overflow-hidden space-y-3">
              <Link 
                to="/account"
                onClick={closeMobileDrawer}
                className="p-3 bg-[var(--nc-mint)] hover:bg-[var(--nc-line)] border border-[var(--nc-line)] rounded-2xl flex items-center gap-3 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--nc-green)] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  NH
                </div>
                <div className="flex-1 truncate">
              <p className="text-xs font-bold text-[var(--nc-ink)] truncate group-hover:text-[var(--nc-green)] transition-colors">Your health profile</p>
                  <p className="text-[10px] text-[var(--nc-green)] font-semibold truncate">View Account & Preferences</p>
                </div>
              </Link>

              <button
                onClick={() => void performLogout()}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-[var(--nc-muted)] hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="nc-main flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--nc-paper-warm)] relative">
        
        {/* Universal Ambient Gradients */}

        {/* Top Navbar Header */}
        <header className="nc-topbar min-h-16 px-4 sm:px-7 flex items-center justify-between gap-3 z-30 w-full shrink-0 border-b border-[var(--nc-line)] bg-[var(--nc-paper)]/95">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl bg-[var(--nc-mint)] hover:bg-[var(--nc-line)] text-[var(--nc-ink-light)] border border-[var(--nc-line)] shadow-xs transition-all cursor-pointer flex items-center justify-center shrink-0"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                aria-expanded={sidebarOpen}
                aria-controls="app-navigation-drawer"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--nc-ink)] flex items-center gap-2 truncate" style={{ fontFamily: 'var(--nc-font-display)' }}>
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/upload" onClick={closeMobileDrawer} className="px-3 py-2 rounded-xl bg-[var(--nc-mint)] hover:bg-[var(--nc-line)] text-[var(--nc-green)] text-xs font-bold border border-[var(--nc-line)] transition-all flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/account" onClick={closeMobileDrawer} className="px-3 py-2 rounded-xl bg-[var(--nc-paper)] hover:bg-[var(--nc-mint)] text-[var(--nc-ink)] text-xs font-bold border border-[var(--nc-line)] transition-all flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Account</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center">
          <div className="w-full max-w-[1280px] mx-auto flex-1 flex flex-col justify-start items-center p-4 sm:p-7 lg:p-8 pb-16">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label, currentPath, onClick }) {
  const active = currentPath === to || (currentPath === '/profile' && to === '/account') || (currentPath === '/processing' && to === '/upload');
  return (
    <Link to={to} onClick={onClick} aria-current={active ? 'page' : undefined} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm ${
      active 
        ? "nc-nav-active text-white" 
        : "text-[var(--nc-muted)] hover:bg-[var(--nc-mint)] hover:text-[var(--nc-ink)]"
    }`}>
      <span className={active ? "text-white" : "text-[var(--nc-muted-light)]"}>{icon}</span>
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="w-4 h-4 text-white/80" />}
    </Link>
  );
}
