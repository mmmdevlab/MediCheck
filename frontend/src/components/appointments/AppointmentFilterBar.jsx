import React from 'react';
import PropTypes from 'prop-types';
import { FILTER_OPTIONS } from '../../utils/constants';

const AppointmentFilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`
            px-6 py-3 rounded-full
            font-bold text-sm uppercase tracking-wide
            whitespace-nowrap
            transition-all duration-200
            ${
              activeFilter === option.value
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border-1 border-gray-100'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

AppointmentFilterBar.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default AppointmentFilterBar;
