import { useRef, useEffect } from 'react';

const PillToggle = ({
  options,
  active,
  onSelect,
  className = '',
  variant = 'default',
}) => {
  const containerRef = useRef(null);
  const activeIndex = options.findIndex((opt) => opt.value === active);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex =
          activeIndex > 0 ? activeIndex - 1 : options.length - 1;
        onSelect(options[prevIndex].value);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex =
          activeIndex < options.length - 1 ? activeIndex + 1 : 0;
        onSelect(options[nextIndex].value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, options, onSelect]);

  const isCompact = variant === 'compact';

  const containerStyles = isCompact
    ? 'bg-white rounded-full shadow-sm border border-gray-100 p-1'
    : 'bg-white rounded-full shadow-sm border border-gray-100 px-1 py-1';

  const activeButtonStyles = isCompact
    ? 'flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white shadow-sm transition-all text-xs font-bold uppercase tracking-wider'
    : 'flex-1 px-10 py-4 rounded-full bg-primary text-white transition-all text-sm uppercase font-bold tracking-wider';

  const inactiveButtonStyles = isCompact
    ? 'flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-700 hover:text-black hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider'
    : 'flex-1 px-10 py-4 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm uppercase font-bold tracking-wider';

  return (
    <div
      ref={containerRef}
      className={`${containerStyles} ${className}`}
      role="tablist"
      aria-label="Toggle options"
    >
      <div className="flex items-center gap-1">
        {options.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            role="tab"
            aria-selected={active === value}
            aria-label={label}
            tabIndex={active === value ? 0 : -1}
            className={
              active === value ? activeButtonStyles : inactiveButtonStyles
            }
          >
            {icon && <span>{icon}</span>}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PillToggle;
