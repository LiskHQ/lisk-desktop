import PropTypes from 'prop-types';
import React from 'react';
import Content from './content';
import Header from './header';
import Tabs from '../toolbox/tabs';
import styles from './box.css';

const Box = ({ main, className, children }) => {
  const hasHeader = Array.isArray(children) && children.some(child => (
    child && (child.type === 'header' || child.type.displayName === 'Box.Header')
  ));
  return (
    <div className={`
      ${styles.wrapper}
      ${hasHeader ? styles.withHeader : ''}
      ${main ? styles.main : ''}
      ${className}`}
    >
      { children }
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  className: PropTypes.string,
};

Box.defaultPropTypes = {
  className: '',
};

Box.Header = Header;
Box.Tabs = Tabs;
Box.Content = Content;

export default Box;
