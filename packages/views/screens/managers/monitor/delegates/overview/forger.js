import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@constants';
import AccountVisual from '@views/basics/accountVisual';
import styles from './overview.css';

const Forger = ({ forger }) => (
  <div className={`${styles.forger} forger-item`}>
    <Link to={`${routes.account.path}?address=${forger.address}`}>
      <AccountVisual
        address={forger.address}
        className={styles.accountVisual}
      />
      <span>{forger.username}</span>
    </Link>
  </div>
);

export default Forger;
