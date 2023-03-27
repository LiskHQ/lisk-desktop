import PropTypes from 'prop-types';
import React from 'react';
import styles from './footerButton.css';

const FooterButton = ({ children, className, onClick, ...rest }) => (
  <button {...rest} className={`${styles.footerButton} ${className}`} onClick={onClick}>
    {children}
  </button>
);

FooterButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

FooterButton.defaultProps = {
  className: '',
};

FooterButton.displayName = 'BoxFooterButton';

export default FooterButton;
