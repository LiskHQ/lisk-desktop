import React from 'react';
import { Link } from 'react-router-dom';
import AccountVisual from '../../accountVisual';
import styles from './transactionDetailViewV2.css';
import routes from '../../../constants/routes';

const AccountInfo = ({ address, label, addressClass = '' }) => {
  const addressLink = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
  return (
    <div className={styles.accountInfo}>
      <AccountVisual address={address} size={36} />
      <div>
        <p className={styles.label}>{label}</p>
        <Link
          to={`${addressLink}/${address}`}
          className={`${styles.address} ${addressClass}`}>{address}</Link>
      </div>
    </div>
  );
};

export default AccountInfo;
