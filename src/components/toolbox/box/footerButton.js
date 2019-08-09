import PropTypes from 'prop-types';
import React from 'react';
import styles from './footerButton.css';

const FooterButton = ({ children, ...rest }) => (
  <button {...rest} className={styles.footerButton}>{children}</button>
);

FooterButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FooterButton;
