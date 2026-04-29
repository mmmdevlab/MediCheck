const FormSelect = ({
  label,
  options,
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

      <select
        className={`
          w-full px-4 py-3 
          bg-background 
          rounded-xl 
          border-none 
          outline-none 
          text-gray-900
          focus:ring-2 focus:ring-primary focus:ring-opacity-50
          transition-all
          cursor-pointer
          ${error ? 'ring-2 ring-danger' : ''}
        `}
        {...register}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;
