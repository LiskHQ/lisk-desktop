import PropTypes from 'prop-types';
import React from 'react';
import styles from './box.css';

const Header = ({ children, ...rest }) => (
  <header {...rest} className={styles.header}>{children}</header>
);

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
