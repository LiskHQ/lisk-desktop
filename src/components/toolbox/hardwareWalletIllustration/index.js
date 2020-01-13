import PropTypes from 'prop-types';
import React from 'react';
import { loginType } from '../../../constants/hwConstants';
import Illustration from '../illustration';
import styles from './hardwareWalletIllustration.css';

const illustrationMapping = {
  [loginType.trezor]: 'trezor',
  [loginType.ledger]: 'ledgerNano',
};

const HardwareWalletIllustration = ({ account, size }) => (
  illustrationMapping[account.loginType]
    ? (
      <Illustration
        name={illustrationMapping[account.loginType]}
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
