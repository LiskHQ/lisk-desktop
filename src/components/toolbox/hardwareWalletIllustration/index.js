import PropTypes from 'prop-types';
import React from 'react';
import Illustration from '../illustration';
import styles from './hardwareWalletIllustration.css';

const HardwareWalletIllustration = ({ account, size }) => (
  account.loginType
    ? (
      <Illustration
        name={account.loginType}
        className={`${styles.wrapper} ${styles[size]}`}
      />
    )
    : null
);

HardwareWalletIllustration.propTypes = {
  account: PropTypes.shape({}).isRequired,
  size: PropTypes.oneOf(['s', 'l']),
};

HardwareWalletIllustration.defaultProps = {
  size: 'l',
};

export default HardwareWalletIllustration;
