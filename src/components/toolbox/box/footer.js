import PropTypes from 'prop-types';
import React from 'react';
import styles from './footer.css';

const Footer = ({ children, ...rest }) => (
  <footer {...rest} className={styles.footer}>{children}</footer>
);

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
