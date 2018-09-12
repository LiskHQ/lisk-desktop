import React from 'react';
import Lisk from 'lisk-elements';
import { FontIcon } from '../fontIcon';
import networks from '../../constants/networks';
import styles from './account.css';


/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */

const Account = ({ peers, t, showNetworkIndicator }) => {
  const iconMap = ['mainnet', 'testnet', 'devnet'];
  const translations = iconMap.map(code => t(code));

  let iconCode = peers.options.code;
  if (iconCode === 2) {
    iconCode = (peers.options.nethash === Lisk.constants.MAINNET_NETHASH) ?
      networks.mainnet.code : iconCode;
    iconCode = (peers.options.nethash === Lisk.constants.TESTNET_NETHASH) ?
      networks.testnet.code : iconCode;
  }

  const status = (peers.status && peers.status.online) ?
    <FontIcon className={`${styles.network} online`} value={iconMap[iconCode]} /> :
    <FontIcon className='offline' value='error' />;

  const shouldShowNetworkIndicator = (peers.data &&
      (showNetworkIndicator || peers.options.code !== networks.mainnet.code));

  return (shouldShowNetworkIndicator ?
    <section className={styles.peer}>
      <div className={`${styles.title} ${`${styles[`${iconMap[iconCode]}Title`]}`} inner primary peer-network ${iconMap[iconCode]}-title`}>
        <span id="accountStatus" className={`${styles.status} network-status`}>
          {status}
          {t('Connected to ')}{translations[iconCode]}
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
