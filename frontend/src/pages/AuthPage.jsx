import { useLocation, useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import LoginForm from '../components/auth/LoginForm';
import ProductInfo from '../components/auth/ProductInfo';
import PillToggle from '../components/UI/PillToggle';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === '/auth/signup';

  const authOptions = [
    { value: 'signup', label: 'Sign-Up' },
    { value: 'login', label: 'Login' },
  ];

  const handleAuthToggle = (value) => {
    navigate(`/auth/${value}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-1/2 flex justify-center p-12">
        <div className="w-full max-w-md">
          <PillToggle
            options={authOptions}
            active={isSignup ? 'signup' : 'login'}
            onSelect={handleAuthToggle}
            className="mb-8"
          />

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome to MediCheck!</h1>
              <p className="text-primary font-semibold uppercase tracking-wider text-sm">
                {isSignup ? 'Sign-Up' : 'Login'}
              </p>
            </div>

            {isSignup ? <SignupForm /> : <LoginForm />}

            <div className="mt-6 text-center text-sm text-gray-600">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="text-primary hover:text-blue-700 font-medium uppercase tracking-wide"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/auth/signup')}
                    className="text-primary hover:text-blue-700 font-medium uppercase tracking-wide"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductInfo />
    </div>
  );
};

export default AuthPage;
