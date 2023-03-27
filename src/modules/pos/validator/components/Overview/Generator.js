/* istanbul ignore file */
import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'src/routes/routes';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './Overview.css';

const Generator = ({ generator }) => (
  <div className={`${styles.generator} generator-item`}>
    <Link to={`${routes.explorer.path}?address=${generator.address}`}>
      <WalletVisual address={generator.address} className={styles.walletVisual} />
      <span>{generator.name}</span>
    </Link>
  </div>
);

export default Generator;
