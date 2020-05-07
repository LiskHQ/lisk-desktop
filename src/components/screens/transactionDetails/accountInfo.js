import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import AccountVisual from '../../toolbox/accountVisual';
import routes from '../../../constants/routes';
import styles from './transactionDetails.css';
import { validateAddress } from '../../../utils/validators';

const AccountInfo = ({
  address,
  label,
  addressClass,
  name,
  token,
  netCode,
}) => {
  const addressLink = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  return (
    <div className={styles.accountInfo}>
      <p className={styles.label}>{label}</p>
      <div className={styles.addressRow}>
        <AccountVisual className={styles.avatar} address={address} size={24} />
        { validateAddress(token, address, netCode) === 0
          ? (
            <Link
              to={`${addressLink}/${address}`}
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
