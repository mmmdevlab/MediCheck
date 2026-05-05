import { FEELING_SCORES } from '../../utils/constants';

const FeelingLogger = ({ onFeelingLog, lastLoggedFeeling = null }) => {
  const feelingOptions = Object.entries(FEELING_SCORES)
    .map(([key, val]) => ({ ...val, id: Number(val.id ?? key) }))
    .sort((a, b) => b.id - a.id);

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
          YOUR STATUS
        </p>
        <h1 className="text-3xl font-bold text-black">
          How are you feeling today?
        </h1>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-2">
        {feelingOptions.map((feeling) => {
          const isSelected = lastLoggedFeeling === feeling.id;
          const Icon = feeling.icon;

          return (
            <button
              key={feeling.id}
              type="button"
              onClick={() => onFeelingLog(feeling)}
              className={`flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-200 ${feeling.bgColor} ${feeling.textColor} ${isSelected ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-105'}
  `}
            >
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" strokeWidth={2} />
              <span className="text-[14px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-wide">
                {feeling.label.split(' ')[0]}{' '}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeelingLogger;
