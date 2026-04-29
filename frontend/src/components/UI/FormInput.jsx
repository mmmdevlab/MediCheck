const FormInput = ({
  label,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-bold tracking-wider text-gray-900 uppercase">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 
          bg-background 
          rounded-full 
          border-none 
          outline-none 
          text-gray-900 
          placeholder:text-gray-400
          focus:ring-2 focus:ring-primary focus:ring-opacity-50
          transition-all
          ${error ? 'ring-2 ring-danger' : ''}
        `}
        {...register}
        {...props}
      />

      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
