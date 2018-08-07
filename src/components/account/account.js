import React from 'react';
import { FontIcon } from '../fontIcon';
import networks from '../../constants/networks';
import styles from './account.css';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */

const Account = ({ peers, t }) => {
  const iconMap = ['mainnet', 'testnet', 'devnet'];
  const translations = iconMap.map(code => t(code));
  const status = (peers.status && peers.status.online) ?
    <FontIcon className={`${styles.network} online`} value={iconMap[peers.options.code]} /> :
    <FontIcon className='offline' value='error' />;

  return ((peers.data &&
      peers.options.code !== networks.mainnet.code) ?
    <section className={styles.peer}>
      <div className={`${styles.title} inner primary peer-network`}>
        <span id="accountStatus" className={`${styles.status} status`}>
          {status}
          {t('Connected to ')}{translations[peers.options.code]}
        </span>
        <span className={`${styles.current} inner secondary peer`}>
          {peers.data.currentNode}
        </span>
      </div>
    </section> :
    null
  );
};

export default Account;
