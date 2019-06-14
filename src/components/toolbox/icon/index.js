import React from 'react';
import PropTypes from 'prop-types';
import svgIcons from '../../../utils/svgIcons';

const Icon = ({ name, className, ...props }) => (
  <img src={svgIcons[name]} className={className} {...props} />
);

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.oneOf(Object.keys(svgIcons)).isRequired,
};

Icon.defaultProps = {
  className: '',
};

export default Icon;
