import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Header = ({ children, ...rest }) => (
  <header {...rest} className={styles.header}>{children}</header>
);

Header.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Header.displayName = 'Box.Header';

export default Header;
