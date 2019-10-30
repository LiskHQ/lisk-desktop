import PropTypes from 'prop-types';
import React from 'react';
import styles from './footer.css';

const Footer = ({ children, className, ...rest }) => (
  <footer {...rest} className={`${styles.footer} ${className}`}>{children}</footer>
);

Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Footer.defaultProps = {
  className: '',
};

Footer.displayName = 'BoxFooter';

export default Footer;
