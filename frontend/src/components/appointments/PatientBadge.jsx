import React from 'react';
import PropTypes from 'prop-types';
import { BADGE_COLORS } from '../../utils/constants';

const PatientBadge = ({ name }) => {
  const colorIndex =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    BADGE_COLORS.length;

  const colorClass = BADGE_COLORS[colorIndex];

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full
        text-xs font-bold uppercase tracking-wide
        ${colorClass}
      `}
    >
      {name}
    </span>
  );
};

PatientBadge.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PatientBadge;
