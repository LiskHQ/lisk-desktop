import PropTypes from 'prop-types';
import React from 'react';
import Content from './content';
import FooterButton from './footerButton';
import Header from './header';
import Tabs from '../toolbox/tabs';
import styles from './box.css';

const Box = ({
  main, width, className, children,
}) => {
  const hasHeader = Array.isArray(children) && children.some(child => (
    child && (child.type === 'header' || child.type.displayName === 'Box.Header')
  ));
  return (
    <div className={`
      ${styles.wrapper}
      ${hasHeader ? styles.withHeader : ''}
      ${main ? styles.main : ''}
      ${styles[width]}
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
  width: PropTypes.oneOf(['full', 'medium']),
};

Box.defaultPropTypes = {
  className: '',
  width: 'full',
};

Box.Header = Header;
Box.Tabs = Tabs;
Box.Tabs.displayName = 'Box.Tabs';
Box.Content = Content;
Box.FooterButton = FooterButton;

export default Box;
