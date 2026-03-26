import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, MessageCircle, LogOut, Shield } from 'lucide-react';
import { useAuth, useNotification } from '../context';
import AuthModal from './AuthModal';
import AdminAuthModal from './AdminAuthModal';

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user ? (user.role === 'Admin' ? '/admin' : '/profile') : '/';

  return (
    <>
      <header className="header">
        <div className="navbar">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/agri-rent-favicon.jpeg" alt="AgriRent Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
            AgriRent
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            {(!user || user.role !== 'Admin') && (
              <>
                <Link to={user ? '/buyer' : '#'} onClick={() => !user && setShowAuth(true)} className="nav-link">Renter</Link>
                <Link to={user ? '/seller' : '#'} onClick={() => !user && setShowAuth(true)} className="nav-link">Owner</Link>
              </>
            )}
            <Link to="/about" className="nav-link">About Us</Link>
            
            <div className="flex items-center gap-4 ml-4">
              {user && (
                <div style={{ position: 'relative' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem', position: 'relative', border: 'none' }}
                    onClick={() => { setShowNotif(!showNotif); markAllAsRead(); }}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                  </button>
                  
                  {showNotif && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, 
                      background: 'white', width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      borderRadius: '8px', zIndex: 1000, maxHeight: '400px', overflowY: 'auto'
                    }}>
                      <h4 style={{ padding: '1rem', borderBottom: '1px solid #eee', margin: 0 }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.type}</div>
                            <div style={{ fontSize: '0.875rem', color: '#444' }}>{n.message}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
                              {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to={dashboardLink} className="btn btn-primary" title="Profile">
                    <User size={18} className="mr-2" style={{ marginRight: '0.5rem' }} /> {user.name}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                    Login / Register
                  </button>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', border: 'none', color: 'var(--color-primary)' }} onClick={() => setShowAdminAuth(true)} title="Admin Login">
                    <Shield size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAdminAuth && <AdminAuthModal onClose={() => setShowAdminAuth(false)} />}
    </>
  );
}
