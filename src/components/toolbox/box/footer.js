import PropTypes from 'prop-types';
import React from 'react';
import styles from './footer.css';

const Footer = ({ children, ...rest }) => (
  <div {...rest} className={styles.footer}>{children}</div>
);

Footer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

Footer.displayName = 'Box.Footer';

export default Footer;
