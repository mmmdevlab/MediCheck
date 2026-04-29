import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import {
  HouseHeart,
  Route,
  CalendarFold,
  UserRound,
  LogOut,
} from 'lucide-react';
import ActionButton from '../UI/ActionButton';
import { AuthContext } from '../../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <HouseHeart size={22} /> },
  { to: '/visits', label: 'Visits', icon: <CalendarFold size={22} /> },
  { to: '/tasks', label: 'Tasks', icon: <Route size={22} /> },
  { to: '/profile', label: 'Profile', icon: <UserRound size={22} /> },
];

const NavBar = ({ isLoggedIn }) => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div>
      <header className="navbar-top flex items-center justify-between px-6 h-14 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link to={user ? '/dashboard' : '/auth/login'}>
          <img
            src="/MediCheck_Logo_H.svg"
            alt="MediCheck logo"
            className="h-7"
          />
        </Link>

        {user && (
          <ActionButton variant="danger" onClick={handleLogout}>
            <LogOut size={14} />
            Logout
          </ActionButton>
        )}
      </header>

      {isLoggedIn && (
        <nav className="navbar-bottom flex bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
          <ul className="flex items-center justify-center h-16">
            {navLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/dashboard'}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex flex-col items-center gap-2 text-[#3177FE]'
                      : 'flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-2'
                  }
                >
                  {icon}
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
