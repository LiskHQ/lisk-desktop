import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import AccountVisual from '../../accountVisual';
import routes from '../../../constants/routes';
import styles from './transactionDetailView.css';

const AccountInfo = ({
  address, label, addressClass, name,
}) => {
  const addressLink = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  return (
    <div className={styles.accountInfo}>
      <p className={styles.label}>{label}</p>
      <div className={styles.addressRow}>
        <AccountVisual className={styles.avatar} address={address} size={24} />
        <Link
          to={`${addressLink}/${address}`}
          className={`${styles.link} ${name ? styles.hasName : ''}`}
        >
          {name}
          <span className={`${styles.address} ${addressClass}`}>{address}</span>
        </Link>
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
