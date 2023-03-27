import PropTypes from 'prop-types';
import React from 'react';
import styles from './infoText.css';

const InfoText = ({ children, className, ...rest }) => (
  <div {...rest} className={`${styles.infoText} ${className}`}>
    {children}
  </div>
);

InfoText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

InfoText.defaultProps = {
  className: '',
};

InfoText.displayName = 'BoxInfoText';

export default InfoText;
