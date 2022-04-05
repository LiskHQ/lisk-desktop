import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import routes from '@screens/router/routes';
import { validateAddress } from '@common/utilities/validators';
import AccountVisual from '@wallet/detail/info/accountVisual';

import styles from './styles.css';

const AccountInfo = ({
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
    <div className={`${styles.accountInfo} ${className}`}>
      <p className={styles.label}>{label}</p>
      <div className={styles.addressRow}>
        <AccountVisual className={styles.avatar} address={address} size={25} />
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

AccountInfo.propTypes = {
  address: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  addressClass: PropTypes.string,
  name: PropTypes.string,
};

export default AccountInfo;
