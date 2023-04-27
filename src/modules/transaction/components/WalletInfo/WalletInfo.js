import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import routes from 'src/routes/routes';
import { validateAddress } from 'src/utils/validators';
import WalletVisual from '@wallet/components/walletVisual';

import styles from './WalletInfo.css';

// @todo removed token and network
const WalletInfo = ({ name = '', label, address, addressClass, className }) => {
  const addressLink = `${routes.explorer.path}?address=${address}`;
  return (
    <div className={`${styles.walletInfo} ${className}`}>
      {!!label && <p className={styles.label}>{label}</p>}
      <div className={styles.addressRow}>
        <WalletVisual className={styles.avatar} address={address} size={25} />
        {validateAddress(address) === 0 ? (
          <Link to={addressLink} className={`${styles.link} ${name ? styles.hasName : ''}`}>
            {name}
            <span className={`${styles.address} ${addressClass}`}>{address}</span>
          </Link>
        ) : (
          <span className={`${styles.link} ${name ? styles.hasName : ''}`}>
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
  label: PropTypes.string,
  addressClass: PropTypes.string,
  name: PropTypes.string,
};

export default WalletInfo;
