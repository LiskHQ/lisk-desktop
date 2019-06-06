import React from 'react';
import PropTypes from 'prop-types';
import svgIcons from '../../../utils/svgIcons';

const Icon = ({ name, className, ...props }) => (
  <img src={svgIcons[name]} className={className} {...props} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Icon.defaultProps = {
  className: '',
};

export default Icon;
