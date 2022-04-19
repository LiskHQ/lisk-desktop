import React from 'react';
import { Link } from 'react-router-dom';

import routes from '@screens/router/routes';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import styles from './overview.css';

const Forger = ({ forger }) => (
  <div className={`${styles.forger} forger-item`}>
    <Link to={`${routes.account.path}?address=${forger.address}`}>
      <WalletVisual
        address={forger.address}
        className={styles.walletVisual}
      />
      <span>{forger.username}</span>
    </Link>
  </div>
);

export default Forger;
