import React from 'react';
import style from './fontIcon.css';

/**
 * open http://localhost:8080/assets/fonts/Iconfont/icons.html in browser to see list of icons
 */
const FontIcon = (
  { children, className, value, ...other },
) => {
  const icon = value || children;
  return (<span
    className={`${style.icon} ${style[icon]} ${className}`}
    {...other}></span>);
};

FontIcon.defaultProps = {
  className: '',
};

export default FontIcon;
export { FontIcon };
