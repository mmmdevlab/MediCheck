import { NavLink, useLocation } from 'react-router-dom';

import SignupForm from '../components/auth/SignupForm';
import LoginForm from '../components/auth/LoginForm';
import ProductInfo from '../components/auth/ProductInfo';

const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/auth/signup';

  return (
    <div className="min-h-screen bg-[#EEF1F5] flex">
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="flex gap-4 mb-8">
            <NavLink
              to="/auth/signup"
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-colors ${
                isSignup
                  ? 'bg-[#3177FE] text-white cursor-default'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              SIGN-UP
            </NavLink>
            <NavLink
              to="/auth/login"
              className={`flex-1 py-3 px-6 rounded-full text-center font-medium transition-colors ${
                !isSignup
                  ? 'bg-[#3177FE] text-white cursor-default'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              LOGIN
            </NavLink>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to MediCheck!</h1>
            <p className="text-[#3177FE] font-semibold">
              {isSignup ? 'SIGN-UP' : 'LOGIN'}
            </p>
          </div>

          {isSignup ? <SignupForm /> : <LoginForm />}

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <NavLink
                  to="/auth/login"
                  className="text-[#3177FE] hover:text-[#2563EB] font-medium"
                >
                  Log in
                </NavLink>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <NavLink
                  to="/auth/signup"
                  className="text-[#3177FE] hover:text-[#2563EB] font-medium"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </p>
        </div>
      </div>
      <ProductInfo />
    </div>
  );
};

export default AuthPage;
