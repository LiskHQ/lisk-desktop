import React from 'react';
import svgIcons from '../../../utils/svgIcons';

const Icon = ({ name, className }) => (
  <img src={svgIcons[name]} className={className} />
);
export default Icon;
