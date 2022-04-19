import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import routes from '@screens/router/routes';
import { validateAddress } from '@common/utilities/validators';
import WalletVisual from '@wallet/detail/identity/walletVisual';

import styles from './styles.css';

const WalletInfo = ({
  name = '',
  label,
  address,
  token,
  network,
  addressClass,
  className,
}) => {
  const addressLink = `${routes.account.path}?address=${address}`;
  return (
    <div className={`${styles.walletInfo} ${className}`}>
      <p className={styles.label}>{label}</p>
      <div className={styles.addressRow}>
        <WalletVisual className={styles.avatar} address={address} size={25} />
        { validateAddress(token, address, network) === 0
          ? (
            <Link
              to={addressLink}
              className={`${styles.link} ${name ? styles.hasName : ''}`}
            >
              {name}
              <span className={`${styles.address} ${addressClass}`}>{address}</span>
            </Link>
          ) : (
            <span
              className={`${styles.link} ${name ? styles.hasName : ''}`}
            >
              {name}
              <span className={`${styles.address} ${addressClass}`}>{address}</span>
            </span>
          )}
      </div>
    </div>
  );
};

WalletInfo.propTypes = {
  address: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  addressClass: PropTypes.string,
  name: PropTypes.string,
};

export default WalletInfo;
