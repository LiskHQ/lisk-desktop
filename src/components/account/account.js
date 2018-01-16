import React from 'react';
import styles from './account.css';
import networks from '../../constants/networks';

/**
 * Contains some of the important and basic information about the account
 *
 * @param {object} props - include properties of component
 */

const Account = ({ peers, t }) => {
  const status = (peers.status && peers.status.online) ?
    <i className="material-icons online">check</i> :
    <i className="material-icons offline">error</i>;

  return (peers.data.options.code !== networks.mainnet.code ?
    <section className={styles.peer}>
      <div className={`${styles.title} inner primary peer-network`}>{t(peers.data.options.name)} <span id="accountStatus" className={`${styles.status} status`}>{status}</span>
      </div>

      <span className={`${styles.current} inner secondary peer`}>
        {peers.data.currentPeer}
        <span>:{peers.data.port}</span>
      </span>
    </section> :
    null
  );
};

export default Account;
