import React from 'react';
import PropTypes from 'prop-types';
import svgIcons from '../../../utils/svgIcons';

const Icon = ({ name, ...props }) => (
  <img src={svgIcons[name]} {...props} />
);

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(svgIcons)).isRequired,
};

export default Icon;
