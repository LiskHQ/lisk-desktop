import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Header = ({ children, className, ...rest }) => (
  <header {...rest} className={`${styles.header} ${className}`}>
    {children}
  </header>
);

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

Header.displayName = 'BoxHeader';

export default Header;
