import PropTypes from 'prop-types';
import React from 'react';

import svgIcons from '../../../utils/svgIcons';

const Icon = ({ name, className }) => (
  <img src={svgIcons[name]} className={className} />
);

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(svgIcons)).isRequired,
  className: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  className: '',
};

export default Icon;
