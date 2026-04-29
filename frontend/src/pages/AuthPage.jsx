import { NavLink, useLocation } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import LoginForm from '../components/auth/LoginForm';
import ProductInfo from '../components/auth/ProductInfo';

const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/auth/signup';

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-1/2 flex p-12">
        <div className="w-full max-w-md">
          <div className="flex gap-4 mb-8">
            <NavLink
              to="/auth/signup"
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-colors ${
                isSignup
                  ? 'bg-primary text-white cursor-default'
                  : 'bg-background text-gray-700 hover:bg-gray-200'
              }`}
            >
              SIGN-UP
            </NavLink>
            <NavLink
              to="/auth/login"
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-colors ${
                !isSignup
                  ? 'bg-primary text-white cursor-default'
                  : 'bg-background text-gray-700 hover:bg-gray-200'
              }`}
            >
              LOGIN
            </NavLink>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome to MediCheck!</h1>
              <p className="text-primary font-semibold">
                {isSignup ? 'SIGN-UP' : 'LOGIN'}
              </p>
            </div>

            {isSignup ? <SignupForm /> : <LoginForm />}

            <div className="mt-6 text-center text-sm text-gray-600">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <NavLink
                    to="/auth/login"
                    className="text-primary hover:text-blue-700 font-medium"
                  >
                    Log in
                  </NavLink>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <NavLink
                    to="/auth/signup"
                    className="text-primary hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </NavLink>
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
