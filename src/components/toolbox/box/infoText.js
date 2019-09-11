import PropTypes from 'prop-types';
import React from 'react';
import styles from './infoText.css';

const InfoText = ({
  children, className, ...rest
}) => (
  <p
    {...rest}
    className={`${styles.infoText} ${className}`}
  >
    {children}
  </p>
);

InfoText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

InfoText.defaultProps = {
  className: '',
};

export default InfoText;
