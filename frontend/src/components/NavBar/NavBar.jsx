import { useContext } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
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

const NavBar = () => {
  const { user, signout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate('/auth/login');
  };

  return (
    <div>
      <header className="navbar-top flex items-center justify-between px-6 h-14 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <Link to={user ? '/dashboard' : '/auth/login'}>
          <img
            src="/MediCheck_Logo_H.svg"
            alt="MediCheck logo"
            className="h-10"
          />
        </Link>

        {user && (
          <ActionButton variant="danger" onClick={handleLogout}>
            <LogOut size={14} />
            Logout
          </ActionButton>
        )}
      </header>

      {user && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white rounded-full shadow-lg border border-gray-100 px-1 py-1 space-y-6 bg-white/80 backdrop-blur-md">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/dashboard'}
                    className={({ isActive }) =>
                      isActive
                        ? 'flex flex-col items-center gap-1 px-10 py-3 rounded-full bg-primary text-white transition-all'
                        : 'flex flex-col items-center gap-1 px-10 py-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all'
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
          </div>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
