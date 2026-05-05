import { UserMinus, ShieldAlert } from 'lucide-react';
import { FEELING_SCORES } from '../../utils/constants';
import ActiveButton from '../UI/ActionButton';

const ConnectionCard = ({ connection, onRemove, userRole }) => {
  const {
    fullName,
    email,
    relationshipType = 'family',
    latestFeelingScore,
  } = connection;

  const displayName = fullName || 'Unknown User';

  const getInitials = (n) => {
    return (
      n
        ?.split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??'
    );
  };

  const getRelationshipLabel = (type) => {
    const labels = {
      family: 'Family',
      friend: 'Friend',
      professional: 'Professional',
    };
    return labels[type] || type;
  };

  const handleLimitAccess = () => {
    // intentionally left blank for now (no debug logging in production)
  };

  return (
    <div className="w-full bg-[#EEF1F5] rounded-3xl p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-15 h-15 rounded-full bg-gray-700 flex items-center justify-center text-white uppercase tracking-widest font-bold text-xl">
            {getInitials(displayName)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-black truncate">
              {displayName}
            </h3>
            <p className="text-md text-gray-500 font-medium">{email}</p>
            <div className="flex items-center mt-2">
              <span className="px-4 py-1 bg-yellow-400 text-[10px] font-bold uppercase tracking-widest text-black rounded-full">
                {getRelationshipLabel(relationshipType)}
              </span>
              {userRole === 'caregiver' && latestFeelingScore && (
                <>
                  <span className="text-gray-300">•</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${FEELING_SCORES[latestFeelingScore].bgColor}`}
                  >
                    {(() => {
                      const FeelingIcon =
                        FEELING_SCORES[latestFeelingScore].icon;
                      return (
                        <FeelingIcon
                          className={`w-5 h-5 ${FEELING_SCORES[latestFeelingScore].textColor}`}
                          strokeWidth={2}
                        />
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={handleLimitAccess}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-[#EE4444] text-sm font-bold uppercase tracking-wide"
          >
            <ShieldAlert size={15} />
            Limit Access
          </button>
          {onRemove && (
            <>
              <ActiveButton
                variant="danger"
                onClick={() => onRemove(connection)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-[#EE4444] text-white rounded-full text-sm font-bold uppercase tracking-wide transition-colors"
              >
                <UserMinus size={15} />
                Remove
              </ActiveButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
