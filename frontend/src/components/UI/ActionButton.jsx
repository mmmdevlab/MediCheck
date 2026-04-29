import React from 'react';

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'flex items-center justify-center gap-2 rounded-full transition-all active:scale-95 flex-shrink-0 font-bold text-xs';

  const disabledStyles = disabled
    ? 'opacity-30 cursor-not-allowed grayscale active:scale-100'
    : 'cursor-pointer';

  const variants = {
    primary: 'bg-[#3177FE] text-white hover:bg-[#2563EB]',
    secondary: 'bg-[#EEF1F5] text-black hover:bg-[#E0E4E9]',
    action: 'bg-black text-white hover:bg-gray-800',
    danger: 'bg-[#EE4444] text-white hover:bg-[#DC2626]',
    outline: 'border border-gray-200 text-gray-600 hover:bg-gray-50',
  };

  const padding =
    typeof children === 'string' || React.Children.count(children) > 1
      ? 'px-4 py-2'
      : 'w-9 h-9';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`${baseStyles} ${variants[variant]} ${padding} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
