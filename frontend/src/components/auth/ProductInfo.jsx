import { useLocation } from 'react-router-dom';

const ProductInfo = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/auth/signup';

  return (
    <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-wider text-gray-500 mb-2">
          WELCOME TO MEDICHECK
        </p>
        <h2 className="text-4xl font-bold leading-tight mb-6">
          Healthcare is better when it's handled together.
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Managing health shouldn't feel like a solo mission.{' '}
          <span className="font-bold">MediCheck</span> bridges the gap between
          patients, clinics, and the people who care about them most. Whether
          you're organizing your own schedule or supporting a loved one, we
          ensure no detail is overlooked and no appointment is missed.
        </p>
      </div>

      <img
        src={isSignup ? '/signup-hero.jpg' : '/login-hero.jpg'}
        alt={isSignup ? 'Elderly hands together' : 'Caregiver support'}
        className="w-full rounded-2xl mb-8 shadow-sm"
      />

      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-1">
            STAY ORGANIZED
          </p>
          <h3 className="text-xl font-bold text-[#3177FE] mb-2">
            Track Appointments
          </h3>
          <p className="text-sm text-gray-600">
            Centralize your medical calendar. Keep every specialist, check-up,
            and follow-up in one clear, manageable view.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-1">
            BUILD YOUR CIRCLE
          </p>
          <h3 className="text-xl font-bold text-[#3177FE] mb-2">
            Connect Caregivers
          </h3>
          <p className="text-sm text-gray-600">
            Invite family and friends to join your support network, ensuring
            everyone is on the same page.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-1">
            ASK SIMPLY
          </p>
          <h3 className="text-xl font-bold text-[#3177FE] mb-2">
            Request Assistance
          </h3>
          <p className="text-sm text-gray-600">
            Need a ride to the clinic or help with a prescription? Send a
            request to your circle in seconds.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-1">
            COORDINATE SEAMLESSLY
          </p>
          <h3 className="text-xl font-bold text-[#3177FE] mb-2">
            Lean on Support
          </h3>
          <p className="text-sm text-gray-600">
            Caregivers can view active needs, accept tasks, and mark them as
            complete—so you can focus on recovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
