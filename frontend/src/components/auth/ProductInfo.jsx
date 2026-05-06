import { useLocation } from 'react-router-dom';

const ProductInfo = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/auth/signup';

  return (
    <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
      <div className="mb-4">
        <p className="font-body text-[14] font-bold tracking-wider uppercase text-gray-400 mb-2">
          Welcome to <span className="text-primary">medicheck</span>
        </p>
        <h2 className="text-4xl font-bold leading-tight mb-6">
          Healthcare is better when <br /> it's handled together.
        </h2>
        <p className="font-body text-gray-600 leading-relaxed">
          Managing health shouldn't feel like a solo mission.{' '}
          <span className="font-bold text-primary ">MediCheck</span> bridges the
          gap between patients, clinics, and the people who care about them
          most. Whether you're organizing your own schedule or supporting a
          loved one, we ensure no detail is overlooked and no appointment is
          missed.
        </p>
      </div>

      <img
        src={isSignup ? '/signup-hero.jpg' : '/login-hero.jpg'}
        alt={isSignup ? 'Elderly hands together' : 'Caregiver support'}
        className="w-full h-[200px] object-cover rounded-3xl mb-8"
      />

      <div className="space-y-4 max-w-3xl">
        {[
          {
            title: 'Track Appointments',
            desc: 'Centralize your medical calendar. Keep every specialist, check-up, and follow-up in one clear, manageable view.',
          },
          {
            title: 'Connect Caregivers',
            desc: 'Invite family and friends to join your support network, ensuring everyone is on the same page.',
          },
          {
            title: 'Request Assistance',
            desc: 'Need a ride to the clinic or help with a prescription? Send a request to your circle in seconds.',
          },
          {
            title: 'Lean on Support',
            desc: 'Caregivers can view active needs, accept tasks, and mark them as complete—so you can focus on recovery.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row items-start gap-1 md:gap-5 border-l-2 border-primary/20 pl-4 md:border-none md:pl-0"
          >
            <h3 className="text-md font-bold text-primary min-w-[180px] shrink-0 pt-0.5">
              {item.title}
            </h3>
            <p className="font-body text-sm text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
