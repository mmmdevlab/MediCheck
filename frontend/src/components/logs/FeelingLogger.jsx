import PropTypes from 'prop-types';
import { Laugh, SmilePlus, Smile, Meh, Frown } from 'lucide-react';

const FEELINGS = [
  {
    id: 5,
    label: 'Very Well',
    icon: Laugh,
    color: 'bg-[#B0FB60] hover:bg-[#B0FB60]',
    selectedColor: 'bg-[#7FD91F]',
    textColor: 'text-black',
  },
  {
    id: 4,
    label: 'Good',
    icon: SmilePlus,
    color: 'bg-[#FFDD47] hover:bg-[#FFDD47]',
    selectedColor: 'bg-[#ECC414]',
    textColor: 'text-black',
  },
  {
    id: 3,
    label: 'Okay',
    icon: Smile,
    color: 'bg-[#FFA047] hover:bg-[#FFA047]',
    selectedColor: 'bg-[#EE8421]',
    textColor: 'text-black',
  },
  {
    id: 2,
    label: 'Unwell',
    icon: Meh,
    color: 'bg-[#FF6F5C] hover:bg-[#FF6F5C]',
    selectedColor: 'bg-[#DB4935]',
    textColor: 'text-white',
  },
  {
    id: 1,
    label: 'Very Unwell',
    icon: Frown,
    color: 'bg-[#E43737] hover:bg-[#E43737]',
    selectedColor: 'bg-[#C52526]',
    textColor: 'text-white',
  },
];

const FeelingLogger = ({ onFeelingLog, lastLoggedFeeling = null }) => {
  const handleFeelingClick = (feeling) => {
    onFeelingLog(feeling);
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
          YOUR STATUS
        </p>
        <h2 className="text-2xl font-bold text-gray-800">
          How Are You Feeling Today?
        </h2>
      </div>

      <div className="flex gap-3 justify-between">
        {FEELINGS.map((feeling) => {
          const isSelected = lastLoggedFeeling === feeling.id;
          const IconComponent = feeling.icon;

          return (
            <button
              key={feeling.id}
              type="button"
              onClick={() => handleFeelingClick(feeling)}
              className={`
                flex flex-col items-center justify-center
                px-4 py-6 rounded-2xl
                transition-all duration-200 flex-1
                ${isSelected ? feeling.selectedColor : feeling.color}
                ${isSelected ? 'scale-105 shadow-sm' : 'hover:scale-105'}
                focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2
              `}
              aria-label={`Log feeling: ${feeling.label}`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center justify-center mb-2">
                <IconComponent
                  className={`w-10 h-10 ${feeling.textColor}`}
                  strokeWidth={2}
                />
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wide ${feeling.textColor}`}
              >
                {feeling.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

FeelingLogger.propTypes = {
  onFeelingLog: PropTypes.func.isRequired,
  lastLoggedFeeling: PropTypes.number,
};

export default FeelingLogger;
