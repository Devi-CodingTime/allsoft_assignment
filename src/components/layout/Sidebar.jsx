import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/upload', label: 'Upload document', icon: UploadIcon },
  { to: '/search', label: 'Search & retrieve', icon: SearchIcon },
  { to: '/admin/users', label: 'User administration', icon: UsersIcon },
];

export default function Sidebar({ open, onClose }) {
  const { logout, userName, mobileNumber } = useAuth();
  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">DS</div>
          <div>
            <div className="sidebar-brand-name">Document Management System</div>
            <div className="sidebar-brand-tag">Document management</div>
          </div>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={onClose}>
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.75rem', color: 'rgba(239,237,230,0.55)', marginBottom: 10 }}>
            Signed in as {userName || mobileNumber || 'user'}
          </div>
          <button className="sidebar-signout" onClick={logout}>Sign out</button>
        </div>
      </aside>
    </>
  );
}

function UploadIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="M7 8l5-5 5 5" /><path d="M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>;
}
function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function UsersIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}