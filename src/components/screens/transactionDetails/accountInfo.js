import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import routes from '@constants';
import { validateAddress } from '@utils/validators';
import AccountVisual from '../../toolbox/accountVisual';
import styles from './transactionDetails.css';

const AccountInfo = ({
  address,
  label,
  addressClass,
  name,
  token,
  network,
}) => {
  const addressLink = routes.account.path;
  return (
    <div className={styles.accountInfo}>
      <p className={styles.label}>{label}</p>
      <div className={styles.addressRow}>
        <AccountVisual className={styles.avatar} address={address} size={25} />
        { validateAddress(token, address, network) === 0
          ? (
            <Link
              to={`${addressLink}?address=${address}`}
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

AccountInfo.defaultProps = {
  addressClass: '',
  name: '',
};

export default AccountInfo;
